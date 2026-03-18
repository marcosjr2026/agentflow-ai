import { useState } from 'react';
import { Bot, MessageSquare, Phone, BarChart3, Zap, Users, CheckCircle2, ArrowRight, Globe, Brain, TrendingUp, ChevronDown, Mail, Hash } from 'lucide-react';
import { t, setLang } from '../lib/i18n';

function NavBar({ lang, onLang }) {
  const T = t[lang];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400">
            <Bot className="h-6 w-6 text-slate-950" />
          </div>
          <span className="text-lg font-bold text-white">Open AG</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">{T.nav_features}</a>
          <a href="#how" className="hover:text-white transition-colors">{T.nav_how}</a>
          <a href="#pricing" className="hover:text-white transition-colors">{T.nav_pricing}</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onLang} className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border border-white/10 rounded-lg px-3 py-2 hover:text-white hover:border-white/30 transition-colors">
            <Globe className="h-4 w-4" />
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <a href="/login" className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">{T.nav_login}</a>
        </div>
      </div>
    </header>
  );
}

function Hero({ lang }) {
  const T = t[lang];
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(250,204,21,0.15)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-300 mb-8">
          <Zap className="h-4 w-4" />{T.hero_badge}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
          {T.hero_h1a}<br /><span className="text-yellow-400">{T.hero_h1b}</span>
        </h1>
        <p className="mt-8 text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">{T.hero_sub}</p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-yellow-500/20">
            {T.hero_cta}<ArrowRight className="h-5 w-5" />
          </a>
          <a href="#how" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-colors">
            {T.hero_cta2}<ChevronDown className="h-5 w-5" />
          </a>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {(lang==='es'?['WhatsApp Real','Email dedicado','Dashboard 24/7']:['Real WhatsApp','Dedicated Email','24/7 Dashboard']).map(b => (
            <span key={b} className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-slate-300 text-xs font-medium px-4 py-2 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{b}
            </span>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[['90+', T.hero_stat1],['97%', T.hero_stat2],['24/7', T.hero_stat3]].map(([v,l]) => (
            <div key={l} className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{v}</p>
              <p className="text-sm text-slate-400 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentHighlight({ lang }) {
  const T = t[lang];
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-950 py-24 px-6 border-y border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 text-sm text-indigo-300 mb-6">
              <Brain className="h-4 w-4" />{T.agent_badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {T.agent_h2a}<br/><span className="text-indigo-400">{T.agent_h2b}</span>
            </h2>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">{T.agent_sub}</p>
            <ul className="mt-8 space-y-4">
              {[T.agent_f1,T.agent_f2,T.agent_f3,T.agent_f4,T.agent_f5].map(f => (
                <li key={f} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-800/50 p-6 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <Bot className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Open AG</p>
                <p className="text-xs text-emerald-400">● {T.agent_online}</p>
              </div>
            </div>
            {[
              { from: 'client', msg: lang === 'es' ? 'Hola, quiero saber cuándo es mi próximo pago' : 'Hi, when is my next payment?' },
              { from: 'ai', msg: lang === 'es' ? 'Hola María! 👋 Tu próximo pago es el 20 de marzo por $150. ¿Necesitas hacer algún cambio?' : 'Hi María! 👋 Your next payment is March 20th for $150. Do you need to make any changes?' },
              { from: 'client', msg: lang === 'es' ? 'Necesito un quiropráctico urgente' : 'I need a chiropractor urgently' },
              { from: 'ai', msg: lang === 'es' ? '¡Claro! Te conecto ahora con tu agente para coordinar la cita. Un momento... ✅' : "Of course! I'll connect you with your agent to schedule the appointment right away... ✅" },
            ].map((m, i) => (
              <div key={i} className={`flex ${m.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.from === 'ai' ? 'bg-slate-700 text-slate-100 rounded-tl-sm' : 'bg-yellow-400 text-slate-950 font-medium rounded-tr-sm'}`}>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function AgentConfig({ lang }) {
  const T = t[lang];
  const examples = lang === 'es' ? [
    { from: 'user', msg: 'Las comisiones son: 1-5 ventas sin bono, 6-9 ventas $100 por venta, 10-14 ventas $150, 15 o más $200' },
    { from: 'ai',  msg: '✅ Entendido. He configurado 4 tiers de comisión. ¿Quieres que aplique retroactivo a este mes?' },
    { from: 'user', msg: 'Sí, y agrega que las cancelaciones en los primeros 30 días descuentan la comisión' },
    { from: 'ai',  msg: '✅ Regla de cancelación agregada. Tus agentes recibirán el reporte ajustado hoy a las 6pm.' },
  ] : [
    { from: 'user', msg: 'Commissions are: 1-5 sales no bonus, 6-9 sales $100 per sale, 10-14 $150, 15+ $200' },
    { from: 'ai',  msg: '✅ Got it. I configured 4 commission tiers. Apply retroactively to this month?' },
    { from: 'user', msg: 'Yes, and cancellations within 30 days should deduct the commission' },
    { from: 'ai',  msg: '✅ Cancellation rule added. Your agents will receive the adjusted report today at 6pm.' },
  ];

  const tiers = lang === 'es' ? [
    { plan: 'Starter', color: 'border-slate-700 bg-slate-800/40', badge: 'bg-slate-700 text-slate-300', items: [
      { label: 'Ajustar horarios y bienvenida', ok: true },
      { label: 'Configurar comisiones con el agente', ok: false },
      { label: 'Definir rutas de mensajes hablando', ok: false },
      { label: 'Reglas de escalación avanzadas', ok: false },
      { label: 'Comandos ilimitados al agente', ok: false },
    ]},
    { plan: 'Growth', color: 'border-yellow-400/40 bg-yellow-400/5', badge: 'bg-yellow-400 text-slate-950', items: [
      { label: 'Ajustar horarios y bienvenida', ok: true },
      { label: 'Configurar comisiones con el agente', ok: true },
      { label: 'Definir rutas de mensajes hablando', ok: true },
      { label: 'Reglas de escalación avanzadas', ok: true },
      { label: 'Comandos ilimitados al agente', ok: false },
    ]},
    { plan: 'Pro', color: 'border-emerald-400/30 bg-emerald-400/5', badge: 'bg-emerald-400 text-slate-950', items: [
      { label: 'Ajustar horarios y bienvenida', ok: true },
      { label: 'Configurar comisiones con el agente', ok: true },
      { label: 'Definir rutas de mensajes hablando', ok: true },
      { label: 'Reglas de escalación avanzadas', ok: true },
      { label: 'Comandos ilimitados al agente', ok: true },
    ]},
  ] : [
    { plan: 'Starter', color: 'border-slate-700 bg-slate-800/40', badge: 'bg-slate-700 text-slate-300', items: [
      { label: 'Adjust hours and welcome message', ok: true },
      { label: 'Configure commissions with agent', ok: false },
      { label: 'Define message routing by talking', ok: false },
      { label: 'Advanced escalation rules', ok: false },
      { label: 'Unlimited agent commands', ok: false },
    ]},
    { plan: 'Growth', color: 'border-yellow-400/40 bg-yellow-400/5', badge: 'bg-yellow-400 text-slate-950', items: [
      { label: 'Adjust hours and welcome message', ok: true },
      { label: 'Configure commissions with agent', ok: true },
      { label: 'Define message routing by talking', ok: true },
      { label: 'Advanced escalation rules', ok: true },
      { label: 'Unlimited agent commands', ok: false },
    ]},
    { plan: 'Pro', color: 'border-emerald-400/30 bg-emerald-400/5', badge: 'bg-emerald-400 text-slate-950', items: [
      { label: 'Adjust hours and welcome message', ok: true },
      { label: 'Configure commissions with agent', ok: true },
      { label: 'Define message routing by talking', ok: true },
      { label: 'Advanced escalation rules', ok: true },
      { label: 'Unlimited agent commands', ok: true },
    ]},
  ];

  return (
    <section className="bg-slate-950 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-6xl space-y-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="rounded-3xl border border-white/10 bg-slate-800/50 p-6 space-y-4 backdrop-blur-sm order-2 lg:order-1">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <Bot className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Open AG Admin</p>
                <p className="text-xs text-emerald-400">● {lang === "es" ? "Tu agente de configuración" : "Your configuration agent"}</p>
              </div>
            </div>
            {examples.map((m, i) => (
              <div key={i} className={`flex ${m.from === "ai" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.from === "ai" ? "bg-slate-700 text-slate-100 rounded-tl-sm" : "bg-yellow-400 text-slate-950 font-medium rounded-tr-sm"}`}>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm text-emerald-300 mb-6">
              <Zap className="h-4 w-4" />
              {lang === "es" ? "Diferenciador exclusivo" : "Exclusive differentiator"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {lang === "es" ? <>Configura tu sistema<br /><span className="text-emerald-400">hablando con tu agente</span></> : <>Configure your system<br /><span className="text-emerald-400">by talking to your agent</span></>}
            </h2>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              {lang === "es"
                ? "No más formularios complejos. Tu agente entiende lenguaje natural y convierte tus instrucciones en reglas del sistema — comisiones, rutas, horarios, alertas."
                : "No more complex forms. Your agent understands natural language and converts your instructions into system rules — commissions, routing, schedules, alerts."}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              {lang === "es" ? "Disponible según tu plan:" : "Available by plan:"}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}



function Features({ lang }) {
  const T = t[lang];
  const features = [
    { icon: MessageSquare, color: 'bg-blue-500/10 text-blue-400', title: T.feat1_title, desc: T.feat1_desc },
    { icon: Brain, color: 'bg-indigo-500/10 text-indigo-400', title: T.feat2_title, desc: T.feat2_desc },
    { icon: Phone, color: 'bg-emerald-500/10 text-emerald-400', title: T.feat3_title, desc: T.feat3_desc },
    { icon: BarChart3, color: 'bg-yellow-500/10 text-yellow-400', title: T.feat4_title, desc: T.feat4_desc },
    { icon: TrendingUp, color: 'bg-rose-500/10 text-rose-400', title: T.feat5_title, desc: T.feat5_desc },
    { icon: Users, color: 'bg-violet-500/10 text-violet-400', title: T.feat6_title, desc: T.feat6_desc },
    { icon: Mail, color: 'bg-cyan-500/10 text-cyan-400', title: T.feat7_title, desc: T.feat7_desc },
    { icon: Hash, color: 'bg-pink-500/10 text-pink-400', title: T.feat8_title, desc: T.feat8_desc },
    { icon: TrendingUp, color: 'bg-orange-500/10 text-orange-400', title: T.feat9_title, desc: T.feat9_desc },
  ];
  return (
    <section id="features" className="bg-slate-950 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 mb-4">{T.feat_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{T.feat_h2}</h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">{T.feat_sub}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.color} mb-6`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview({ lang }) {
  const es = lang === 'es';
  const agents = [
    { name: es ? 'Agente Ventas' : 'Sales Agent', status: es ? 'activo' : 'active', conversations: 142, conversions: 38, rate: '26.8%', color: 'bg-emerald-400' },
    { name: es ? 'Agente Soporte' : 'Support Agent', status: es ? 'activo' : 'active', conversations: 89, conversions: 21, rate: '23.6%', color: 'bg-blue-400' },
    { name: es ? 'Agente Citas' : 'Booking Agent', status: es ? 'activo' : 'active', conversations: 64, conversions: 19, rate: '29.7%', color: 'bg-yellow-400' },
    { name: es ? 'Agente Re-engage' : 'Re-engage Agent', status: es ? 'pausado' : 'paused', conversations: 31, conversions: 7, rate: '22.6%', color: 'bg-slate-400' },
  ];
  const docs = [
    { name: 'María López', type: es ? 'Identificación' : 'ID Card', status: es ? 'Recibido' : 'Received', color: 'text-emerald-400' },
    { name: 'Carlos Ruiz', type: es ? 'Residencia' : 'Proof of Residence', status: es ? 'Pendiente' : 'Pending', color: 'text-yellow-400' },
    { name: 'Ana Torres', type: es ? 'Seguro médico' : 'Health Insurance', status: es ? 'Vencido' : 'Expired', color: 'text-red-400' },
  ];
  const payments = [
    { name: 'Jorge Méndez', amount: '$189', date: 'Mar 20', status: es ? 'Próximo' : 'Upcoming', color: 'text-yellow-400' },
    { name: 'Patricia Vega', amount: '$245', date: 'Mar 18', status: es ? 'Hoy' : 'Today', color: 'text-blue-400' },
    { name: 'Luis Herrera', amount: '$312', date: 'Mar 15', status: es ? 'Fallido' : 'Failed', color: 'text-red-400' },
    { name: 'Rosa Martínez', amount: '$178', date: 'Mar 14', status: es ? 'Pagado' : 'Paid', color: 'text-emerald-400' },
  ];
  const commissions = [
    { name: 'Sofía R.', sales: 14, amount: '$2,100', trend: '↑' },
    { name: 'Diego M.', sales: 11, amount: '$1,650', trend: '↑' },
    { name: 'Valeria C.', sales: 8, amount: '$800', trend: '↓' },
  ];
  const campaigns = [
    { name: es ? 'Beneficios Dentales — Abril' : 'Dental Benefits — April', sent: 142, opened: '68%', status: es ? 'Activa' : 'Active' },
    { name: es ? 'Guía Telemedicina' : 'Telemedicine Guide', sent: 89, opened: '54%', status: es ? 'Programada' : 'Scheduled' },
  ];
  const integrations = [
    { name: 'WhatsApp', color: 'bg-emerald-400', status: '✓' },
    { name: 'CRM', color: 'bg-blue-400', status: '✓' },
    { name: 'Email', color: 'bg-violet-400', status: '✓' },
  ];
  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 mb-4">
            {es ? 'PANEL DE CONTROL' : 'CONTROL PANEL'}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {es ? 'Así se ve por dentro' : "See what's inside"}
          </h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            {es ? 'Tu comando central. Todo en tiempo real, desde cualquier dispositivo.' : 'Your command center. Everything in real time, from any device.'}
          </p>
        </div>

        {/* Browser mockup */}
        <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
          {/* Browser chrome */}
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 bg-slate-700/60 rounded-md px-3 py-1 text-xs text-slate-400 max-w-xs mx-auto text-center">
              app.opnag.com/dashboard
            </div>
          </div>

          {/* Dashboard body */}
          <div className="bg-slate-950 flex">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-52 border-r border-white/10 p-4 gap-1 flex-shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 mb-4">
                <div className="h-7 w-7 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-slate-950" />
                </div>
                <span className="text-sm font-bold text-white">Open AG</span>
              </div>
              {[
                { icon: BarChart3, label: 'Dashboard', active: true },
                { icon: Bot, label: es ? 'Mis Agentes' : 'My Agents', active: false },
                { icon: MessageSquare, label: es ? 'Conversaciones' : 'Conversations', active: false },
                { icon: Users, label: es ? 'Contactos / CRM' : 'Contacts / CRM', active: false },
                { icon: CheckCircle2, label: es ? 'Documentos' : 'Documents', active: false },
                { icon: TrendingUp, label: es ? 'Pagos' : 'Payments', active: false },
                { icon: BarChart3, label: es ? 'Comisiones' : 'Commissions', active: false },
                { icon: Mail, label: es ? 'Educación' : 'Education', active: false },
              ].map(item => (
                <div key={item.label} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${item.active ? 'bg-yellow-400/10 text-yellow-400 font-medium' : 'text-slate-400'}`}>
                  <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                  {item.label}
                </div>
              ))}
              {/* Integrations */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-slate-600 px-3 mb-2">{es ? 'Integraciones' : 'Integrations'}</p>
                {integrations.map(i => (
                  <div key={i.name} className="flex items-center gap-2 px-3 py-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${i.color}`} />
                    <span className="text-xs text-slate-400">{i.name}</span>
                    <span className="ml-auto text-xs text-emerald-400">{i.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 overflow-hidden space-y-5">
              {/* Top stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: es ? 'Conversaciones hoy' : 'Conversations today', value: '326', delta: '+12%', color: 'text-emerald-400' },
                  { label: es ? 'Conversiones' : 'Conversions', value: '85', delta: '+8%', color: 'text-emerald-400' },
                  { label: es ? 'Pagos pendientes' : 'Pending payments', value: '3', delta: es ? '⚠ seguimiento' : '⚠ follow-up', color: 'text-yellow-400' },
                  { label: es ? 'Docs pendientes' : 'Pending docs', value: '7', delta: es ? '2 vencidos' : '2 expired', color: 'text-red-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className={`text-xs font-medium mt-1 ${stat.color}`}>{stat.delta}</p>
                  </div>
                ))}
              </div>

              {/* Row: Agents + Payments */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Agents */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{es ? 'Agentes' : 'Agents'}</p>
                    <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-lg font-medium">Live</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {agents.map(agent => (
                      <div key={agent.name} className="flex items-center gap-3 px-4 py-2.5">
                        <div className={`w-2 h-2 rounded-full ${agent.color} flex-shrink-0`} />
                        <p className="text-xs text-white font-medium flex-1 truncate">{agent.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'activo' || agent.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-slate-400/10 text-slate-400'}`}>
                          {agent.status}
                        </span>
                        <p className="text-xs font-semibold text-yellow-400 w-12 text-right">{agent.rate}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payments */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{es ? 'Pagos & Cobros' : 'Payments'}</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {payments.map(p => (
                      <div key={p.name} className="flex items-center gap-3 px-4 py-2.5">
                        <p className="text-xs text-white flex-1 truncate">{p.name}</p>
                        <span className="text-xs text-slate-400">{p.date}</span>
                        <span className="text-xs font-bold text-white w-14 text-right">{p.amount}</span>
                        <span className={`text-xs font-medium w-16 text-right ${p.color}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row: Documents + Commissions + Education */}
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Documents */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{es ? 'Documentos' : 'Documents'}</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {docs.map(d => (
                      <div key={d.name} className="px-4 py-2.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white font-medium">{d.name}</p>
                          <span className={`text-xs font-medium ${d.color}`}>{d.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{d.type}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commissions */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{es ? 'Comisiones' : 'Commissions'}</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {commissions.map(c => (
                      <div key={c.name} className="flex items-center gap-3 px-4 py-2.5">
                        <p className="text-xs text-white flex-1">{c.name}</p>
                        <span className="text-xs text-slate-400">{c.sales} {es ? 'ventas' : 'sales'}</span>
                        <span className="text-xs font-bold text-yellow-400">{c.amount}</span>
                        <span className={`text-xs ${c.trend === '↑' ? 'text-emerald-400' : 'text-red-400'}`}>{c.trend}</span>
                      </div>
                    ))}
                    <div className="px-4 py-2 flex items-center justify-between">
                      <p className="text-xs text-slate-500">Total {es ? 'mes' : 'month'}</p>
                      <p className="text-xs font-bold text-white">$4,550</p>
                    </div>
                  </div>
                </div>

                {/* Education campaigns */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{es ? 'Educación al Cliente' : 'Client Education'}</p>
                  </div>
                  <div className="divide-y divide-white/5">
                    {campaigns.map(c => (
                      <div key={c.name} className="px-4 py-2.5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-white font-medium truncate pr-2">{c.name}</p>
                          <span className={`text-xs flex-shrink-0 ${c.status === 'Activa' || c.status === 'Active' ? 'text-emerald-400' : 'text-blue-400'}`}>{c.status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">{c.sent} {es ? 'enviados' : 'sent'}</span>
                          <span className="text-xs text-yellow-400">{c.opened} {es ? 'apertura' : 'open rate'}</span>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2.5">
                      <p className="text-xs text-slate-500 mb-1">{es ? 'Próxima campaña' : 'Next campaign'}</p>
                      <p className="text-xs text-white">{es ? 'Recordatorio beneficios — Mar 22' : 'Benefits reminder — Mar 22'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ lang }) {
  const T = t[lang];
  const steps = [
    { n: '01', title: T.how_s1t, desc: T.how_s1d },
    { n: '02', title: T.how_s2t, desc: T.how_s2d },
    { n: '03', title: T.how_s3t, desc: T.how_s3d },
    { n: '04', title: T.how_s4t, desc: T.how_s4d },
  ];
  return (
    <section id="how" className="bg-gradient-to-b from-slate-950 to-slate-900 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-4">{T.how_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{T.how_h2}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map(s => (
            <div key={s.n} className="flex gap-6">
              <div className="text-5xl font-black text-white/10 leading-none w-16 flex-shrink-0">{s.n}</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Comparison({ lang }) {
  const T = t[lang];
  const rows = [
    { feature: lang === 'es' ? 'WhatsApp sin Meta/WABA' : 'WhatsApp without Meta/WABA', ag: true, oth: false },
    { feature: lang === 'es' ? 'Número dedicado incluido' : 'Dedicated number included', ag: true, oth: false },
    { feature: lang === 'es' ? 'Email @opnag.com incluido' : '@opnag.com email included', ag: true, oth: false },
    { feature: lang === 'es' ? 'AI bilingüe contextual' : 'Bilingual contextual AI', ag: true, oth: false },
    { feature: lang === 'es' ? 'Coach AI de ventas' : 'AI sales coach', ag: true, oth: false },
    { feature: lang === 'es' ? 'Sin costo por mensaje' : 'No per-message cost', ag: true, oth: false },
    { feature: lang === 'es' ? 'Infraestructura dedicada' : 'Dedicated infrastructure', ag: true, oth: false },
    { feature: lang === 'es' ? 'Secuencias de educación' : 'Education sequences', ag: true, oth: '½' },
  ];
  return (
    <section className="bg-slate-900 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-4">{T.comp_label}</p>
          <h2 className="text-4xl font-bold text-white">{T.comp_h2}</h2>
        </div>
        <div className="rounded-3xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-800 px-6 py-4 text-sm font-semibold">
            <p className="text-slate-400">{T.comp_f}</p>
            <p className="text-center text-yellow-400">Open AG</p>
            <p className="text-center text-slate-500">{T.comp_others}</p>
          </div>
          {rows.map((r, i) => (
            <div key={r.feature} className={`grid grid-cols-3 px-6 py-4 border-t border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
              <p className="text-slate-300 text-sm">{r.feature}</p>
              <p className="text-center"><CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" /></p>
              <p className="text-center text-slate-500 text-sm">{r.oth === false ? '✗' : r.oth}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatPreview({ lang }) {
  const T = t[lang];
  const es = lang === 'es';
  const messages = [
    { from: 'agent', name: T.chat_badge_agent, text: es ? '⚠️ Carlos Ruiz — pago fallido por $245. Tercer intento. Requiere atención inmediata.' : '⚠️ Carlos Ruiz — failed payment $245. Third attempt. Needs immediate attention.', time: '9:41 AM' },
    { from: 'human', name: T.chat_badge_sofia, text: es ? '@OAG ¿cuántas pólizas tiene Carlos activas?' : '@OAG how many active policies does Carlos have?', time: '9:42 AM' },
    { from: 'agent', name: T.chat_badge_agent, text: es ? 'Carlos tiene 2 pólizas activas: Dental ($89/mes) y Visión ($45/mes). Lleva 8 meses como cliente. Nunca había fallado un pago antes.' : 'Carlos has 2 active policies: Dental ($89/mo) and Vision ($45/mo). He\'s been a client for 8 months. First failed payment.', time: '9:42 AM' },
    { from: 'human', name: T.chat_badge_you, text: es ? '@OAG envíale un mensaje de cortesía a Carlos, no de cobro' : '@OAG send Carlos a courtesy message, not a collections message', time: '9:43 AM' },
    { from: 'agent', name: T.chat_badge_agent, text: es ? '✅ Enviado. Mensaje de cortesía enviado a Carlos por WhatsApp. Te notifico cuando responda.' : '✅ Done. Courtesy message sent to Carlos via WhatsApp. I\'ll notify you when he responds.', time: '9:43 AM' },
  ];
  const channels = [
    { name: es ? '# ventas-general' : '# sales-general', active: false },
    { name: es ? '# soporte' : '# support', active: false },
    { name: es ? '# admin' : '# admin', active: false },
    { name: es ? '🔴 Carlos Ruiz' : '🔴 Carlos Ruiz', active: true },
    { name: es ? '# María López' : '# Maria Lopez', active: false },
  ];
  return (
    <section className="bg-slate-950 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400 mb-4">{T.chat_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{T.chat_h2}</h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">{T.chat_sub}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Chat mockup */}
          <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser chrome */}
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-3 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 bg-slate-700/60 rounded-md px-3 py-1 text-xs text-slate-400 max-w-xs mx-auto text-center">
                app.opnag.com/chat
              </div>
            </div>

            <div className="flex bg-slate-950" style={{height: '420px'}}>
              {/* Channel list */}
              <div className="w-44 border-r border-white/10 flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-white/10">
                  <p className="text-xs font-bold text-white truncate">{es ? 'Mi Agencia' : 'My Agency'}</p>
                  <p className="text-xs text-emerald-400 mt-0.5">● {es ? 'OAG activo' : 'OAG active'}</p>
                </div>
                <div className="flex-1 p-2 space-y-0.5 overflow-hidden">
                  {channels.map(ch => (
                    <div key={ch.name} className={`px-2 py-1.5 rounded-lg text-xs cursor-pointer truncate ${ch.active ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-300'}`}>
                      {ch.name}
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-white/10">
                  <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-slate-950" />
                    </div>
                    <span className="text-xs text-slate-400 truncate">OAG</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <p className="text-sm font-semibold text-white">Carlos Ruiz</p>
                  <span className="text-xs text-slate-500 ml-auto">{es ? 'Caso abierto' : 'Open case'}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.from === 'human' && msg.name === T.chat_badge_you ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${msg.from === 'agent' ? 'bg-yellow-400 text-slate-950' : msg.name === T.chat_badge_you ? 'bg-blue-500 text-white' : 'bg-violet-500 text-white'}`}>
                        {msg.from === 'agent' ? <Bot className="h-3.5 w-3.5" /> : msg.name[0]}
                      </div>
                      <div className={`max-w-xs ${msg.from === 'human' && msg.name === T.chat_badge_you ? 'items-end' : ''}`}>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className={`text-xs font-semibold ${msg.from === 'agent' ? 'text-yellow-400' : 'text-slate-300'}`}>{msg.name}</span>
                          <span className="text-xs text-slate-600">{msg.time}</span>
                        </div>
                        <div className={`text-xs leading-relaxed px-3 py-2 rounded-2xl ${msg.from === 'agent' ? 'bg-yellow-400/10 text-slate-200 border border-yellow-400/20' : 'bg-white/8 text-slate-200'}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Input */}
                <div className="p-3 border-t border-white/10">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                    <span className="text-xs text-slate-500 flex-1">{es ? 'Mensaje al canal o @OAG...' : 'Message channel or @OAG...'}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-6">
            {[
              { icon: Hash, color: 'bg-pink-500/10 text-pink-400', text: T.chat_feat1 },
              { icon: Zap, color: 'bg-yellow-500/10 text-yellow-400', text: T.chat_feat2 },
              { icon: MessageSquare, color: 'bg-blue-500/10 text-blue-400', text: T.chat_feat3 },
              { icon: Bot, color: 'bg-emerald-500/10 text-emerald-400', text: T.chat_feat4 },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color} flex-shrink-0`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="text-lg text-slate-300 leading-relaxed pt-1.5">{f.text}</p>
              </div>
            ))}
            <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{es ? 'Disponible en' : 'Available in'}</p>
              <div className="flex gap-3">
                <span className="text-xs bg-white/10 text-slate-300 px-3 py-1 rounded-full">Growth</span>
                <span className="text-xs bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full font-medium">Pro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing({ lang }) {
  const T = t[lang];
  const plans = [
    { name: 'Starter', price: '$497', setup: `$1,500 ${T.price_setup}`, color: 'border-white/10', badge: null, features: [T.price_starter_f1,T.price_starter_f2,T.price_starter_f3,T.price_starter_f4,T.price_starter_f4b,T.price_starter_f5] },
    { name: 'Growth', price: '$797', setup: `$2,000 ${T.price_setup}`, color: 'border-yellow-400/50', badge: T.price_popular, features: [T.price_growth_f1,T.price_growth_f2,T.price_growth_f3,T.price_growth_f3b,T.price_growth_f4,T.price_growth_f5,T.price_growth_f6,T.price_growth_f7,T.price_growth_f8] },
    { name: 'Pro', price: '$1,297', setup: `$3,000 ${T.price_setup}`, color: 'border-white/10', badge: null, features: [T.price_pro_f1,T.price_pro_f2,T.price_pro_f3,T.price_pro_f3b,T.price_pro_f4,T.price_pro_f5,T.price_pro_f6,T.price_pro_f7,T.price_pro_f8] },
  ];
  return (
    <section id="pricing" className="bg-slate-950 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 mb-4">{T.price_label}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">{T.price_h2}</h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">{T.price_sub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-3xl border ${p.color} bg-white/5 p-8 flex flex-col ${p.badge ? 'ring-2 ring-yellow-400/50' : ''}`}>
              {p.badge && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-yellow-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full">{p.badge}</span></div>}
              <div className="mb-8">
                <p className="text-slate-400 text-sm font-medium">{p.name}</p>
                <p className="mt-2 text-5xl font-bold text-white">{p.price}<span className="text-xl text-slate-400 font-normal">/mo</span></p>
                <p className="mt-1 text-sm text-slate-500">{p.setup}</p>
              </div>
              <ul className="space-y-3 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <a href="/login" className={`mt-8 block text-center font-semibold py-3.5 rounded-2xl transition-all ${p.badge ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950' : 'border border-white/20 hover:border-white/40 text-white'}`}>{T.price_cta}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentCapabilities({ lang }) {
  const es = lang === 'es';
  const features = [
    { label: es ? 'Ajustar horarios y bienvenida'         : 'Set hours & welcome message',      starter: true,  growth: true,  pro: true  },
    { label: es ? 'Configurar comisiones con el agente'   : 'Configure commissions with agent',  starter: false, growth: true,  pro: true  },
    { label: es ? 'Definir rutas de mensajes hablando'    : 'Define message flows by voice',     starter: false, growth: true,  pro: true  },
    { label: es ? 'Reglas de escalación avanzadas'        : 'Advanced escalation rules',         starter: false, growth: true,  pro: true  },
    { label: es ? 'Comandos ilimitados al agente'         : 'Unlimited agent commands',          starter: false, growth: false, pro: true  },
    { label: es ? 'Chat interno con el equipo'            : 'Internal team chat',                starter: false, growth: true,  pro: true  },
    { label: es ? 'OAG activo en el chat interno'         : 'OAG active in internal chat',       starter: false, growth: false, pro: true  },
  ];

  const Check = ({ ok }) => ok
    ? <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
    : <div className="h-5 w-5 rounded-full border border-white/20 flex-shrink-0" />;

  const plans = [
    { name: 'Starter', badge: null,            badgeColor: 'bg-slate-500/20 text-slate-400',   key: 'starter' },
    { name: 'Growth',  badge: null,            badgeColor: 'bg-yellow-400/20 text-yellow-400', key: 'growth'  },
    { name: 'Pro',     badge: null,            badgeColor: 'bg-emerald-400/20 text-emerald-400', key: 'pro'   },
  ];

  return (
    <section className="bg-slate-950 pb-24 px-6">
      <div className="mx-auto max-w-5xl">
        <h3 className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500 mb-8">
          {es ? '¿Qué puedes hacer con tu OAG según tu plan?' : 'What can you do with your OAG by plan?'}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.key} className={`rounded-2xl border p-6 ${p.key === 'growth' ? 'border-yellow-400/30 bg-white/5' : 'border-white/10 bg-white/3'}`}>
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-white">{p.name}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.key === 'starter' ? 'bg-slate-500/20 text-slate-400' : p.key === 'growth' ? 'bg-yellow-400/20 text-yellow-400' : 'bg-emerald-400/20 text-emerald-400'}`}>
                  {p.name}
                </span>
              </div>
              <div className="space-y-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check ok={f[p.key]} />
                    <span className={`text-sm ${f[p.key] ? 'text-slate-200' : 'text-slate-600'}`}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ lang }) {
  const T = t[lang];
  return (
    <section className="bg-gradient-to-br from-yellow-400 to-yellow-300 py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-950 leading-tight">{T.cta_h2a}<br/>{T.cta_h2b}</h2>
        <p className="mt-6 text-xl text-slate-700">{T.cta_sub}</p>
        <a href="/login" className="mt-8 inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105">
          {T.cta_btn}<ArrowRight className="h-5 w-5" />
        </a>
        <p className="mt-4 text-sm text-slate-600">{T.cta_fine}</p>
      </div>
    </section>
  );
}

export default function Landing() {
  const [lang, setLangState] = useState(localStorage.getItem('lang') || 'es');
  const toggleLang = () => {
    const next = lang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', next);
    setLang(next);
    setLangState(next);
  };
  return (
    <div className="min-h-screen bg-slate-950">
      <NavBar lang={lang} onLang={toggleLang} />
      <Hero lang={lang} />
      <AgentHighlight lang={lang} />
      <AgentConfig lang={lang} />
      <Features lang={lang} />
      <DashboardPreview lang={lang} />
      <HowItWorks lang={lang} />
      <ChatPreview lang={lang} />
      <Comparison lang={lang} />
      <Pricing lang={lang} />
      <AgentCapabilities lang={lang} />
      <CTA lang={lang} />
      <footer className="bg-slate-950 border-t border-white/10 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-yellow-400 rounded-lg flex items-center justify-center"><Bot className="h-5 w-5 text-slate-950" /></div>
            <span className="text-white font-semibold">Open AG</span>
            <span className="text-slate-500 text-sm">by Elevon AI · opnAg.com</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Elevon AI · Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}
