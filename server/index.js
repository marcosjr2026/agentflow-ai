import { seedAdmin } from './seed.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { onboardingRouter } from './routes/onboarding.js';
import { adminRouter } from './routes/admin.js';
import { conversationsRouter } from './routes/conversations.js';
import { contactsRouter } from './routes/contacts.js';
import { callsRouter } from './routes/calls.js';
import { paymentsRouter } from './routes/payments.js';
import { analyticsRouter } from './routes/analytics.js';
import { webhooksRouter } from './routes/webhooks.js';
import { authMiddleware } from './middleware/auth.js';
import { initCronJobs } from './services/cron.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── RUTAS PÚBLICAS ───────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/webhooks', webhooksRouter); // Webhook de WhatsApp no requiere JWT

// ─── RUTAS PROTEGIDAS ─────────────────────────────────────────────────────────
app.use('/api/onboarding', authMiddleware, onboardingRouter);
app.use('/api/admin', authMiddleware, adminRouter);
app.use('/api/conversations', authMiddleware, conversationsRouter);
app.use('/api/contacts', authMiddleware, contactsRouter);
app.use('/api/calls', authMiddleware, callsRouter);
app.use('/api/payments', authMiddleware, paymentsRouter);
app.use('/api/analytics', authMiddleware, analyticsRouter);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── FRONTEND ESTÁTICO (PROD/REPLIT) ────────────────────────────────────────
const clientDistPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// ─── MANEJO DE ERRORES ────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// ─── INICIO ───────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`🚀 AgentFlow AI server corriendo en puerto ${PORT}`);
  await seedAdmin();
  initCronJobs();
});

export default app;
