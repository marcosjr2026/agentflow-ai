/**
 * OAG Routes — Motor de conversación
 * POST /api/oag/message — enviar mensaje de prueba directamente
 * POST /api/oag/config  — configurar Capa 2 del OAG (nombre, tono, scripts)
 * GET  /api/oag/config  — leer config actual
 */

import { Router } from 'express';
import { processInboundMessage } from '../services/oag-engine.js';
import { db } from '../db/index.js';
import { agencies } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const oagRouter = Router();

// POST /api/oag/message — test del motor (admin only)
oagRouter.post('/message', async (req, res) => {
  try {
    const { agencyId, from, message } = req.body;

    if (!agencyId || !from || !message) {
      return res.status(400).json({ error: 'agencyId, from, y message son requeridos' });
    }

    const result = await processInboundMessage({
      agencyId,
      from,
      messageText: message,
      waMessageId: `test_${Date.now()}`,
    });

    res.json(result);
  } catch (err) {
    console.error('OAG message error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/oag/config — leer config Capa 2
oagRouter.get('/config', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const [agency] = await db.select().from(agencies)
      .where(eq(agencies.id, agencyId)).limit(1);

    res.json(agency?.metadata?.oag || {
      nombre: 'Ana',
      tono: 'cálido y profesional',
      scripts: '',
      horario: 'Lunes a Viernes 8am-6pm ET',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/oag/config — actualizar config Capa 2
oagRouter.put('/config', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { nombre, tono, scripts, horario } = req.body;

    const [agency] = await db.select().from(agencies)
      .where(eq(agencies.id, agencyId)).limit(1);

    const currentMeta = agency?.metadata || {};
    const newOagConfig = {
      ...currentMeta.oag,
      ...(nombre && { nombre }),
      ...(tono && { tono }),
      ...(scripts !== undefined && { scripts }),
      ...(horario && { horario }),
    };

    await db.update(agencies)
      .set({ metadata: { ...currentMeta, oag: newOagConfig } })
      .where(eq(agencies.id, agencyId));

    res.json({ success: true, config: newOagConfig });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
