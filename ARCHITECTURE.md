# Open AG — Arquitectura Completa & Plan de Fases
**Versión:** 1.0 | **Fecha:** 2026-03-18 | **Aprobado por:** Marcos Socorro

---

## 1. VISIÓN DEL PRODUCTO

Open AG es una plataforma SaaS para agencias independientes (seguros, salud, ventas) que reemplaza 6+ herramientas con un solo sistema: un agente de IA propio por agencia, conectado a WhatsApp, con un dashboard web completo.

**Propuesta de valor central:**
> "Tu agencia entera, manejada por un agente que nunca duerme."

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Visión General

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTES / EQUIPO                    │
│         (WhatsApp — número dedicado por agencia)         │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   OAG — OpenAgent                        │
│              (VPS — instancia por agencia)               │
│                                                          │
│  • Responde clientes en WhatsApp (ES/EN)                 │
│  • Coordina equipo de agentes humanos                    │
│  • Habla con el dueño de la agencia                      │
│  • Procesa documentos, pagos, citas                      │
│  • Ejecuta reglas de comisiones                          │
│  • Alimenta el dashboard en tiempo real                  │
└───────────────────────┬─────────────────────────────────┘
                        │ API / WebSocket
                        ▼
┌─────────────────────────────────────────────────────────┐
│               DASHBOARD — opnag.com                      │
│                  (Replit → Producción)                   │
│                                                          │
│  • Conversaciones      • Pagos & Cobros                  │
│  • Documentos          • Comisiones                      │
│  • Contactos / CRM     • Educación al Cliente            │
│  • Analytics           • Chat Interno del Equipo         │
│  • Configuración OAG   • Multi-agencia                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Comunicación Externa (WhatsApp)

- **Canal único:** Todo pasa por WhatsApp — clientes, agentes del equipo y dueño de la agencia
- **Número dedicado:** Cada agencia tiene su propio número de teléfono real
- **Stock pre-comprado:** Marcos mantiene números disponibles para asignación inmediata al activar una agencia
- **Proveedor:** Baileys (librería Node.js) + SIM física dedicada por agencia
- **Sin templates:** Conversaciones 100% libres y naturales — sin restricciones de Meta
- **Idioma:** El OAG detecta automáticamente español o inglés

### 2.3 OAG — OpenAgent por Agencia

- **Infraestructura:** VPS (187.124.83.80) — contenedor Docker por agencia
- **IA:** GPT-4o (conversación, análisis, coaching, comisiones en lenguaje natural)
- **Transcripción:** OpenAI Whisper (evaluación de llamadas de ventas)
- **Memoria:** Acceso en tiempo real a la DB de la agencia — conoce cada cliente, plan, pago, documento
- **Capacidades:**
  - Responder clientes (servicio al cliente, citas, dudas)
  - Coordinar equipo humano (asignar tareas, notificar)
  - Reportar al dueño (resúmenes, alertas, KPIs por WhatsApp)
  - Ejecutar reglas de comisión configuradas en lenguaje natural
  - Publicar alertas en el chat interno del dashboard

### 2.4 Dashboard Web (opnag.com)

- **Stack:** React + Vite (frontend) + Node.js/Express (backend) + PostgreSQL + Drizzle ORM
- **Auth:** JWT + bcrypt
- **Multi-tenant:** Cada agencia aislada por `agency_id`
- **Módulos:**

| Módulo | Descripción |
|--------|-------------|
| Conversaciones | Historial WhatsApp, contexto completo por cliente |
| Contactos / CRM | Leads, clientes activos, agentes — con tipo de usuario |
| Pagos & Cobros | Recordatorios, fallidos, confirmaciones, seguimiento |
| Documentos | Upload, seguimiento, vencimientos, solicitud automática |
| Comisiones | Reglas en lenguaje natural, cálculo automático mensual |
| Analytics | KPIs en tiempo real — conversiones, pagos en riesgo, team performance |
| Educación | Campañas programadas por tipo de seguro / evento |
| Chat Interno | Canal estilo Slack — por cliente, por depto, con OAG participando |
| Configuración | Personalizar OAG, speech, flujos, integraciones |

### 2.5 Comisiones — Motor Configurable por Voz

El dueño configura reglas hablándole al OAG en WhatsApp:

> *"OAG, cambia las comisiones — si venden más de 10 este mes ganan $200 por venta"*

El OAG:
1. Interpreta la instrucción con GPT-4o
2. Actualiza la tabla `commission_rules` (JSON flexible por agencia)
3. Confirma el cambio al dueño
4. Notifica al equipo automáticamente
5. Aplica las nuevas reglas al cierre del período

**Reglas soportadas:** por volumen, por tipo de póliza, por período, por agente específico, con bonos, con penalizaciones — cualquier lógica expresable en lenguaje natural.

### 2.6 Chat Interno del Equipo

- **Estilo:** Slack/Discord dentro del dashboard
- **Canales por cliente:** hilo por cliente con toda su actividad
- **Canales por depto:** Ventas, Soporte, Admin
- **OAG como participante activo:**
  - Postea alertas automáticas: pagos fallidos, docs vencidos, leads calientes
  - Responde preguntas del equipo con datos reales
  - Recibe instrucciones: *"@OAG pausa seguimiento a este cliente"*
- **Tecnología:** WebSockets para mensajería en tiempo real

---

## 3. MODELO DE NEGOCIO

### Planes
| Plan | Precio | Setup |
|------|--------|-------|
| Starter | $497/mes | $1,500 |
| Growth | $797/mes | $2,000 |
| Pro | $1,297/mes | $3,000 |

### Monetización
- Suscripción mensual por agencia
- Setup fee único al activar
- Expansión: más agentes, más números, integraciones premium

---

## 4. FASES DE DESARROLLO

### FASE 1 — Landing Page ✅ COMPLETA
**Objetivo:** Presentar el producto para cerrar primeras ventas
- [x] Landing bilingüe (ES/EN)
- [x] 9 feature cards incluyendo chat interno y comisiones por voz
- [x] Mockup de dashboard completo (agentes, pagos, docs, comisiones, educación)
- [x] Sección de precios
- [x] Comparación vs competencia
- [x] Demo de conversación con OAG

---

### FASE 2 — Multi-tenant & Onboarding 🔲 SIGUIENTE
**Objetivo:** Que una agencia real pueda registrarse y activar su cuenta
- [ ] Registro de agencia (nombre, número WhatsApp, plan)
- [ ] Onboarding guiado: equipo → agentes → comisiones → integraciones
- [ ] Provisioning automático de OAG en VPS al activar
- [ ] Asignación de número WhatsApp del stock
- [ ] Panel super_admin (Marcos) para ver todas las agencias

---

### FASE 3 — Core OAG (WhatsApp + AI) 🔲
**Objetivo:** El agente funciona y responde en WhatsApp con datos reales
- [ ] Webhook 360Dialog → procesamiento de mensajes
- [ ] Detección de intención (servicio, venta, pago, documento, cita)
- [ ] Respuestas GPT-4o con contexto de la agencia
- [ ] Escalado al equipo humano
- [ ] OAG recibe instrucciones del dueño por WhatsApp
- [ ] OAG configura comisiones por lenguaje natural

---

### FASE 4 — Dashboard Operativo 🔲
**Objetivo:** El equipo puede gestionar todo desde el dashboard
- [ ] Vista de conversaciones en tiempo real
- [ ] Gestión de contactos (leads / clientes / agentes)
- [ ] Asignación de tareas desde el dashboard
- [ ] Notificaciones en tiempo real (WebSocket)
- [ ] Analytics: conversaciones, conversiones, team performance

---

### FASE 5 — Documentos & Pagos 🔲
**Objetivo:** Automatizar la gestión administrativa
- [ ] Solicitud automática de documentos por WhatsApp
- [ ] Upload y almacenamiento (Cloudinary)
- [ ] Seguimiento de vencimientos y recordatorios
- [ ] Recordatorios de pago 2-3 días antes
- [ ] Alerta de pago fallido + seguimiento automático
- [ ] Confirmación de pago procesado
- [ ] Registro de pagos vinculado a agente (para comisiones)

---

### FASE 6 — Comisiones 🔲
**Objetivo:** Motor de comisiones flexible administrado por el OAG
- [ ] Tabla `commission_rules` (JSON flexible por agencia)
- [ ] OAG interpreta lenguaje natural → actualiza reglas
- [ ] Motor de cálculo al cierre del mes
- [ ] Reporte de comisiones por agente
- [ ] Notificación automática al equipo cuando cambian reglas
- [ ] Historial de cambios de reglas

---

### FASE 7 — Chat Interno 🔲
**Objetivo:** Comunicación interna del equipo dentro de la plataforma
- [ ] WebSocket server para mensajería en tiempo real
- [ ] Canales por cliente y por departamento
- [ ] OAG como participante activo (alertas + respuestas)
- [ ] DMs entre agentes
- [ ] Notificaciones push en dashboard

---

### FASE 8 — Producción 🔲
**Objetivo:** Plataforma estable lista para clientes de pago
- [ ] Dominio opnag.com configurado
- [ ] SSL + HTTPS
- [ ] Variables de entorno en producción
- [ ] CI/CD: GitHub → deploy automático
- [ ] Backups automáticos de DB
- [ ] Monitoring y alertas de uptime
- [ ] Documentación de onboarding para clientes

---

## 5. STACK TECNOLÓGICO COMPLETO

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL + Drizzle ORM |
| Auth | JWT + bcrypt |
| IA | OpenAI GPT-4o + Whisper |
| WhatsApp | Baileys + SIM física por agencia |
| Email | Zoho Mail — `agencia@opnag.com` por agencia |
| Archivos | Cloudinary |
| Chat interno | WebSockets (ws) |
| Jobs/Cron | node-cron |
| Deploy dashboard | Replit → VPS |
| Deploy OAG | VPS (Docker por agencia) |
| Repositorio | GitHub: marcosjr2026/agentflow-ai |

---

## 6. DECISIONES DE PRODUCTO (NO CAMBIAR SIN CONSULTAR)

1. **WhatsApp es el único canal externo** — no app móvil, no email al cliente directo
2. **Baileys + SIM física** — conversaciones naturales sin templates ni restricciones de Meta
3. **Email por agencia** — `agencia@opnag.com` via Zoho Mail, incluido en todos los planes
4. **Un OAG por agencia** — instancia Baileys + proceso dedicado en VPS, aislamiento total
5. **SIMs pre-compradas** — stock listo, activación inmediata al registrar agencia
6. **Comisiones por lenguaje natural** — no formularios rígidos
7. **Chat interno con OAG participando** — el agente no es solo notificaciones, ejecuta instrucciones
8. **Multi-tenant desde el día 1** — diseño para múltiples agencias desde la base

---

*Documento generado por Itai ⚖️ | 2026-03-18*
