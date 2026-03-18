import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import { db } from './db/index.js';
import { agencies, users } from './db/schema.js';
import { eq } from 'drizzle-orm';

export async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'msocorro@socorromc.com';
    const password = process.env.ADMIN_PASSWORD || 'AgentFlow2026!';
    const agencyName = process.env.ADMIN_AGENCY || 'AgentFlow Demo Agency';

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      console.log('✓ Admin user already exists');
      return;
    }

    let [agency] = await db.select().from(agencies).limit(1);
    if (!agency) {
      [agency] = await db.insert(agencies).values({
        name: agencyName,
        plan: 'starter',
        status: 'active',
      }).returning();
      console.log('✓ Agency created:', agency.name);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(users).values({
      agencyId: agency.id,
      name: 'Marcos Socorro',
      email,
      passwordHash,
      role: 'super_admin',
    });

    console.log('✓ Admin user created:', email);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}
