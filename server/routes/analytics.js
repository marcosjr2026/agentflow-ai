import { Router } from 'express';
import { db } from '../db/index.js';
import { contacts, payments, calls, callEvaluations, users } from '../db/schema.js';
import { eq, and, desc, sql, gte, avg } from 'drizzle-orm';

export const analyticsRouter = Router();

// GET /api/analytics/summary — KPIs para el dashboard
analyticsRouter.get('/summary', async (req, res) => {
  try {
    const { agencyId } = req.user;

    const [clientStats] = await db.select({
      totalClients: sql`COUNT(CASE WHEN type = 'client' AND status = 'active' THEN 1 END)`,
      totalLeads: sql`COUNT(CASE WHEN type = 'lead' AND status = 'active' THEN 1 END)`,
    }).from(contacts).where(eq(contacts.agencyId, agencyId));

    const [paymentStats] = await db.select({
      paymentsAtRisk: sql`COUNT(CASE WHEN status IN ('pending','overdue') THEN 1 END)`,
      totalPaidThisMonth: sql`SUM(CASE WHEN status = 'paid' AND DATE_TRUNC('month', paid_date::date) = DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END)`,
    }).from(payments).where(eq(payments.agencyId, agencyId));

    const [callStats] = await db.select({
      avgCallScore: sql`ROUND(AVG(score))`,
      totalCallsThisWeek: sql`COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END)`,
    }).from(calls).where(eq(calls.agencyId, agencyId));

    res.json({
      totalClients: parseInt(clientStats?.totalClients || 0),
      totalLeads: parseInt(clientStats?.totalLeads || 0),
      paymentsAtRisk: parseInt(paymentStats?.paymentsAtRisk || 0),
      totalPaidThisMonth: parseFloat(paymentStats?.totalPaidThisMonth || 0),
      avgCallScore: parseInt(callStats?.avgCallScore || 0),
      totalCallsThisWeek: parseInt(callStats?.totalCallsThisWeek || 0),
    });
  } catch (err) {
    console.error('Error summary analytics:', err);
    res.status(500).json({ error: 'Error al cargar KPIs' });
  }
});

// GET /api/analytics/team-performance
analyticsRouter.get('/team-performance', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const { period = 'week' } = req.query;
    const days = period === 'month' ? 30 : 7;

    const agents = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
    }).from(users).where(and(
      eq(users.agencyId, agencyId),
      eq(users.role, 'agent'),
      eq(users.status, 'active')
    ));

    const performance = await Promise.all(agents.map(async (agent) => {
      const [stats] = await db.select({
        callsAnalyzed: sql`COUNT(*)`,
        avgScore: sql`ROUND(AVG(score))`,
        closeRate: sql`ROUND(AVG(CASE WHEN close_successful = true THEN 100.0 ELSE 0 END))`,
      }).from(callEvaluations).where(and(
        eq(callEvaluations.agentId, agent.id),
        eq(callEvaluations.agencyId, agencyId),
        sql`created_at >= CURRENT_DATE - INTERVAL '${sql.raw(String(days))} days'`
      ));

      return {
        ...agent,
        callsAnalyzed: parseInt(stats?.callsAnalyzed || 0),
        avgScore: parseInt(stats?.avgScore || 0),
        closeRate: parseInt(stats?.closeRate || 0),
      };
    }));

    // Ordenar por score
    performance.sort((a, b) => b.avgScore - a.avgScore);

    res.json({
      period,
      agents: performance,
      bestPerformer: performance[0] || null,
      teamAvgScore: performance.length
        ? Math.round(performance.reduce((s, a) => s + a.avgScore, 0) / performance.length)
        : 0,
    });
  } catch (err) {
    console.error('Error team performance:', err);
    res.status(500).json({ error: 'Error al cargar performance del equipo' });
  }
});
