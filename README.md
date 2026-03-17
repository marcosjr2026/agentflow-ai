# AgentFlow AI 🤖

**Sistema de Inteligencia Artificial para Agencias de Seguros Independientes**

---

## Stack

- **Backend:** Node.js + Express
- **Frontend:** React + Vite + TailwindCSS
- **Base de datos:** PostgreSQL + Drizzle ORM
- **AI:** OpenAI GPT-4o + Whisper
- **WhatsApp:** 360Dialog API
- **Cron:** node-cron

---

## Setup en Replit

### 1. Clonar y configurar

```bash
# En el shell de Replit
cp .env.example .env
# Editar .env con tus credenciales
```

### 2. Variables de entorno requeridas

```
DATABASE_URL=postgresql://...
JWT_SECRET=cambiar_por_secreto_seguro
OPENAI_API_KEY=sk-...
DEFAULT_WABA_API_KEY=tu_360dialog_api_key
```

### 3. Instalar dependencias

```bash
npm install
cd client && npm install && cd ..
```

### 4. Crear las tablas

```bash
npm run db:generate
npm run db:migrate
```

### 5. Correr en desarrollo

```bash
npm run dev
```

---

## Módulos

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| 1. Servicio al Cliente AI | ✅ | Webhook WhatsApp + respuesta automática + tareas |
| 2. Admin Automático | ✅ | Recordatorios pago, documentos, comisiones |
| 3. Coach de Ventas AI | ✅ | Transcripción + evaluación + reporte diario |
| 4. Educación del Cliente | ✅ | Secuencias automáticas por tipo de plan |

---

## Configurar WhatsApp (360Dialog)

1. Crear cuenta en [360dialog.com](https://360dialog.com)
2. Registrar número WhatsApp Business
3. Agregar tu API key en `.env` como `DEFAULT_WABA_API_KEY`
4. Configurar webhook URL: `https://tudominio.com/api/webhooks/whatsapp/TU_AGENCY_ID`

---

## Registrar primera agencia

```bash
curl -X POST http://localhost:3000/api/auth/register-agency \
  -H "Content-Type: application/json" \
  -d '{
    "agencyName": "Tu Agencia de Seguros",
    "adminName": "Tu Nombre",
    "email": "admin@tuagencia.com",
    "password": "contraseña_segura"
  }'
```

Guarda el `token` que devuelve — lo necesitas para todas las otras requests.

---

## Estructura

```
/
├── server/
│   ├── db/          - Schema Drizzle + conexión DB
│   ├── routes/      - Endpoints Express
│   ├── services/    - WhatsApp, AI, Cron
│   └── middleware/  - Auth JWT
├── client/
│   └── src/
│       ├── pages/   - Dashboard, Conversaciones, etc.
│       └── components/
├── .env.example
└── SPEC.md          - Especificación técnica completa
```

---

Desarrollado por **Elevon AI** — elevonai.com/discovery
