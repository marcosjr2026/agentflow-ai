import cron from 'node-cron';
import { db } from '../db/index.js';
import { contacts, payments, agencies, users, calls, callEvaluations } from '../db/schema.js';
import { eq, and, lte, gte, sql } from 'drizzle-orm';
import { sendTextMessage, AUTO_RESPONSES } from './whatsapp.js';
import { formatDailyReport } from './ai.js';

export function initCronJobs() {
  console.log('⏰ Inicializando cron jobs...');

  // ─── RECORDATORIOS DE PAGO (diario 9am) ────────────────────────────────────
  cron.schedule('0 9 * * *', async () => {
    console.log('🔔 Cron: Recordatorios de pago');
    try {
      const today = new Date();
      const threeDaysLater = new Date(today);
      threeDaysLater.setDate(today.getDate() + 3);

      // Pagos que vencen en 3 días
      const upcomingPayments = await db.select({
        payment: payments,
        contact: contacts,
        agency: agencies,
      })
        .from(payments)
        .innerJoin(contacts, eq(contacts.id, payments.contactId))
        .innerJoin(agencies, eq(agencies.id, payments.agencyId))
        .where(and(
          eq(payments.status, 'pending'),
          eq(sql`DATE(${payments.dueDate})`, sql`DATE(${threeDaysLater.toISOString()})`)
        ));

      for (const { payment, contact, agency } of upcomingPayments) {
        const msg = AUTO_RESPONSES.paymentReminder(
          contact.name || 'Cliente',
          payment.amount,
          new Date(payment.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
        );
        await sendTextMessage(contact.whatsappNumber, msg, agency.whatsappApiKey);
        console.log(`📨 Recordatorio enviado a ${contact.whatsappNumber}`);
      }

      // Pagos que vencen HOY
      const todayPayments = await db.select({
        payment: payments,
        contact: contacts,
        agency: agencies,
      })
        .from(payments)
        .innerJoin(contacts, eq(contacts.id, payments.contactId))
        .innerJoin(agencies, eq(agencies.id, payments.agencyId))
        .where(and(
          eq(payments.status, 'pending'),
          eq(sql`DATE(${payments.dueDate})`, sql`CURRENT_DATE`)
        ));

      for (const { payment, contact, agency } of todayPayments) {
        const msg = AUTO_RESPONSES.paymentToday(
          contact.name || 'Cliente',
          payment.amount
        );
        await sendTextMessage(contact.whatsappNumber, msg, agency.whatsappApiKey);
      }

    } catch (err) {
      console.error('Error cron recordatorios:', err);
    }
  }, { timezone: 'America/New_York' });

  // ─── SEGUIMIENTO PAGOS FALLIDOS (cada 6 horas) ─────────────────────────────
  cron.schedule('0 */6 * * *', async () => {
    console.log('🔔 Cron: Seguimiento pagos fallidos');
    try {
      const failedPayments = await db.select({
        payment: payments,
        contact: contacts,
        agency: agencies,
      })
        .from(payments)
        .innerJoin(contacts, eq(contacts.id, payments.contactId))
        .innerJoin(agencies, eq(agencies.id, payments.agencyId))
        .where(eq(payments.status, 'failed'));

      for (const { payment, contact, agency } of failedPayments) {
        const msg = AUTO_RESPONSES.paymentFailed(
          contact.name || 'Cliente',
          payment.amount
        );
        await sendTextMessage(contact.whatsappNumber, msg, agency.whatsappApiKey);
      }
    } catch (err) {
      console.error('Error cron pagos fallidos:', err);
    }
  }, { timezone: 'America/New_York' });

  // ─── REPORTE DIARIO DE AGENTES (6pm) ────────────────────────────────────────
  cron.schedule('0 18 * * 1-5', async () => {
    console.log('📊 Cron: Reportes diarios de agentes');
    try {
      // Obtener todos los agentes activos
      const agents = await db.select().from(users)
        .where(and(
          eq(users.role, 'agent'),
          eq(users.status, 'active')
        ));

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      for (const agent of agents) {
        if (!agent.phone) continue;

        // Obtener evaluaciones de hoy
        const todayEvals = await db.select().from(callEvaluations)
          .where(and(
            eq(callEvaluations.agentId, agent.id),
            gte(callEvaluations.createdAt, startOfDay)
          ));

        // Obtener la agencia para el API key de WhatsApp
        const [agency] = await db.select().from(agencies)
          .where(eq(agencies.id, agent.agencyId)).limit(1);

        if (!agency) continue;

        const reportMessage = formatDailyReport(agent.name, todayEvals);
        await sendTextMessage(agent.phone, reportMessage, agency.whatsappApiKey);
        console.log(`📨 Reporte enviado a ${agent.name}`);
      }
    } catch (err) {
      console.error('Error cron reportes:', err);
    }
  }, { timezone: 'America/New_York' });

  console.log('✅ Cron jobs iniciados');
}
