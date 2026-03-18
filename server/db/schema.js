import { pgTable, uuid, varchar, text, boolean, integer, decimal, timestamp, date, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ─── AGENCIAS ────────────────────────────────────────────────────────────────
export const agencies = pgTable('agencies', {
  id:             uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name:           varchar('name', { length: 255 }).notNull(),
  whatsappNumber: varchar('whatsapp_number', { length: 20 }),
  whatsappApiKey: varchar('whatsapp_api_key', { length: 255 }),
  crmType:        varchar('crm_type', { length: 50 }).default('none'), // 'zoho' | 'hubspot' | 'none'
  crmApiKey:      varchar('crm_api_key', { length: 255 }),
  timezone:       varchar('timezone', { length: 50 }).default('America/New_York'),
  plan:                varchar('plan', { length: 20 }).default('starter'), // 'starter' | 'growth' | 'pro'
  status:              varchar('status', { length: 20 }).default('active'),
  metadata:            jsonb('metadata'),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  createdAt:           timestamp('created_at').defaultNow(),
});

// ─── USUARIOS ────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:           uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:     uuid('agency_id').references(() => agencies.id).notNull(),
  name:         varchar('name', { length: 255 }).notNull(),
  email:        varchar('email', { length: 255 }).unique().notNull(),
  phone:        varchar('phone', { length: 20 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role:         varchar('role', { length: 20 }).notNull(), // super_admin | manager | agent | service_rep
  status:       varchar('status', { length: 20 }).default('active'),
  createdAt:    timestamp('created_at').defaultNow(),
});

// ─── CONTACTOS (leads + clientes) ────────────────────────────────────────────
export const contacts = pgTable('contacts', {
  id:                uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:          uuid('agency_id').references(() => agencies.id).notNull(),
  whatsappNumber:    varchar('whatsapp_number', { length: 20 }).notNull(),
  name:              varchar('name', { length: 255 }),
  type:              varchar('type', { length: 20 }).default('lead'), // 'lead' | 'client' | 'agent'
  planType:          varchar('plan_type', { length: 100 }),
  insuranceCompany:  varchar('insurance_company', { length: 100 }),
  agentId:           uuid('agent_id').references(() => users.id),
  status:            varchar('status', { length: 20 }).default('active'),
  paymentDay:        integer('payment_day'), // día del mes que se cobra
  paymentAmount:     decimal('payment_amount', { precision: 10, scale: 2 }),
  effectiveDate:     date('effective_date'),
  metadata:          jsonb('metadata'), // datos adicionales del plan
  createdAt:         timestamp('created_at').defaultNow(),
});

// ─── CONVERSACIONES ───────────────────────────────────────────────────────────
export const conversations = pgTable('conversations', {
  id:         uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:   uuid('agency_id').references(() => agencies.id).notNull(),
  contactId:  uuid('contact_id').references(() => contacts.id).notNull(),
  status:     varchar('status', { length: 20 }).default('open'), // 'open' | 'pending' | 'resolved'
  assignedTo: uuid('assigned_to').references(() => users.id),
  context:    varchar('context', { length: 50 }).default('service'), // 'service' | 'sales' | 'admin' | 'education'
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow(),
});

// ─── MENSAJES ─────────────────────────────────────────────────────────────────
export const messages = pgTable('messages', {
  id:             uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  agencyId:       uuid('agency_id').references(() => agencies.id).notNull(),
  direction:      varchar('direction', { length: 10 }).notNull(), // 'inbound' | 'outbound'
  content:        text('content'),
  messageType:    varchar('message_type', { length: 20 }).default('text'), // 'text' | 'audio' | 'image' | 'document'
  mediaUrl:       varchar('media_url', { length: 500 }),
  senderType:     varchar('sender_type', { length: 20 }), // 'contact' | 'agent' | 'ai' | 'system'
  senderId:       uuid('sender_id'),
  waMessageId:    varchar('wa_message_id', { length: 100 }), // ID de WhatsApp
  status:         varchar('status', { length: 20 }).default('sent'), // 'sent' | 'delivered' | 'read' | 'failed'
  createdAt:      timestamp('created_at').defaultNow(),
});

// ─── TAREAS ───────────────────────────────────────────────────────────────────
export const tasks = pgTable('tasks', {
  id:             uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:       uuid('agency_id').references(() => agencies.id).notNull(),
  title:          varchar('title', { length: 255 }).notNull(),
  description:    text('description'),
  type:           varchar('type', { length: 50 }).notNull(), // 'follow_up' | 'document_request' | 'payment_follow_up' | 'appointment'
  status:         varchar('status', { length: 20 }).default('pending'), // 'pending' | 'in_progress' | 'done'
  priority:       varchar('priority', { length: 10 }).default('medium'), // 'low' | 'medium' | 'high'
  assignedTo:     uuid('assigned_to').references(() => users.id),
  contactId:      uuid('contact_id').references(() => contacts.id),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  dueDate:        timestamp('due_date'),
  completedAt:    timestamp('completed_at'),
  createdAt:      timestamp('created_at').defaultNow(),
});

// ─── LLAMADAS ─────────────────────────────────────────────────────────────────
export const calls = pgTable('calls', {
  id:              uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:        uuid('agency_id').references(() => agencies.id).notNull(),
  agentId:         uuid('agent_id').references(() => users.id).notNull(),
  contactId:       uuid('contact_id').references(() => contacts.id),
  audioUrl:        varchar('audio_url', { length: 500 }),
  transcript:      text('transcript'),
  durationSeconds: integer('duration_seconds'),
  evaluation:      jsonb('evaluation'), // resultado del análisis AI
  score:           integer('score'), // 0-100
  calledAt:        timestamp('called_at'),
  createdAt:       timestamp('created_at').defaultNow(),
});

// ─── EVALUACIONES DE LLAMADAS ─────────────────────────────────────────────────
export const callEvaluations = pgTable('call_evaluations', {
  id:                          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  callId:                      uuid('call_id').references(() => calls.id).notNull(),
  agencyId:                    uuid('agency_id').references(() => agencies.id).notNull(),
  agentId:                     uuid('agent_id').references(() => users.id).notNull(),
  askedAge:                    boolean('asked_age').default(false),
  askedZipcode:                boolean('asked_zipcode').default(false),
  askedNeed:                   boolean('asked_need').default(false),
  handledPriceObjection:       boolean('handled_price_objection').default(false),
  handledCompetitorObjection:  boolean('handled_competitor_objection').default(false),
  attemptedClose:              boolean('attempted_close').default(false),
  closeSuccessful:             boolean('close_successful').default(false),
  missedOpportunities:         jsonb('missed_opportunities'),
  positives:                   text('positives'),
  improvements:                text('improvements'),
  recommendations:             text('recommendations'),
  score:                       integer('score'),
  createdAt:                   timestamp('created_at').defaultNow(),
});

// ─── PAGOS ────────────────────────────────────────────────────────────────────
export const payments = pgTable('payments', {
  id:               uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:         uuid('agency_id').references(() => agencies.id).notNull(),
  contactId:        uuid('contact_id').references(() => contacts.id).notNull(),
  agentId:          uuid('agent_id').references(() => users.id), // agente que hizo la venta
  amount:           decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate:          date('due_date').notNull(),
  paidDate:         date('paid_date'),
  status:           varchar('status', { length: 20 }).default('pending'), // 'pending' | 'paid' | 'failed' | 'overdue'
  commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }),
  commissionPaid:   boolean('commission_paid').default(false),
  notes:            text('notes'),
  createdAt:        timestamp('created_at').defaultNow(),
});

// ─── SECUENCIAS DE AUTOMATIZACIÓN ────────────────────────────────────────────
export const automationSequences = pgTable('automation_sequences', {
  id:           uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:     uuid('agency_id').references(() => agencies.id).notNull(),
  name:         varchar('name', { length: 255 }).notNull(),
  triggerType:  varchar('trigger_type', { length: 50 }), // 'new_client' | 'plan_type' | 'date' | 'event'
  triggerValue: varchar('trigger_value', { length: 255 }),
  status:       varchar('status', { length: 20 }).default('active'),
  createdAt:    timestamp('created_at').defaultNow(),
});

// ─── PASOS DE SECUENCIA ───────────────────────────────────────────────────────
export const sequenceSteps = pgTable('sequence_steps', {
  id:          uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  sequenceId:  uuid('sequence_id').references(() => automationSequences.id).notNull(),
  stepOrder:   integer('step_order').notNull(),
  delayDays:   integer('delay_days').default(0),
  messageType: varchar('message_type', { length: 20 }).default('text'), // 'text' | 'pdf' | 'video' | 'link'
  content:     text('content'),
  mediaUrl:    varchar('media_url', { length: 500 }),
});

// ─── LOGS DE AUTOMATIZACIÓN ───────────────────────────────────────────────────
export const automationLogs = pgTable('automation_logs', {
  id:             uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  agencyId:       uuid('agency_id').references(() => agencies.id).notNull(),
  contactId:      uuid('contact_id').references(() => contacts.id),
  type:           varchar('type', { length: 50 }),
  status:         varchar('status', { length: 20 }),
  messageContent: text('message_content'),
  executedAt:     timestamp('executed_at').defaultNow(),
});
