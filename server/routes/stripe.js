import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../db/index.js';
import { agencies } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const stripeRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Plan price IDs (set real ones in .env after creating in Stripe dashboard)
const PLANS = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_placeholder',
  growth:  process.env.STRIPE_PRICE_GROWTH  || 'price_growth_placeholder',
  pro:     process.env.STRIPE_PRICE_PRO     || 'price_pro_placeholder',
};

// POST /api/stripe/checkout — crear sesión de pago
stripeRouter.post('/checkout', async (req, res) => {
  try {
    const { plan, agencyId, email, agencyName } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Plan inválido' });
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return res.status(503).json({ error: 'Stripe no configurado aún', setup: true });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: PLANS[plan], quantity: 1 }],
      metadata: { agencyId, agencyName, plan },
      success_url: `${process.env.APP_URL}/app/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${process.env.APP_URL}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

// POST /api/stripe/webhook — eventos de Stripe (pagos, cancelaciones)
stripeRouter.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { agencyId, plan } = session.metadata || {};
      if (agencyId) {
        await db.update(agencies)
          .set({ plan, status: 'active', stripeCustomerId: session.customer })
          .where(eq(agencies.id, agencyId))
          .catch(() => {});
        console.log(`✅ Agency ${agencyId} upgraded to ${plan}`);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      if (sub.metadata?.agencyId) {
        await db.update(agencies)
          .set({ status: 'suspended' })
          .where(eq(agencies.id, sub.metadata.agencyId))
          .catch(() => {});
      }
      break;
    }
  }

  res.json({ received: true });
});

// GET /api/stripe/plans — precios públicos para mostrar en checkout
stripeRouter.get('/plans', (req, res) => {
  res.json({
    plans: [
      { id: 'starter', name: 'Starter', price: 497, setup: 1500, currency: 'usd' },
      { id: 'growth',  name: 'Growth',  price: 797, setup: 2000, currency: 'usd' },
      { id: 'pro',     name: 'Pro',     price: 1297, setup: 3000, currency: 'usd' },
    ]
  });
});
