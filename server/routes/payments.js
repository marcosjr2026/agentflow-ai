import { Router } from 'express';
import { db } from '../db/index.js';
import { payments, contacts, users } from '../db/schema.js';
import { eq, and, desc, sql, gte, lte } from 'drizzle-orm';

export const paymentsRouter = Router();

// GET /api/payments
paymentsRouter.get('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { status, limit = 100, offset = 0 } = req.query;

    const conditions = [eq(payments.agencyId, agencyId)];
    if (status && status !== 'all') conditions.push(eq(payments.status, status));

    const rows = await db.select({
      id: payments.id,
      amount: payments.amount,
      dueDate: payments.dueDate,
      paidDate: payments.paidDate,
      status: payments.status,
      commissionAmount: payments.commissionAmount,
      commissionPaid: payments.commissionPaid,
      notes: payments.notes,
      createdAt: payments.createdAt,
      contact: { id: contacts.id, name: contacts.name, whatsappNumber: contacts.whatsappNumber, planType: contacts.planType },
      agent: { id: users.id, name: users.name },
    })
      .from(payments)
      .leftJoin(contacts, eq(contacts.id, payments.contactId))
      .leftJoin(users, eq(users.id, payments.agentId))
      .where(and(...conditions))
      .orderBy(desc(payments.dueDate))
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json({ payments: rows, total: rows.length });
  } catch (err) {
    console.error('Error listando pagos:', err);
    res.status(500).json({ error: 'Error al cargar pagos' });
  }
});

// POST /api/payments
paymentsRouter.post('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { contactId, agentId, amount, dueDate, notes } = req.body;

    if (!contactId || !amount || !dueDate) {
      return res.status(400).json({ error: 'contactId, amount y dueDate son requeridos' });
    }

    const [payment] = await db.insert(payments).values({
      agencyId, contactId, agentId, amount, dueDate, notes, status: 'pending',
    }).returning();

    res.status(201).json({ payment });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear pago' });
  }
});

// PUT /api/payments/:id/mark-paid
paymentsRouter.put('/:id/mark-paid', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { id } = req.params;

    const [payment] = await db.select().from(payments)
      .where(and(eq(payments.id, id), eq(payments.agencyId, agencyId))).limit(1);

    if (!payment) return res.status(404).json({ error: 'Pago no encontrado' });

    // Calcular comisión según tier
    const commissionAmount = calculateCommission(payment.amount);

    const [updated] = await db.update(payments)
      .set({ status: 'paid', paidDate: new Date().toISOString().split('T')[0], commissionAmount })
      .where(eq(payments.id, id))
      .returning();

    res.json({ payment: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error al marcar pago' });
  }
});

// GET /api/payments/summary
paymentsRouter.get('/summary', async (req, res) => {
  try {
    const { agencyId } = req.user;

    const [stats] = await db.select({
      totalPending: sql`SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END)`,
      totalPaid: sql`SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)`,
      totalFailed: sql`SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END)`,
      commissionsPending: sql`SUM(CASE WHEN commission_paid = false AND status = 'paid' THEN commission_amount ELSE 0 END)`,
      countPending: sql`COUNT(CASE WHEN status = 'pending' THEN 1 END)`,
      countOverdue: sql`COUNT(CASE WHEN status = 'overdue' THEN 1 END)`,
    }).from(payments).where(eq(payments.agencyId, agencyId));

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar resumen' });
  }
});

function calculateCommission(amount) {
  // Comisión simple: 10% del monto del pago
  return parseFloat((amount * 0.10).toFixed(2));
}
