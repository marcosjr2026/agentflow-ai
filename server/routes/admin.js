import { Router } from 'express';
import { db } from '../db/index.js';
import { agencies, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const adminRouter = Router();

// GET /api/admin/agencies — lista todas las agencias (solo super_admin global)
adminRouter.get('/agencies', async (req, res) => {
  try {
    // Verificar que sea super_admin
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }

    const allAgencies = await db.select().from(agencies).orderBy(agencies.createdAt);

    // Para cada agencia, obtener el email del admin
    const enriched = await Promise.all(allAgencies.map(async (ag) => {
      const [admin] = await db.select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.agencyId, ag.id))
        .limit(1);
      return {
        ...ag,
        adminEmail: admin?.email || null,
        adminName: admin?.name || null,
      };
    }));

    const stats = {
      total: enriched.length,
      active: enriched.filter(a => a.status === 'active').length,
      onboarded: enriched.filter(a => a.onboardingCompleted).length,
    };

    res.json({ agencies: enriched, stats });
  } catch (err) {
    console.error('Admin agencies error:', err);
    res.status(500).json({ error: 'Error al obtener agencias' });
  }
});

// PATCH /api/admin/agencies/:id — cambiar plan o status
adminRouter.patch('/agencies/:id', async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    const { plan, status } = req.body;
    const updates = {};
    if (plan) updates.plan = plan;
    if (status) updates.status = status;

    await db.update(agencies).set(updates).where(eq(agencies.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar agencia' });
  }
});
