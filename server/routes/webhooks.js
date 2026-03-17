import { Router } from 'express';
import { db } from '../db/index.js';
import { agencies, contacts, conversations, messages, tasks } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { sendTextMessage, AUTO_RESPONSES, normalizePhone } from '../services/whatsapp.js';
import { detectIntent } from '../services/ai.js';

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

    // Identificar al remitente
    let [contact] = await db.select().from(contacts)
      .where(and(
        eq(contacts.agencyId, agencyId),
        eq(contacts.whatsappNumber, fromNumber)
      )).limit(1);

    const isNewContact = !contact;

    // Si es desconocido → crear como lead
    if (!contact) {
      const [newContact] = await db.insert(contacts).values({
        agencyId,
        whatsappNumber: fromNumber,
        type: 'lead',
        status: 'active',
      }).returning();
      contact = newContact;
    }

    // Buscar o crear conversación activa
    let [conversation] = await db.select().from(conversations)
      .where(and(
        eq(conversations.agencyId, agencyId),
        eq(conversations.contactId, contact.id),
        eq(conversations.status, 'open')
      )).limit(1);

    if (!conversation) {
      const [newConvo] = await db.insert(conversations).values({
        agencyId,
        contactId: contact.id,
        status: 'open',
        context: contact.type === 'lead' ? 'sales' : 'service',
      }).returning();
      conversation = newConvo;
    }

    // Guardar mensaje entrante
    await db.insert(messages).values({
      conversationId: conversation.id,
      agencyId,
      direction: 'inbound',
      content: messageText,
      messageType,
      senderType: 'contact',
      senderId: contact.id,
      waMessageId,
      status: 'delivered',
    });

    // ─── DETECCIÓN DE INTENCIÓN Y RESPUESTA AUTOMÁTICA ───────────────────────
    let autoReply = null;
    let taskToCreate = null;

    // Detección rápida por palabras clave (sin AI para velocidad)
    const msgLower = messageText.toLowerCase();
    const isUrgent = msgLower.includes('urgente') || msgLower.includes('emergencia') || msgLower.includes('urgent');

    if (isUrgent) {
      autoReply = AUTO_RESPONSES.initial(contact.name);
      taskToCreate = {
        title: `⚠️ URGENTE: Mensaje de ${contact.name || fromNumber}`,
        type: 'follow_up',
        priority: 'high',
        description: `Mensaje urgente: "${messageText.substring(0, 200)}"`,
      };
    } else if (isNewContact) {
      // Nuevo lead → respuesta de bienvenida
      autoReply = AUTO_RESPONSES.initial(contact.name);
      taskToCreate = {
        title: `Nuevo lead: ${fromNumber}`,
        type: 'follow_up',
        priority: 'medium',
        description: `Primer mensaje: "${messageText.substring(0, 200)}"`,
      };
    } else {
      // Detectar intención con AI (async, no bloquea la respuesta)
      detectIntent(messageText, contact.type).then(async (intent) => {
        let reply = null;
        let task = null;

        switch (intent.intent) {
          case 'appointment':
            reply = AUTO_RESPONSES.appointmentReceived();
            task = {
              title: `Cita solicitada: ${contact.name || fromNumber}`,
              type: 'appointment',
              priority: 'medium',
              description: `${intent.summary}\nMensaje: "${messageText.substring(0, 200)}"`,
            };
            break;

          case 'complaint':
            reply = `Hola${contact.name ? ` ${contact.name}` : ''} 👋, lamentamos mucho esta situación. Un asesor te contactará a la brevedad para resolver tu caso. 🙏`;
            task = {
              title: `Queja: ${contact.name || fromNumber}`,
              type: 'follow_up',
              priority: 'high',
              description: `${intent.summary}\nMensaje: "${messageText.substring(0, 200)}"`,
            };
            break;

          case 'cancel':
            reply = `Hola${contact.name ? ` ${contact.name}` : ''}, hemos recibido tu mensaje. Un especialista te contactará para ayudarte con este proceso.`;
            task = {
              title: `⚠️ Retención: ${contact.name || fromNumber}`,
              type: 'follow_up',
              priority: 'high',
              description: `Cliente desea cancelar. ${intent.summary}`,
            };
            break;

          case 'benefits':
            reply = `Hola${contact.name ? ` ${contact.name}` : ''} 👋, con gusto te ayudamos con información sobre tus beneficios. Un asesor te enviará la información de tu plan en breve.`;
            task = {
              title: `Consulta beneficios: ${contact.name || fromNumber}`,
              type: 'follow_up',
              priority: 'low',
              description: intent.summary,
            };
            break;

          default:
            // Respuesta genérica
            task = {
              title: `Mensaje de ${contact.name || fromNumber}`,
              type: 'follow_up',
              priority: intent.urgency === 'high' ? 'high' : 'medium',
              description: `${intent.summary}\nMensaje: "${messageText.substring(0, 200)}"`,
            };
        }

        if (reply) {
          await sendTextMessage(fromNumber, reply, agency.whatsappApiKey);
          await db.insert(messages).values({
            conversationId: conversation.id,
            agencyId,
            direction: 'outbound',
            content: reply,
            messageType: 'text',
            senderType: 'ai',
            status: 'sent',
          });
        }

        if (task) {
          await db.insert(tasks).values({
            agencyId,
            ...task,
            contactId: contact.id,
            conversationId: conversation.id,
            assignedTo: contact.agentId, // asignar al agente del contacto si existe
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas
          });
        }
      }).catch(err => console.error('Error detectando intención:', err));

      // Respuesta inmediata mientras se procesa la intención
      autoReply = AUTO_RESPONSES.initial(contact.name);
    }

    // Enviar respuesta automática inmediata
    if (autoReply) {
      await sendTextMessage(fromNumber, autoReply, agency.whatsappApiKey);
      await db.insert(messages).values({
        conversationId: conversation.id,
        agencyId,
        direction: 'outbound',
        content: autoReply,
        messageType: 'text',
        senderType: 'ai',
        status: 'sent',
      });
    }

    // Crear tarea si hay una pendiente de la detección rápida
    if (taskToCreate) {
      await db.insert(tasks).values({
        agencyId,
        ...taskToCreate,
        contactId: contact.id,
        conversationId: conversation.id,
        assignedTo: contact.agentId,
        dueDate: new Date(Date.now() + 60 * 60 * 1000),
      });
    }

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
