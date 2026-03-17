import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/index.js';
import { agencies, users } from '../db/schema.js';
import { generateToken } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

export const authRouter = Router();

// ─── REGISTRO DE NUEVA AGENCIA ────────────────────────────────────────────────
// POST /api/auth/register-agency
authRouter.post('/register-agency', async (req, res) => {
  try {
    const { agencyName, adminName, email, password, phone } = req.body;

    if (!agencyName || !adminName || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar que el email no exista
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Este email ya está registrado' });
    }

    // Crear agencia
    const [agency] = await db.insert(agencies).values({
      name: agencyName,
      plan: 'starter',
      status: 'active',
    }).returning();

    // Crear usuario admin
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(users).values({
      agencyId: agency.id,
      name: adminName,
      email,
      phone,
      passwordHash,
      role: 'super_admin',
    }).returning();

    const token = generateToken({
      userId: user.id,
      agencyId: agency.id,
      role: user.role,
      email: user.email,
    });

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      agency: { id: agency.id, name: agency.name, plan: agency.plan },
    });
  } catch (err) {
    console.error('Error registro:', err);
    res.status(500).json({ error: 'Error al crear la agencia' });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Verificar que la agencia esté activa
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, user.agencyId)).limit(1);
    if (!agency || agency.status !== 'active') {
      return res.status(403).json({ error: 'Tu cuenta está suspendida' });
    }

    const token = generateToken({
      userId: user.id,
      agencyId: user.agencyId,
      role: user.role,
      email: user.email,
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      agency: { id: agency.id, name: agency.name, plan: agency.plan },
    });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ─── PERFIL ───────────────────────────────────────────────────────────────────
// GET /api/auth/me
authRouter.get('/me', async (req, res) => {
  // Este endpoint usa el middleware de auth pero lo ponemos aquí para conveniencia
  res.json({ message: 'Usar con authMiddleware — ver server/index.js' });
});
