/**
 * seed-demo.js — Populates the DB with realistic demo data for the dashboard
 * Run: node server/seed-demo.js
 */
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import { db } from './db/index.js';
import { agencies, users, contacts, conversations, messages, payments, calls, callEvaluations } from './db/schema.js';
import { eq } from 'drizzle-orm';

async function seedDemo() {
  console.log('🌱 Seeding demo data...');

  // ─── Find or create agency ───────────────────────────────────────────────
  let [agency] = await db.select().from(agencies).limit(1);
  if (!agency) {
    [agency] = await db.insert(agencies).values({
      name: 'Miami Insurance Pro',
      plan: 'growth',
      status: 'active',
      onboardingCompleted: true,
    }).returning();
    console.log('✓ Agency created');
  }

  // ─── Find or create admin user ───────────────────────────────────────────
  let [admin] = await db.select().from(users).where(eq(users.agencyId, agency.id)).limit(1);
  if (!admin) {
    const hash = await bcrypt.hash('AgentFlow2026!', 10);
    [admin] = await db.insert(users).values({
      agencyId: agency.id,
      name: 'Marcos Socorro',
      email: 'msocorro@socorromc.com',
      passwordHash: hash,
      role: 'super_admin',
    }).returning();
    console.log('✓ Admin created');
  }

  // ─── Agents ──────────────────────────────────────────────────────────────
  const agentData = [
    { name: 'Sofia Ramírez', email: 'sofia@demo.com', phone: '+13055550101' },
    { name: 'Carlos Mendez', email: 'carlos@demo.com', phone: '+13055550102' },
    { name: 'Ana Torres',    email: 'ana@demo.com',    phone: '+13055550103' },
  ];

  const agentIds = [];
  for (const a of agentData) {
    const existing = await db.select().from(users).where(eq(users.email, a.email)).limit(1);
    if (existing.length === 0) {
      const hash = await bcrypt.hash('OpenAG2026!', 10);
      const [u] = await db.insert(users).values({
        agencyId: agency.id, name: a.name, email: a.email,
        phone: a.phone, passwordHash: hash, role: 'agent',
      }).returning();
      agentIds.push(u.id);
    } else {
      agentIds.push(existing[0].id);
    }
  }
  console.log('✓ Agents ready');

  // ─── Contacts ────────────────────────────────────────────────────────────
  const clientData = [
    { name: 'María López',    phone: '+13055550201', type: 'client', plan: 'Medicare Advantage', amount: '189.00', day: 15 },
    { name: 'Carlos Ruiz',    phone: '+13055550202', type: 'client', plan: 'Medicare Supplement', amount: '245.00', day: 18 },
    { name: 'Ana García',     phone: '+13055550203', type: 'client', plan: 'Dental + Visión', amount: '89.00', day: 20 },
    { name: 'Pedro Martínez', phone: '+13055550204', type: 'client', plan: 'Medicare Advantage', amount: '312.00', day: 5 },
    { name: 'Rosa Fernández', phone: '+13055550205', type: 'client', plan: 'ACA', amount: '178.00', day: 1 },
    { name: 'Juan Pérez',     phone: '+13055550206', type: 'lead',   plan: null, amount: null, day: null },
    { name: 'Lucía Morales',  phone: '+13055550207', type: 'lead',   plan: null, amount: null, day: null },
    { name: 'Roberto Silva',  phone: '+13055550208', type: 'client', plan: 'Medicaid', amount: '0.00', day: 1 },
  ];

  const contactIds = [];
  for (const c of clientData) {
    const existing = await db.select().from(contacts)
      .where(eq(contacts.whatsappNumber, c.phone)).limit(1);
    if (existing.length === 0) {
      const [ct] = await db.insert(contacts).values({
        agencyId: agency.id,
        whatsappNumber: c.phone,
        name: c.name,
        type: c.type,
        planType: c.plan,
        agentId: agentIds[Math.floor(Math.random() * agentIds.length)],
        status: 'active',
        paymentDay: c.day,
        paymentAmount: c.amount,
      }).returning();
      contactIds.push(ct.id);
    } else {
      contactIds.push(existing[0].id);
    }
  }
  console.log('✓ Contacts ready');

  // ─── Conversations ────────────────────────────────────────────────────────
  const contexts = ['service', 'sales', 'admin', 'education'];
  const convStatuses = ['open', 'open', 'open', 'pending', 'resolved'];
  const convIds = [];

  for (let i = 0; i < 6; i++) {
    const [conv] = await db.insert(conversations).values({
      agencyId: agency.id,
      contactId: contactIds[i],
      status: convStatuses[i % convStatuses.length],
      context: contexts[i % contexts.length],
      assignedTo: agentIds[i % agentIds.length],
    }).returning();
    convIds.push(conv.id);
  }

  // Messages for first 3 convos
  const msgPairs = [
    ['Hola, necesito saber cuándo me cobran este mes', 'Hola María 👋 Tu pago de $189 se procesa el día 15. ¿Necesitas algo más?'],
    ['Tuve un problema con mi tarjeta', 'Entendido Carlos. Déjame verificar tu método de pago. ¿Puedes confirmar los últimos 4 dígitos?'],
    ['¿Cuáles son mis beneficios dentales?', 'Hola Ana 😊 Tu plan incluye 2 limpiezas anuales, radiografías y descuentos en ortodoncia. ¿Quieres que te envíe el PDF completo?'],
  ];

  for (let i = 0; i < 3; i++) {
    await db.insert(messages).values([
      { conversationId: convIds[i], agencyId: agency.id, direction: 'inbound', content: msgPairs[i][0], senderType: 'contact' },
      { conversationId: convIds[i], agencyId: agency.id, direction: 'outbound', content: msgPairs[i][1], senderType: 'ai' },
    ]);
  }
  console.log('✓ Conversations + messages ready');

  // ─── Payments ─────────────────────────────────────────────────────────────
  const today = new Date();
  const paymentData = [
    { contactIdx: 0, amount: '189.00', status: 'paid',    daysAgo: -5 },
    { contactIdx: 1, amount: '245.00', status: 'failed',  daysAgo: 2  },
    { contactIdx: 2, amount: '89.00',  status: 'pending', daysAgo: -3 },
    { contactIdx: 3, amount: '312.00', status: 'paid',    daysAgo: -10 },
    { contactIdx: 4, amount: '178.00', status: 'overdue', daysAgo: 5  },
    { contactIdx: 7, amount: '0.00',   status: 'paid',    daysAgo: -1 },
  ];

  for (const p of paymentData) {
    const due = new Date(today);
    due.setDate(due.getDate() - p.daysAgo);
    await db.insert(payments).values({
      agencyId: agency.id,
      contactId: contactIds[p.contactIdx],
      agentId: agentIds[0],
      amount: p.amount,
      dueDate: due.toISOString().split('T')[0],
      paidDate: p.status === 'paid' ? due.toISOString().split('T')[0] : null,
      status: p.status,
      commissionAmount: (parseFloat(p.amount) * 0.1).toFixed(2),
    });
  }
  console.log('✓ Payments ready');

  // ─── Calls + Evaluations ──────────────────────────────────────────────────
  const callScores = [
    { agentIdx: 0, score: 87, close: true },
    { agentIdx: 1, score: 72, close: false },
    { agentIdx: 2, score: 91, close: true },
    { agentIdx: 0, score: 65, close: false },
    { agentIdx: 1, score: 78, close: true },
  ];

  for (const c of callScores) {
    const [call] = await db.insert(calls).values({
      agencyId: agency.id,
      agentId: agentIds[c.agentIdx],
      contactId: contactIds[Math.floor(Math.random() * 5)],
      durationSeconds: 180 + Math.floor(Math.random() * 300),
      score: c.score,
      calledAt: new Date(Date.now() - Math.random() * 7 * 86400000),
    }).returning();

    await db.insert(callEvaluations).values({
      callId: call.id,
      agencyId: agency.id,
      agentId: agentIds[c.agentIdx],
      askedAge: true,
      askedZipcode: c.score > 75,
      askedNeed: true,
      handledPriceObjection: c.score > 70,
      handledCompetitorObjection: c.score > 80,
      attemptedClose: true,
      closeSuccessful: c.close,
      score: c.score,
      positives: 'Buena escucha activa, presentación clara del plan.',
      improvements: c.score < 80 ? 'Faltó preguntar por necesidad específica antes de presentar precio.' : null,
      recommendations: 'Confirmar beneficios clave antes del cierre.',
    });
  }
  console.log('✓ Calls + evaluations ready');

  console.log('\n✅ Demo seed complete!');
  console.log('   Agency:', agency.name);
  console.log('   Login:  msocorro@socorromc.com / AgentFlow2026!');
  process.exit(0);
}

seedDemo().catch(e => { console.error(e); process.exit(1); });
