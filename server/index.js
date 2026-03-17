import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { conversationsRouter } from './routes/conversations.js';
import { contactsRouter } from './routes/contacts.js';
import { callsRouter } from './routes/calls.js';
import { paymentsRouter } from './routes/payments.js';
import { sequencesRouter } from './routes/sequences.js';
import { commissionsRouter } from './routes/commissions.js';
import { analyticsRouter } from './routes/analytics.js';
import { webhooksRouter } from './routes/webhooks.js';
import { authMiddleware } from './middleware/auth.js';
import { initCronJobs } from './services/cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── RUTAS PÚBLICAS ───────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/webhooks', webhooksRouter); // Webhook de WhatsApp no requiere JWT

// ─── RUTAS PROTEGIDAS ─────────────────────────────────────────────────────────
app.use('/api/conversations', authMiddleware, conversationsRouter);
app.use('/api/contacts', authMiddleware, contactsRouter);
app.use('/api/calls', authMiddleware, callsRouter);
app.use('/api/payments', authMiddleware, paymentsRouter);
app.use('/api/sequences', authMiddleware, sequencesRouter);
app.use('/api/commissions', authMiddleware, commissionsRouter);
app.use('/api/analytics', authMiddleware, analyticsRouter);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── MANEJO DE ERRORES ────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// ─── INICIO ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AgentFlow AI server corriendo en puerto ${PORT}`);
  initCronJobs();
});

export default app;
