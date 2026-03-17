import { Router } from 'express';
import { db } from '../db/index.js';
import { contacts, users, conversations, payments } from '../db/schema.js';
import { eq, and, ilike, or, desc, sql } from 'drizzle-orm';

export const contactsRouter = Router();

// GET /api/contacts
contactsRouter.get('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { type, status = 'active', search, limit = 50, offset = 0 } = req.query;

    const conditions = [eq(contacts.agencyId, agencyId)];
    if (status !== 'all') conditions.push(eq(contacts.status, status));
    if (type) conditions.push(eq(contacts.type, type));
    if (search) conditions.push(or(
      ilike(contacts.name, `%${search}%`),
      ilike(contacts.whatsappNumber, `%${search}%`)
    ));

    const rows = await db.select({
      id: contacts.id,
      name: contacts.name,
      whatsappNumber: contacts.whatsappNumber,
      type: contacts.type,
      planType: contacts.planType,
      insuranceCompany: contacts.insuranceCompany,
      status: contacts.status,
      paymentAmount: contacts.paymentAmount,
      paymentDay: contacts.paymentDay,
      effectiveDate: contacts.effectiveDate,
      preferredLang: contacts.preferredLang,
      createdAt: contacts.createdAt,
      agent: { id: users.id, name: users.name },
    })
      .from(contacts)
      .leftJoin(users, eq(users.id, contacts.agentId))
      .where(and(...conditions))
      .orderBy(desc(contacts.createdAt))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({ contacts: rows, total: rows.length });
  } catch (err) {
    console.error('Error listando contactos:', err);
    res.status(500).json({ error: 'Error al cargar contactos' });
  }
});

// POST /api/contacts
contactsRouter.post('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { name, whatsappNumber, type = 'lead', planType, insuranceCompany, agentId, paymentDay, paymentAmount, effectiveDate, preferredLang = 'es' } = req.body;

    if (!whatsappNumber) return res.status(400).json({ error: 'Número de WhatsApp requerido' });

    const [contact] = await db.insert(contacts).values({
      agencyId, name, whatsappNumber, type, planType, insuranceCompany,
      agentId, paymentDay, paymentAmount, effectiveDate, preferredLang,
    }).returning();

    res.status(201).json({ contact });
  } catch (err) {
    console.error('Error creando contacto:', err);
    res.status(500).json({ error: 'Error al crear contacto' });
  }
});

// GET /api/contacts/:id
contactsRouter.get('/:id', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    const [contact] = await db.select().from(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.agencyId, agencyId))).limit(1);

    if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });

    const recentPayments = await db.select().from(payments)
      .where(eq(payments.contactId, id)).orderBy(desc(payments.createdAt)).limit(5);

    const recentConvos = await db.select().from(conversations)
      .where(eq(conversations.contactId, id)).orderBy(desc(conversations.updatedAt)).limit(5);

    res.json({ contact, payments: recentPayments, conversations: recentConvos });
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar contacto' });
  }
});

// PUT /api/contacts/:id
contactsRouter.put('/:id', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;
    const { name, whatsappNumber, type, planType, insuranceCompany, agentId, paymentDay, paymentAmount, effectiveDate, preferredLang } = req.body;

    const [updated] = await db.update(contacts)
      .set({ name, whatsappNumber, type, planType, insuranceCompany, agentId, paymentDay, paymentAmount, effectiveDate, preferredLang })
      .where(and(eq(contacts.id, id), eq(contacts.agencyId, agencyId)))
      .returning();

    res.json({ contact: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar contacto' });
  }
});

// DELETE /api/contacts/:id (soft delete)
contactsRouter.delete('/:id', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    await db.update(contacts)
      .set({ status: 'inactive' })
      .where(and(eq(contacts.id, id), eq(contacts.agencyId, agencyId)));

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
});
