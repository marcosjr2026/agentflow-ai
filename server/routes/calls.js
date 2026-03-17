import { Router } from 'express';
import multer from 'multer';
import { db } from '../db/index.js';
import { calls, callEvaluations, users, contacts } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { transcribeAudio, evaluateCall } from '../services/ai.js';

export const callsRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// GET /api/calls
callsRouter.get('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { agentId, limit = 50, offset = 0 } = req.query;

    const conditions = [eq(calls.agencyId, agencyId)];
    if (agentId) conditions.push(eq(calls.agentId, agentId));

    const rows = await db.select({
      id: calls.id,
      audioUrl: calls.audioUrl,
      durationSeconds: calls.durationSeconds,
      score: calls.score,
      calledAt: calls.calledAt,
      createdAt: calls.createdAt,
      agent: { id: users.id, name: users.name },
      contact: { id: contacts.id, name: contacts.name, whatsappNumber: contacts.whatsappNumber },
    })
      .from(calls)
      .leftJoin(users, eq(users.id, calls.agentId))
      .leftJoin(contacts, eq(contacts.id, calls.contactId))
      .where(and(...conditions))
      .orderBy(desc(calls.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({ calls: rows, total: rows.length });
  } catch (err) {
    console.error('Error listando llamadas:', err);
    res.status(500).json({ error: 'Error al cargar llamadas' });
  }
});

// POST /api/calls/upload
callsRouter.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { agentId, contactId, calledAt } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Archivo de audio requerido' });
    if (!agentId) return res.status(400).json({ error: 'agentId requerido' });

    // Crear registro inicial
    const [call] = await db.insert(calls).values({
      agencyId,
      agentId,
      contactId: contactId || null,
      calledAt: calledAt ? new Date(calledAt) : new Date(),
      durationSeconds: Math.floor(req.file.size / 8000), // estimado
    }).returning();

    // Responder inmediatamente con el call ID
    res.status(202).json({ callId: call.id, status: 'processing' });

    // Procesar en background
    (async () => {
      try {
        // Transcribir
        const transcript = await transcribeAudio(req.file.buffer, req.file.originalname);

        // Evaluar con AI
        const evaluation = await evaluateCall(transcript);

        // Actualizar en DB
        await db.update(calls)
          .set({ transcript, score: evaluation.score, evaluation })
          .where(eq(calls.id, call.id));

        // Guardar evaluación detallada
        await db.insert(callEvaluations).values({
          callId: call.id,
          agencyId,
          agentId,
          askedAge: evaluation.asked_age,
          askedZipcode: evaluation.asked_zipcode,
          askedNeed: evaluation.asked_need,
          handledPriceObjection: evaluation.handled_price_objection,
          handledCompetitorObjection: evaluation.handled_competitor_objection,
          attemptedClose: evaluation.attempted_close,
          closeSuccessful: evaluation.close_successful,
          missedOpportunities: evaluation.missed_opportunities,
          positives: evaluation.positives,
          improvements: evaluation.improvements,
          recommendations: evaluation.recommendations,
          score: evaluation.score,
        });

        console.log(`✅ Llamada ${call.id} evaluada. Score: ${evaluation.score}/100`);
      } catch (err) {
        console.error(`Error procesando llamada ${call.id}:`, err);
      }
    })();

  } catch (err) {
    console.error('Error subiendo llamada:', err);
    res.status(500).json({ error: 'Error al procesar la llamada' });
  }
});

// GET /api/calls/:id
callsRouter.get('/:id', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    const [call] = await db.select().from(calls)
      .where(and(eq(calls.id, id), eq(calls.agencyId, agencyId))).limit(1);

    if (!call) return res.status(404).json({ error: 'Llamada no encontrada' });

    const [evaluation] = await db.select().from(callEvaluations)
      .where(eq(callEvaluations.callId, id)).limit(1);

    res.json({ call, evaluation });
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar llamada' });
  }
});
