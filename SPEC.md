# AgentFlow AI — Technical Specification
**Versión:** 1.0  
**Fecha:** 2026-03-17  
**Stack Target:** Replit (Node.js + React + PostgreSQL)

---

## 1. VISIÓN GENERAL

AgentFlow AI es una plataforma SaaS multi-tenant para agencias de seguros independientes que automatiza servicio al cliente, administración, coaching de ventas y educación del cliente mediante inteligencia artificial integrada con WhatsApp Business.

### Usuarios del Sistema
| Rol | Descripción |
|-----|-------------|
| `super_admin` | Dueño/admin de la agencia |
| `manager` | Supervisor de equipo de ventas |
| `agent` | Agente de ventas |
| `service_rep` | Representante de servicio al cliente |
| `client` | Cliente final (interactúa via WhatsApp) |
| `lead` | Lead nuevo (interactúa via WhatsApp) |

---

## 2. ARQUITECTURA

### Stack
- **Backend:** Node.js + Express
- **Frontend:** React + TailwindCSS
- **Base de datos:** PostgreSQL (Drizzle ORM)
- **Auth:** JWT + bcrypt
- **AI:** OpenAI GPT-4o (análisis, coaching, respuestas)
- **Transcripción:** OpenAI Whisper API
- **WhatsApp:** 360Dialog API (webhook + mensajes)
- **File Storage:** Cloudinary (PDFs, audios, imágenes)
- **Job Queue:** node-cron (recordatorios, reportes)
- **Email:** Nodemailer (notificaciones internas)

### Multi-Tenancy
Cada agencia tiene su propio `agency_id`. Todos los datos están aislados por `agency_id`. Un mismo deployment sirve múltiples agencias.

---

## 3. ESQUEMA DE BASE DE DATOS

### agencies
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) NOT NULL
whatsapp_number VARCHAR(20)
whatsapp_api_key VARCHAR(255)
crm_type        VARCHAR(50) -- 'zoho' | 'hubspot' | 'none'
crm_api_key     VARCHAR(255)
timezone        VARCHAR(50) DEFAULT 'America/New_York'
plan            VARCHAR(20) -- 'starter' | 'growth' | 'pro'
status          VARCHAR(20) DEFAULT 'active'
created_at      TIMESTAMP DEFAULT NOW()
```

### users
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
name            VARCHAR(255)
email           VARCHAR(255) UNIQUE
phone           VARCHAR(20)
password_hash   VARCHAR(255)
role            VARCHAR(20) -- super_admin | manager | agent | service_rep
status          VARCHAR(20) DEFAULT 'active'
created_at      TIMESTAMP DEFAULT NOW()
```

### contacts
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
whatsapp_number VARCHAR(20) NOT NULL
name            VARCHAR(255)
type            VARCHAR(20) -- 'lead' | 'client' | 'agent'
plan_type       VARCHAR(100) -- tipo de seguro
insurance_company VARCHAR(100)
agent_id        UUID REFERENCES users(id) -- agente asignado
status          VARCHAR(20) DEFAULT 'active'
payment_day     INTEGER -- día del mes que se cobra
payment_amount  DECIMAL(10,2)
effective_date  DATE
metadata        JSONB -- datos adicionales
created_at      TIMESTAMP DEFAULT NOW()
```

### conversations
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
contact_id      UUID REFERENCES contacts(id)
status          VARCHAR(20) -- 'open' | 'pending' | 'resolved'
assigned_to     UUID REFERENCES users(id)
context         VARCHAR(50) -- 'service' | 'sales' | 'admin' | 'education'
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### messages
```sql
id              UUID PRIMARY KEY
conversation_id UUID REFERENCES conversations(id)
agency_id       UUID REFERENCES agencies(id)
direction       VARCHAR(10) -- 'inbound' | 'outbound'
content         TEXT
message_type    VARCHAR(20) -- 'text' | 'audio' | 'image' | 'document'
media_url       VARCHAR(500)
sender_type     VARCHAR(20) -- 'contact' | 'agent' | 'ai' | 'system'
sender_id       UUID -- user_id o contact_id
wa_message_id   VARCHAR(100) -- ID de WhatsApp
status          VARCHAR(20) -- 'sent' | 'delivered' | 'read' | 'failed'
created_at      TIMESTAMP DEFAULT NOW()
```

### tasks
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
title           VARCHAR(255)
description     TEXT
type            VARCHAR(50) -- 'follow_up' | 'document_request' | 'payment_follow_up' | 'appointment'
status          VARCHAR(20) -- 'pending' | 'in_progress' | 'done'
priority        VARCHAR(10) -- 'low' | 'medium' | 'high'
assigned_to     UUID REFERENCES users(id)
contact_id      UUID REFERENCES contacts(id)
conversation_id UUID REFERENCES conversations(id)
due_date        TIMESTAMP
completed_at    TIMESTAMP
created_at      TIMESTAMP DEFAULT NOW()
```

### calls
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
agent_id        UUID REFERENCES users(id)
contact_id      UUID REFERENCES contacts(id)
audio_url       VARCHAR(500)
transcript      TEXT
duration_seconds INTEGER
evaluation      JSONB -- resultado del análisis AI
score           INTEGER -- 0-100
called_at       TIMESTAMP
created_at      TIMESTAMP DEFAULT NOW()
```

### call_evaluations
```sql
id              UUID PRIMARY KEY
call_id         UUID REFERENCES calls(id)
agency_id       UUID REFERENCES agencies(id)
agent_id        UUID REFERENCES users(id)
asked_age       BOOLEAN
asked_zipcode   BOOLEAN
asked_need      BOOLEAN
handled_price_objection BOOLEAN
handled_competitor_objection BOOLEAN
attempted_close BOOLEAN
close_successful BOOLEAN
missed_opportunities JSONB -- array de oportunidades perdidas
positives       TEXT -- lo que hizo bien
improvements    TEXT -- lo que faltó
recommendations TEXT -- recomendaciones puntuales
score           INTEGER -- 0-100
created_at      TIMESTAMP DEFAULT NOW()
```

### payments
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
contact_id      UUID REFERENCES contacts(id)
agent_id        UUID REFERENCES users(id) -- agente que hizo la venta
amount          DECIMAL(10,2)
due_date        DATE
paid_date       DATE
status          VARCHAR(20) -- 'pending' | 'paid' | 'failed' | 'overdue'
commission_amount DECIMAL(10,2)
commission_paid BOOLEAN DEFAULT FALSE
notes           TEXT
created_at      TIMESTAMP DEFAULT NOW()
```

### automation_sequences
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
name            VARCHAR(255)
trigger_type    VARCHAR(50) -- 'new_client' | 'plan_type' | 'date' | 'event'
trigger_value   VARCHAR(255) -- valor del trigger
status          VARCHAR(20) DEFAULT 'active'
created_at      TIMESTAMP DEFAULT NOW()
```

### sequence_steps
```sql
id              UUID PRIMARY KEY
sequence_id     UUID REFERENCES automation_sequences(id)
step_order      INTEGER
delay_days      INTEGER DEFAULT 0
message_type    VARCHAR(20) -- 'text' | 'pdf' | 'video' | 'link'
content         TEXT
media_url       VARCHAR(500)
```

### automation_logs
```sql
id              UUID PRIMARY KEY
agency_id       UUID REFERENCES agencies(id)
contact_id      UUID REFERENCES contacts(id)
type            VARCHAR(50) -- tipo de automatización ejecutada
status          VARCHAR(20) -- 'sent' | 'failed' | 'skipped'
message_content TEXT
executed_at     TIMESTAMP DEFAULT NOW()
```

---

## 4. MÓDULO 1: SERVICIO AL CLIENTE AI

### 4.1 Webhook de WhatsApp
```
POST /api/webhooks/whatsapp/:agency_id
```

**Flujo al recibir mensaje:**
1. Identificar el número de WhatsApp del remitente
2. Buscar en `contacts` si es lead / cliente activo / agente
3. Si es **desconocido** → crear lead + abrir conversación `type: service`
4. Si es **cliente activo** → abrir/reabrir conversación + detectar intención
5. Si es **agente** → flujo interno (comandos)
6. Detectar palabras clave y ejecutar flujo correspondiente

**Detección de intención (GPT-4o):**
```
Palabras clave → Acción automática
─────────────────────────────────────────
cita / appointment → Respuesta + crear tarea tipo 'appointment'
queja / complaint  → Respuesta + crear tarea prioridad HIGH + notificar manager
documentos / docs  → Iniciar flujo de solicitud de documentos
beneficios / benefits → Enviar guía de beneficios del plan
cancelar / cancel  → Respuesta + crear tarea + notificar manager
pago / payment     → Informar estado del pago
urgente / urgent   → Respuesta + crear tarea HIGH + notificar
```

**Respuesta automática inicial:**
```
"Hola 👋 [nombre si existe], gracias por escribirnos. 
En breve uno de nuestros asesores te atiende.
Si tu consulta es urgente, escribe URGENTE."
```

**Si continúa escribiendo (>30s sin respuesta del agente):**
```
"Estamos validando tu consulta, dame unos minutos por favor. 🙏"
```

### 4.2 Creación Automática de Tarea
Al recibir mensaje que requiere atención humana:
- Crear registro en `tasks`
- Asignar al agente de turno (round-robin o por `contact.agent_id`)
- Enviar notificación push/email al agente con:
  - Nombre del contacto
  - Mensaje recibido (resumen si es largo)
  - Historial de los últimos 3 mensajes
  - Link directo a la conversación

### 4.3 API Endpoints
```
GET  /api/conversations              - Lista conversaciones activas
GET  /api/conversations/:id          - Detalle + mensajes
POST /api/conversations/:id/reply    - Responder desde el dashboard
PUT  /api/conversations/:id/assign   - Asignar a agente
PUT  /api/conversations/:id/resolve  - Cerrar conversación
POST /api/contacts                   - Crear contacto manualmente
GET  /api/contacts/:id               - Ver ficha completa del contacto
```

---

## 5. MÓDULO 2: ADMINISTRACIÓN AUTOMÁTICA

### 5.1 Recordatorios de Pago

**Cron jobs:**
```
Diariamente a las 9am:
1. Buscar pagos con due_date = HOY + 3 días → enviar recordatorio
2. Buscar pagos con due_date = HOY → enviar alerta
3. Buscar pagos con status = 'failed' → enviar seguimiento
4. Buscar pagos overdue → crear tarea + notificar
```

**Mensajes:**
```
3 días antes:
"Hola [nombre] 👋, te recordamos que el [fecha] se procesará tu pago 
mensual de $[monto]. Asegúrate de tener fondos disponibles."

Día del cobro:
"[nombre], hoy es el día de tu pago mensual de $[monto]. 
Te avisaremos cuando se confirme. ✅"

Pago fallido:
"[nombre], hubo un problema procesando tu pago de $[monto]. 
Por favor contáctanos para resolverlo lo antes posible."

Pago confirmado:
"[nombre] ✅, tu pago de $[monto] fue procesado exitosamente. 
Gracias por tu puntualidad."
```

### 5.2 Solicitud de Documentos

**Endpoint:** `POST /api/contacts/:id/request-documents`

**Body:**
```json
{
  "documents": ["residencia", "identificacion", "prueba_de_ingreso"],
  "deadline_days": 5,
  "message": "Para completar tu proceso necesitamos los siguientes documentos"
}
```

**Flujo:**
1. Enviar mensaje al cliente con lista de documentos necesarios
2. Crear tarea de seguimiento
3. Cron job: si no responde en `deadline_days` → enviar recordatorio
4. Cuando el cliente envía documentos (imagen/PDF) → notificar agente + adjuntar a contacto

### 5.3 Sistema de Comisiones

**Reglas configurables por agencia:**
```json
{
  "tiers": [
    { "min_sales": 0,  "max_sales": 5,  "commission_per_sale": 0 },
    { "min_sales": 6,  "max_sales": 9,  "commission_per_sale": 100 },
    { "min_sales": 10, "max_sales": 14, "commission_per_sale": 150 },
    { "min_sales": 15, "max_sales": null, "commission_per_sale": 200 }
  ],
  "commission_period": "monthly",
  "effective_date_field": "next_month_1st"
}
```

**Endpoints:**
```
GET  /api/commissions/summary?month=2026-03   - Resumen mensual
GET  /api/commissions/agent/:id               - Comisiones por agente
POST /api/commissions/mark-paid/:id           - Marcar comisión como pagada
GET  /api/commissions/report                  - Reporte completo (CSV)
```

---

## 6. MÓDULO 3: COACH DE VENTAS AI

### 6.1 Upload de Llamadas

**Endpoint:** `POST /api/calls/upload`

```
Content-Type: multipart/form-data
Fields:
  - audio: File (mp3, wav, m4a, ogg)
  - agent_id: UUID
  - contact_id: UUID (opcional)
  - called_at: ISO timestamp
```

**Flujo:**
1. Subir audio a Cloudinary
2. Enviar a Whisper API para transcripción
3. Enviar transcripción a GPT-4o para evaluación
4. Guardar resultado en `calls` y `call_evaluations`
5. Enviar reporte al agente por WhatsApp

### 6.2 Prompt de Evaluación (GPT-4o)
```
Eres un coach experto en ventas de seguros de salud para el mercado hispano de Miami.
Analiza la siguiente transcripción de una llamada de ventas y evalúa al agente.

TRANSCRIPCIÓN:
{transcript}

GUIÓN DE REFERENCIA:
- El agente debe preguntar por la edad del prospecto
- El agente debe preguntar por el zip code
- El agente debe identificar la necesidad principal (médico de cabecera, especialistas, medicamentos)
- El agente debe presentar al menos 2 opciones de planes
- El agente debe manejar objeciones de precio, comparación con otro seguro, o indecisión
- El agente debe intentar cerrar la venta o programar seguimiento

Responde con el siguiente JSON:
{
  "score": 0-100,
  "asked_age": true/false,
  "asked_zipcode": true/false, 
  "asked_need": true/false,
  "presented_plans": true/false,
  "handled_price_objection": true/false,
  "handled_competitor_objection": true/false,
  "attempted_close": true/false,
  "close_successful": true/false,
  "missed_opportunities": ["lista de oportunidades perdidas"],
  "positives": "párrafo con lo que hizo bien",
  "improvements": "párrafo con lo que necesita mejorar",
  "recommendations": "3 recomendaciones específicas y accionables",
  "summary": "resumen de 2 líneas de la llamada"
}
```

### 6.3 Reporte Diario por Agente

**Cron:** Diariamente a las 6pm

**Canal:** WhatsApp al agente

```
📊 Tu resumen de hoy, [nombre]:

Llamadas analizadas: X
Puntuación promedio: XX/100

✅ Lo que hiciste bien:
- [positive 1]
- [positive 2]

⚠️ Áreas de mejora:
- [improvement 1]
- [improvement 2]

💡 Recomendaciones para mañana:
1. [recommendation 1]
2. [recommendation 2]

Sigue así, ¡estás progresando! 💪
```

### 6.4 Dashboard del Manager

```
GET /api/analytics/team-performance?period=week&agent_id=all
```

**Retorna:**
```json
{
  "period": "2026-03-10/2026-03-17",
  "agents": [
    {
      "id": "uuid",
      "name": "Carolina",
      "calls_analyzed": 12,
      "avg_score": 78,
      "close_rate": 0.42,
      "top_strengths": ["pregunta necesidad", "maneja objeciones precio"],
      "top_improvements": ["no intenta cierre en 40% de llamadas"]
    }
  ],
  "team_avg_score": 72,
  "most_common_objection": "precio",
  "best_performer": "Carolina"
}
```

---

## 7. MÓDULO 4: EDUCACIÓN DEL CLIENTE

### 7.1 Secuencias Automáticas

**Triggers disponibles:**
- `new_client` — cuando se agrega un cliente con plan X
- `days_after_signup` — N días después del alta
- `renewal_reminder` — días antes de la renovación
- `benefit_reminder` — recordatorio periódico de beneficios

**Configuración desde el dashboard:**

```json
{
  "name": "Onboarding Plan Medicare Advantage",
  "trigger_type": "new_client",
  "trigger_value": "Medicare Advantage",
  "steps": [
    {
      "delay_days": 0,
      "message_type": "text",
      "content": "Bienvenido a tu plan Medicare Advantage. 🎉 En los próximos días te enviaremos información útil sobre tus beneficios."
    },
    {
      "delay_days": 3,
      "message_type": "text", 
      "content": "¿Sabías que tu plan incluye telemedicina ilimitada? Puedes hablar con un médico desde tu casa. Escríbenos TELEMEDICINA y te explicamos cómo usarla."
    },
    {
      "delay_days": 7,
      "message_type": "pdf",
      "content": "Aquí está tu guía completa de beneficios:",
      "media_url": "https://cloudinary.../guia-medicare-advantage.pdf"
    },
    {
      "delay_days": 30,
      "message_type": "text",
      "content": "Han pasado 30 días desde tu alta. ¿Has podido usar tus beneficios? Escríbenos si necesitas ayuda con algo. 😊"
    }
  ]
}
```

**Cron:** Cada hora, revisar `sequence_steps` pendientes de envío.

### 7.2 Endpoints
```
GET  /api/sequences                      - Lista secuencias
POST /api/sequences                      - Crear secuencia
PUT  /api/sequences/:id                  - Editar secuencia
DELETE /api/sequences/:id                - Eliminar secuencia
POST /api/sequences/:id/test             - Enviar test a número de prueba
GET  /api/sequences/logs                 - Log de envíos
```

---

## 8. DASHBOARD FRONTEND

### 8.1 Páginas

```
/login                   - Login
/dashboard               - Home con KPIs
/conversations           - Bandeja de conversaciones
/conversations/:id       - Vista de conversación
/contacts                - Lista de contactos/clientes
/contacts/:id            - Ficha del contacto
/calls                   - Llamadas analizadas
/calls/upload            - Subir llamada para análisis
/calls/:id               - Resultado del análisis
/commissions             - Comisiones del mes
/sequences               - Automatizaciones de educación
/sequences/new           - Crear secuencia
/payments                - Pagos y seguimientos
/analytics               - Reportes y performance
/settings                - Configuración de la agencia
/settings/team           - Gestión de agentes
/settings/whatsapp       - Configuración WhatsApp
/settings/crm            - Integración CRM
```

### 8.2 KPIs del Dashboard
- Conversaciones abiertas hoy
- Tareas pendientes
- Pagos vencidos / en riesgo
- Score promedio del equipo esta semana
- Clientes activos totales
- Alertas críticas

### 8.3 Vista de Conversación
- Historial de mensajes (estilo WhatsApp Web)
- Ficha del contacto a la derecha
- Panel de tareas relacionadas
- Botón para responder directamente
- Notas internas (no se envían al cliente)
- Tags: lead / cliente / urgente / pendiente documentos

---

## 9. INTEGRACIONES

### 9.1 WhatsApp (360Dialog)
```
POST /api/webhooks/whatsapp/:agency_id   - Webhook entrante
POST (outbound) → 360Dialog Send Message API
```

**Configuración por agencia:**
```
WABA_API_KEY per agency (stored encrypted in DB)
Webhook URL: https://agentflow.ai/api/webhooks/whatsapp/{agency_id}
```

### 9.2 Zoho CRM (opcional por agencia)
- Sincronizar contactos new/updated
- Crear tareas en Zoho cuando se crea tarea en AgentFlow
- Pull de pagos si el CRM los registra

### 9.3 Twilio (alternativa para agencias sin 360Dialog)
- Mismo flujo, diferente proveedor WhatsApp

---

## 10. SEGURIDAD Y MULTI-TENANCY

- Todas las queries filtradas por `agency_id`
- JWT con `agency_id` y `role` en el payload
- Middleware de autorización por rol en cada endpoint
- Rate limiting: 100 req/min por agencia
- Webhook validation (signature verification 360Dialog)
- Contraseñas hasheadas con bcrypt (rounds: 12)
- API keys de WhatsApp/CRM encriptadas en DB (AES-256)

---

## 11. PRICING & SUBSCRIPTION

### Plan Limits
| Feature | Starter | Growth | Pro |
|---------|---------|--------|-----|
| Agentes | 3 | 10 | Ilimitado |
| Mensajes WhatsApp/mes | 1,000 | 5,000 | Ilimitado |
| Análisis de llamadas/mes | 0 | 50 | Ilimitado |
| Secuencias de educación | 3 | 10 | Ilimitado |
| Sucursales | 1 | 1 | Ilimitado |

### Endpoints de Subscription
```
GET  /api/subscription/current      - Plan actual y uso
POST /api/subscription/upgrade      - Cambiar plan
GET  /api/subscription/invoices     - Facturas
```

---

## 12. ESTRUCTURA DE ARCHIVOS

```
/
├── server/
│   ├── index.js                 - Entry point
│   ├── db/
│   │   ├── schema.js            - Drizzle schema
│   │   └── migrations/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── conversations.js
│   │   ├── contacts.js
│   │   ├── calls.js
│   │   ├── payments.js
│   │   ├── sequences.js
│   │   ├── commissions.js
│   │   ├── analytics.js
│   │   └── webhooks.js
│   ├── services/
│   │   ├── whatsapp.js          - 360Dialog API
│   │   ├── ai.js                - OpenAI calls
│   │   ├── whisper.js           - Transcripción
│   │   ├── cron.js              - Jobs programados
│   │   ├── notifications.js     - Notificaciones internas
│   │   └── crm.js               - Zoho/HubSpot sync
│   ├── middleware/
│   │   ├── auth.js              - JWT validation
│   │   ├── tenancy.js           - Agency isolation
│   │   └── rateLimit.js
│   └── utils/
│       ├── encryption.js
│       └── helpers.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── index.html
├── .env.example
├── package.json
└── README.md
```

---

## 13. VARIABLES DE ENTORNO

```env
# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=...
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# 360Dialog (global fallback, each agency has their own)
DEFAULT_WABA_API_KEY=...

# App
APP_URL=https://agentflow.ai
NODE_ENV=production
PORT=3000
```

---

## 14. MVP — PRIORIDAD DE DESARROLLO

### Fase 1 (semanas 1-2): Core
- [ ] Auth + multi-tenancy
- [ ] Schema DB + migraciones
- [ ] Webhook WhatsApp + respuesta automática
- [ ] Dashboard básico de conversaciones
- [ ] Gestión de contactos

### Fase 2 (semana 3): Módulos Admin y Educación
- [ ] Sistema de pagos y recordatorios automáticos
- [ ] Solicitud de documentos
- [ ] Secuencias de educación del cliente
- [ ] Cron jobs

### Fase 3 (semana 4): Coach AI
- [ ] Upload de llamadas
- [ ] Transcripción Whisper
- [ ] Evaluación GPT-4o
- [ ] Reportes diarios al agente
- [ ] Dashboard de performance

### Fase 4: Comisiones + Analytics
- [ ] Sistema de comisiones
- [ ] Dashboard analytics
- [ ] Integración Zoho CRM
- [ ] Exportar reportes CSV

---

## 15. NOTAS PARA EL DESARROLLADOR

1. **WhatsApp primero** — toda la experiencia del cliente es por WhatsApp. El dashboard es para el equipo interno.
2. **Multi-tenant desde el día 1** — nunca hardcodear IDs de agencia.
3. **AI como capa de servicio** — `services/ai.js` centraliza todos los calls a OpenAI para facilitar cambio de modelo.
4. **Crons deben ser idempotentes** — si se ejecutan dos veces el mismo día, no deben duplicar mensajes. Usar `automation_logs` para verificar.
5. **Números WhatsApp** — siempre normalizar a formato E.164 (+1XXXXXXXXXX).
6. **El módulo de evaluación de llamadas** — el audio puede llegar por WhatsApp directamente (mensaje de voz del agente) o subido desde el dashboard.
7. **Primeros clientes beta** — el sistema debe funcionar sin Zoho CRM (modo standalone) ya que no todas las agencias lo usan.
