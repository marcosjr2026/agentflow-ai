import { Router } from 'express';
import { db } from '../db/index.js';
import { conversations, messages, contacts, users, tasks } from '../db/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';
import { sendTextMessage } from '../services/whatsapp.js';
import { agencies } from '../db/schema.js';

export const conversationsRouter = Router();

// GET /api/conversations — Lista conversaciones activas de la agencia
conversationsRouter.get('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { status = 'open', limit = 50, offset = 0 } = req.query;

    const convos = await db.select({
      id: conversations.id,
      status: conversations.status,
      context: conversations.context,
      createdAt: conversations.createdAt,
      updatedAt: conversations.updatedAt,
      contact: {
        id: contacts.id,
        name: contacts.name,
        whatsappNumber: contacts.whatsappNumber,
        type: contacts.type,
        planType: contacts.planType,
      },
      assignedTo: {
        id: users.id,
        name: users.name,
      },
    })
      .from(conversations)
      .innerJoin(contacts, eq(contacts.id, conversations.contactId))
      .leftJoin(users, eq(users.id, conversations.assignedTo))
      .where(and(
        eq(conversations.agencyId, agencyId),
        status !== 'all' ? eq(conversations.status, status) : sql`1=1`
      ))
      .orderBy(desc(conversations.updatedAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({ conversations: convos, total: convos.length });
  } catch (err) {
    console.error('Error listando conversaciones:', err);
    res.status(500).json({ error: 'Error al cargar conversaciones' });
  }
});

// GET /api/conversations/:id — Detalle con mensajes
conversationsRouter.get('/:id', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    // Verificar que la conversación pertenece a la agencia
    const [convo] = await db.select().from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.agencyId, agencyId)))
      .limit(1);

    if (!convo) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    // Cargar mensajes
    const msgs = await db.select().from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);

    // Cargar tareas relacionadas
    const relatedTasks = await db.select().from(tasks)
      .where(eq(tasks.conversationId, id))
      .orderBy(desc(tasks.createdAt));

    // Cargar contacto
    const [contact] = await db.select().from(contacts)
      .where(eq(contacts.id, convo.contactId)).limit(1);

    res.json({ conversation: convo, messages: msgs, tasks: relatedTasks, contact });
  } catch (err) {
    console.error('Error cargando conversación:', err);
    res.status(500).json({ error: 'Error al cargar la conversación' });
  }
});

// POST /api/conversations/:id/reply — Responder desde el dashboard
conversationsRouter.post('/:id/reply', async (req, res) => {
  try {
    const { agencyId, userId } = req.user;
    const { id } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // Verificar la conversación
    const [convo] = await db.select().from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.agencyId, agencyId)))
      .limit(1);

    if (!convo) return res.status(404).json({ error: 'Conversación no encontrada' });

    // Obtener número de WhatsApp del contacto
    const [contact] = await db.select().from(contacts)
      .where(eq(contacts.id, convo.contactId)).limit(1);

    // Obtener API key de WhatsApp de la agencia
    const [agency] = await db.select().from(agencies)
      .where(eq(agencies.id, agencyId)).limit(1);

    // Enviar por WhatsApp
    await sendTextMessage(contact.whatsappNumber, message, agency.whatsappApiKey);

    // Guardar el mensaje
    const [savedMessage] = await db.insert(messages).values({
      conversationId: id,
      agencyId,
      direction: 'outbound',
      content: message,
      messageType: 'text',
      senderType: 'agent',
      senderId: userId,
      status: 'sent',
    }).returning();

    // Actualizar timestamp de la conversación
    await db.update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, id));

    res.json({ message: savedMessage });
  } catch (err) {
    console.error('Error enviando respuesta:', err);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

// PUT /api/conversations/:id/assign — Asignar a agente
conversationsRouter.put('/:id/assign', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;
    const { agentId } = req.body;

    await db.update(conversations)
      .set({ assignedTo: agentId, updatedAt: new Date() })
      .where(and(eq(conversations.id, id), eq(conversations.agencyId, agencyId)));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al asignar conversación' });
  }
});

// PUT /api/conversations/:id/resolve — Cerrar conversación
conversationsRouter.put('/:id/resolve', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    await db.update(conversations)
      .set({ status: 'resolved', updatedAt: new Date() })
      .where(and(eq(conversations.id, id), eq(conversations.agencyId, agencyId)));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al cerrar conversación' });
  }
});
