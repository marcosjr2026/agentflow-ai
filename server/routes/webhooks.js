import { Router } from 'express';
import { db } from '../db/index.js';
import { agencies } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { normalizePhone } from '../services/whatsapp.js';
import { processInboundMessage } from '../services/oag-engine.js';

export const webhooksRouter = Router();

// ─── WEBHOOK DE WHATSAPP (360Dialog) ─────────────────────────────────────────
// POST /api/webhooks/whatsapp/:agency_id
webhooksRouter.post('/whatsapp/:agencyId', async (req, res) => {
  // Responder 200 inmediatamente (360Dialog requiere respuesta rápida)
  res.status(200).json({ status: 'ok' });

  const { agencyId } = req.params;

  try {
    const body = req.body;

    // Verificar estructura del webhook de 360Dialog
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const waMessage = value?.messages?.[0];

    if (!waMessage) return; // No es un mensaje (puede ser status update)

    const fromNumber = normalizePhone(waMessage.from);
    const messageText = waMessage.text?.body || '';
    const messageType = waMessage.type || 'text';
    const waMessageId = waMessage.id;

    // Buscar la agencia
    const [agency] = await db.select().from(agencies)
      .where(eq(agencies.id, agencyId)).limit(1);

    if (!agency || agency.status !== 'active') return;

    // Solo procesar mensajes de texto por ahora
    if (messageType !== 'text' || !messageText) return;

    // ─── OAG ENGINE — Motor de conversación con Soul v1.1 ────────────────────
    await processInboundMessage({
      agencyId,
      from: fromNumber,
      messageText,
      waMessageId,
    });

  } catch (err) {
    console.error('Error procesando webhook WhatsApp:', err);
  }
});

// ─── VERIFICACIÓN DEL WEBHOOK ─────────────────────────────────────────────────
// GET /api/webhooks/whatsapp/:agency_id (verificación inicial de 360Dialog)
webhooksRouter.get('/whatsapp/:agencyId', (req, res) => {
  const { hub_mode, hub_verify_token, hub_challenge } = req.query;

  if (hub_mode === 'subscribe' && hub_verify_token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.send(hub_challenge);
  } else {
    res.status(403).json({ error: 'Verificación fallida' });
  }
});
