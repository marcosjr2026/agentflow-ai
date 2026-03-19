/**
 * Baileys Service — WhatsApp por número del cliente
 * Cada agencia tiene su propia sesión Baileys.
 * El cliente escanea un QR desde el Dashboard para conectar.
 *
 * Sesiones guardadas en: /tmp/baileys-sessions/<agencyId>/
 */

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { processInboundMessage } from './oag-engine.js';

// ─── MAPA DE SESIONES ACTIVAS ─────────────────────────────────────────────────
// agencyId → { socket, status, qr, phone }
const sessions = new Map();

const SESSIONS_DIR = process.env.BAILEYS_SESSIONS_DIR || '/tmp/baileys-sessions';

function getSessionPath(agencyId) {
  return path.join(SESSIONS_DIR, agencyId);
}

// ─── CREAR / RESTAURAR SESIÓN ─────────────────────────────────────────────────
export async function createSession(agencyId, onQR, onConnected, onDisconnected) {
  // Si ya hay sesión activa, no crear otra
  if (sessions.has(agencyId)) {
    const existing = sessions.get(agencyId);
    if (existing.status === 'open') {
      onConnected?.(existing.phone);
      return existing;
    }
  }

  const sessionPath = getSessionPath(agencyId);
  fs.mkdirSync(sessionPath, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: ['AgentFlow AI', 'Chrome', '1.0.0'],
    generateHighQualityLinkPreview: false,
    syncFullHistory: false,
  });

  const session = {
    socket: sock,
    status: 'connecting',
    qr: null,
    phone: null,
    agencyId,
  };

  sessions.set(agencyId, session);

  // ─── EVENTOS ───────────────────────────────────────────────────────────────
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      // Generar QR como data URL para mostrar en el Dashboard
      const qrDataUrl = await qrcode.toDataURL(qr);
      session.qr = qrDataUrl;
      session.status = 'qr_ready';
      onQR?.(qrDataUrl);
    }

    if (connection === 'open') {
      session.status = 'open';
      session.qr = null;
      session.phone = sock.user?.id?.split(':')[0] || 'unknown';
      console.log(`✅ Baileys conectado [${agencyId}]: ${session.phone}`);
      onConnected?.(session.phone);
    }

    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = reason !== DisconnectReason.loggedOut;

      console.log(`⚠️ Baileys desconectado [${agencyId}] razón: ${reason}`);
      session.status = 'disconnected';
      onDisconnected?.(reason, shouldReconnect);

      if (shouldReconnect) {
        console.log(`🔄 Reconectando [${agencyId}]...`);
        setTimeout(() => createSession(agencyId, onQR, onConnected, onDisconnected), 5000);
      } else {
        // Logged out — limpiar sesión
        sessions.delete(agencyId);
        fs.rmSync(getSessionPath(agencyId), { recursive: true, force: true });
      }
    }
  });

  // ─── MENSAJES ENTRANTES → OAG ENGINE ──────────────────────────────────────
  sock.ev.on('messages.upsert', async ({ messages: msgs, type }) => {
    if (type !== 'notify') return;

    for (const msg of msgs) {
      // Ignorar mensajes propios, grupos, y status
      if (msg.key.fromMe) continue;
      if (msg.key.remoteJid?.endsWith('@g.us')) continue; // grupo
      if (msg.key.remoteJid === 'status@broadcast') continue;

      const from = msg.key.remoteJid?.replace('@s.whatsapp.net', '');
      const messageText = msg.message?.conversation
        || msg.message?.extendedTextMessage?.text
        || msg.message?.imageMessage?.caption
        || '';

      if (!messageText.trim()) continue;

      const fromFormatted = from.startsWith('+') ? from : `+${from}`;
      console.log(`📩 [${agencyId}] Mensaje de ${fromFormatted}: ${messageText.substring(0, 50)}...`);

      try {
        await processInboundMessage({
          agencyId,
          from: fromFormatted,
          messageText,
          waMessageId: msg.key.id,
          // Pasar el socket para que el OAG engine pueda responder
          _baileysSocket: sock,
        });
      } catch (err) {
        console.error(`Error OAG Engine [${agencyId}]:`, err.message);
      }
    }
  });

  return session;
}

// ─── ENVIAR MENSAJE ───────────────────────────────────────────────────────────
export async function sendMessage(agencyId, to, text) {
  const session = sessions.get(agencyId);

  if (!session || session.status !== 'open') {
    throw new Error(`No hay sesión activa para agencia ${agencyId}`);
  }

  const jid = to.replace('+', '') + '@s.whatsapp.net';
  await session.socket.sendMessage(jid, { text });
  console.log(`📤 [${agencyId}] → ${to}: ${text.substring(0, 50)}...`);
}

// ─── ESTADO DE SESIÓN ─────────────────────────────────────────────────────────
export function getSessionStatus(agencyId) {
  const session = sessions.get(agencyId);
  if (!session) return { status: 'disconnected', qr: null, phone: null };
  return {
    status: session.status === 'open' ? 'connected' : session.status,
    qr: session.qr,
    phone: session.phone,
  };
}

// ─── DESCONECTAR ──────────────────────────────────────────────────────────────
export async function disconnectSession(agencyId) {
  const session = sessions.get(agencyId);
  if (!session) return;
  await session.socket.logout();
  sessions.delete(agencyId);
  fs.rmSync(getSessionPath(agencyId), { recursive: true, force: true });
  console.log(`🔌 Sesión Baileys eliminada [${agencyId}]`);
}

// ─── RESTAURAR SESIONES AL INICIO ────────────────────────────────────────────
export async function restoreAllSessions() {
  if (!fs.existsSync(SESSIONS_DIR)) return;
  const dirs = fs.readdirSync(SESSIONS_DIR);
  console.log(`🔄 Restaurando ${dirs.length} sesiones Baileys...`);
  for (const agencyId of dirs) {
    const sessionPath = path.join(SESSIONS_DIR, agencyId);
    if (fs.statSync(sessionPath).isDirectory()) {
      createSession(agencyId,
        () => {}, // onQR — no hacer nada al restaurar
        (phone) => console.log(`✅ Sesión restaurada [${agencyId}]: ${phone}`),
        (reason) => console.log(`⚠️ Fallo restauración [${agencyId}]: ${reason}`)
      ).catch(err => console.error(`Error restaurando [${agencyId}]:`, err.message));
    }
  }
}
