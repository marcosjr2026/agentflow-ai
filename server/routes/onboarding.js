import { Router } from 'express';
import { db } from '../db/index.js';
import { agencies } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const onboardingRouter = Router();

// POST /api/onboarding — guarda configuración de la agencia post-registro
onboardingRouter.post('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const {
      agencyDisplayName,
      contactPhone,
      website,
      primaryLang,
      insuranceTypes,
      hoursStart,
      hoursEnd,
      afterHoursMsg,
      paymentReminderDays,
      welcomeMsg,
      agentPersonality,
      faqs,
      teamMembers,
      commissionRules,
      commissionNotes,
    } = req.body;

    const config = {
      primaryLang: primaryLang || 'both',
      insuranceTypes: insuranceTypes || [],
      hours: { start: hoursStart || '08:00', end: hoursEnd || '17:00' },
      afterHoursMsg: afterHoursMsg || '',
      paymentReminderDays: paymentReminderDays || 3,
      welcomeMsg: welcomeMsg || '',
      agentPersonality: agentPersonality || 'professional',
      faqs: faqs || [],
      commissionRules: commissionRules || [],
      commissionNotes: commissionNotes || '',
    };

    await db.update(agencies)
      .set({
        name: agencyDisplayName || undefined,
        whatsappNumber: contactPhone || undefined,
        metadata: config,
        onboardingCompleted: true,
      })
      .where(eq(agencies.id, agencyId));

    // Si hay miembros del equipo, crearlos
    if (teamMembers && teamMembers.length > 0) {
      const { users } = await import('../db/schema.js');
      const bcrypt = await import('bcryptjs');
      for (const member of teamMembers) {
        if (!member.email) continue;
        try {
          const passwordHash = await bcrypt.default.hash('OpenAG2026!', 10);
          await db.insert(users).values({
            agencyId,
            name: member.name || member.email,
            email: member.email,
            phone: member.phone || null,
            passwordHash,
            role: member.role || 'agent',
          }).onConflictDoNothing();
        } catch (e) { /* skip duplicates */ }
      }
    }

    res.json({ success: true, message: 'Configuración guardada' });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});

// GET /api/onboarding — obtener configuración actual
onboardingRouter.get('/', async (req, res) => {
  try {
    const { agencyId } = req.user;
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, agencyId)).limit(1);
    res.json({ agency });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});
