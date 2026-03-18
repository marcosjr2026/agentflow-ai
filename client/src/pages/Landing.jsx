import { useState } from 'react';
import { Bot, MessageSquare, Phone, BarChart3, Shield, Zap, Users, CheckCircle2, Star, ArrowRight, Globe, Brain, TrendingUp, Lock, ChevronDown } from 'lucide-react';

function NavBar() {
  const [lang, setLang] = useState('es');
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400">
            <Bot className="h-6 w-6 text-slate-950" />
          </div>
          <span className="text-lg font-bold text-white">AgentFlow AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition-colors">Funciones</a>
          <a href="#how" className="hover:text-white transition-colors">Cómo funciona</a>
          <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(l => l === 'es' ? 'en' : 'es')}
            className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border border-white/10 rounded-lg px-3 py-2 hover:text-white hover:border-white/30 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <a href="/login" className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            Iniciar sesión
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(250,204,21,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.1)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-300 mb-8">
          <Zap className="h-4 w-4" />
          Tu propio agente AI · Sin Meta · Sin API de WhatsApp Business
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
          Tu agencia de seguros,<br />
          <span className="text-yellow-400">operada por AI</span>
        </h1>

        <p className="mt-8 text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          AgentFlow AI te da un agente conversacional propio con número de WhatsApp dedicado — responde clientes, detecta intenciones, cobra pagos, entrena a tu equipo y genera reportes. Todo automático.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-yellow-500/20">
            Solicitar demo
            <ArrowRight className="h-5 w-5" />
          </a>
          <a href="#how" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-colors">
            Ver cómo funciona
            <ChevronDown className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '90+', label: 'Agencias por servidor' },
            { value: '97%', label: 'Margen bruto' },
            { value: '24/7', label: 'Agente activo' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentHighlight() {
  return (
    <section className="bg-gradient-to-br from-slate-900 to-slate-950 py-24 px-6 border-y border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-2 text-sm text-indigo-300 mb-6">
              <Brain className="h-4 w-4" />
              Tu propio agente AI — como OpenClaw, pero para tu agencia
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Un agente que trabaja<br/>
              <span className="text-indigo-400">mientras tú duermes</span>
            </h2>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">
              No es un chatbot genérico. Es un agente con memoria, contexto y acceso a los datos reales de tu agencia. Sabe quién es cada cliente, cuál es su plan, si pagó o no, y qué necesita hoy.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Responde en español e inglés automáticamente',
                'Detecta intención: cita, queja, pago, documento',
                'Escala al equipo humano cuando lo necesita',
                'Opera con número de WhatsApp real — sin Meta',
                'Conectado a tu base de datos de clientes en tiempo real',
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-slate-800/50 p-6 space-y-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-slate-950" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">AgentFlow AI</p>
                  <p className="text-xs text-emerald-400">● En línea — 24/7</p>
                </div>
              </div>

              {[
                { from: 'client', msg: 'Hola, quiero saber cuándo es mi próximo pago' },
                { from: 'ai', msg: 'Hola María! 👋 Tu próximo pago es el 20 de marzo por $150. ¿Necesitas hacer algún cambio?' },
                { from: 'client', msg: 'Necesito un quiropráctico urgente' },
                { from: 'ai', msg: '¡Claro! Te conecto ahora con tu agente para coordinar la cita. Un momento... ✅' },
              ].map((m, i) => (
                <div key={i} className={`flex ${m.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.from === 'ai'
                      ? 'bg-slate-700 text-slate-100 rounded-tl-sm'
                      : 'bg-yellow-400 text-slate-950 font-medium rounded-tr-sm'
                  }`}>
                    {m.msg}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500">
                  Escribe un mensaje...
                </div>
                <button className="h-9 w-9 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: MessageSquare,
      color: 'bg-blue-500/10 text-blue-400',
      title: 'WhatsApp Real — Sin Meta',
      desc: 'Número de teléfono dedicado por agencia. Sin API de WhatsApp Business, sin templates obligatorios, sin $0.05 por conversación. Conversaciones naturales, sin restricciones.',
    },
    {
      icon: Brain,
      color: 'bg-indigo-500/10 text-indigo-400',
      title: 'AI Conversacional Bilingüe',
      desc: 'El agente detecta automáticamente si el cliente habla español o inglés y responde en su idioma. GPT-4o integrado con el contexto real de cada cliente.',
    },
    {
      icon: Phone,
      color: 'bg-emerald-500/10 text-emerald-400',
      title: 'Coach AI de Ventas',
      desc: 'El agente evalúa las llamadas de tu equipo, las transcribe con Whisper y genera un reporte de feedback personalizado cada día. Tu equipo mejora sin que tú tengas que estar.',
    },
    {
      icon: BarChart3,
      color: 'bg-yellow-500/10 text-yellow-400',
      title: 'Analytics en Tiempo Real',
      desc: 'KPIs de conversaciones, pagos en riesgo, performance del equipo y score promedio de llamadas. Todo en un dashboard limpio, actualizado en tiempo real.',
    },
    {
      icon: TrendingUp,
      color: 'bg-rose-500/10 text-rose-400',
      title: 'Pagos y Comisiones',
      desc: 'El agente recuerda a clientes sobre pagos próximos, alerta sobre pagos fallidos y calcula comisiones automáticamente por tiers. Sin hojas de cálculo.',
    },
    {
      icon: Users,
      color: 'bg-violet-500/10 text-violet-400',
      title: 'Secuencias de Educación',
      desc: 'Configura mensajes automáticos de onboarding, beneficios y renovación. El agente los envía en el momento correcto sin que nadie tenga que recordarlo.',
    },
  ];

  return (
    <section id="features" className="bg-slate-950 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 mb-4">Funciones</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Todo lo que tu agencia necesita</h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">Un sistema completo — no 6 herramientas separadas.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/8 hover:border-white/20 transition-all group">
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

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Elevon AI adquiere tu número', desc: 'Compramos una línea telefónica real y la conectamos al sistema. Sin teléfonos adicionales, sin contratos con Meta.' },
    { n: '02', title: 'Configuramos tu agente', desc: 'Personalizamos el speech, los flujos de intención y las reglas de tu agencia. Tu agente habla como tú quieres.' },
    { n: '03', title: 'Conectamos a tu equipo', desc: 'Creamos usuarios para tus agentes en el dashboard. Ven conversaciones, tareas y comisiones en tiempo real.' },
    { n: '04', title: 'Tu agente trabaja 24/7', desc: 'Desde el primer día, el agente responde, clasifica, cobra y entrena. Tú supervisas desde el dashboard.' },
  ];

  return (
    <section id="how" className="bg-gradient-to-b from-slate-950 to-slate-900 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-4">Proceso</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Activo en 24-48 horas</h2>
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

        <div className="mt-16 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-8">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Tu agente vive en tu VPS, no en nuestros servidores</h3>
              <p className="text-slate-300 leading-relaxed">A diferencia de otras soluciones, tu instancia de AgentFlow corre en infraestructura dedicada. Tus datos no se mezclan con los de otras agencias. Control total, cero dependencia de terceros.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { feature: 'WhatsApp sin Meta/WABA', agentflow: true, others: false },
    { feature: 'Número dedicado incluido', agentflow: true, others: false },
    { feature: 'AI bilingüe contextual', agentflow: true, others: false },
    { feature: 'Coach AI de ventas', agentflow: true, others: false },
    { feature: 'Comisiones automáticas', agentflow: true, others: false },
    { feature: 'Sin costo por mensaje', agentflow: true, others: false },
    { feature: 'Infraestructura dedicada', agentflow: true, others: false },
    { feature: 'Secuencias de educación', agentflow: true, others: '½' },
  ];

  return (
    <section className="bg-slate-900 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-4">Comparación</p>
          <h2 className="text-4xl font-bold text-white">AgentFlow vs el resto</h2>
        </div>

        <div className="rounded-3xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-800 px-6 py-4 text-sm font-semibold">
            <p className="text-slate-400">Función</p>
            <p className="text-center text-yellow-400">AgentFlow AI</p>
            <p className="text-center text-slate-500">Otros CRMs</p>
          </div>
          {rows.map((r, i) => (
            <div key={r.feature} className={`grid grid-cols-3 px-6 py-4 border-t border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
              <p className="text-slate-300 text-sm">{r.feature}</p>
              <p className="text-center">
                {r.agentflow === true && <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" />}
              </p>
              <p className="text-center text-slate-500 text-sm">
                {r.others === false ? '✗' : r.others}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$497',
      setup: '$1,500 setup',
      color: 'border-white/10',
      badge: null,
      features: [
        'Hasta 3 agentes',
        '1,000 mensajes/mes',
        'Número WhatsApp dedicado',
        'AI bilingüe',
        'Dashboard completo',
        'Soporte por email',
      ],
    },
    {
      name: 'Growth',
      price: '$797',
      setup: '$2,000 setup',
      color: 'border-yellow-400/50',
      badge: 'Más popular',
      features: [
        'Hasta 10 agentes',
        '5,000 mensajes/mes',
        'Número WhatsApp dedicado',
        'AI bilingüe',
        '50 evaluaciones de llamadas/mes',
        'Secuencias de educación (10)',
        'Soporte por WhatsApp',
      ],
    },
    {
      name: 'Pro',
      price: '$1,297',
      setup: '$3,000 setup',
      color: 'border-white/10',
      badge: null,
      features: [
        'Agentes ilimitados',
        'Mensajes ilimitados',
        'Número WhatsApp dedicado',
        'AI bilingüe',
        'Evaluaciones ilimitadas',
        'Secuencias ilimitadas',
        'Soporte prioritario 24/7',
      ],
    },
  ];

  return (
    <section id="pricing" className="bg-slate-950 py-24 px-6 border-t border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400 mb-4">Precios</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Inversión, no gasto</h2>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            Un agente AI trabaja más que cualquier empleado y cuesta menos. El ROI se ve en el primer mes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-3xl border ${p.color} bg-white/5 p-8 flex flex-col ${p.badge ? 'ring-2 ring-yellow-400/50' : ''}`}>
              {p.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full">{p.badge}</span>
                </div>
              )}
              <div className="mb-8">
                <p className="text-slate-400 text-sm font-medium">{p.name}</p>
                <p className="mt-2 text-5xl font-bold text-white">{p.price}<span className="text-xl text-slate-400 font-normal">/mes</span></p>
                <p className="mt-1 text-sm text-slate-500">{p.setup}</p>
              </div>
              <ul className="space-y-3 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/login" className={`mt-8 block text-center font-semibold py-3.5 rounded-2xl transition-all ${
                p.badge
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950'
                  : 'border border-white/20 hover:border-white/40 text-white'
              }`}>
                Solicitar demo
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-gradient-to-br from-yellow-400 to-yellow-300 py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-950 leading-tight">
          Tu agente AI está listo.<br/>¿Lo está tu agencia?
        </h2>
        <p className="mt-6 text-xl text-slate-700">
          Empieza con una demo. Sin compromiso, sin tarjeta de crédito.
        </p>
        <a href="/login" className="mt-8 inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105">
          Solicitar demo gratuita
          <ArrowRight className="h-5 w-5" />
        </a>
        <p className="mt-4 text-sm text-slate-600">Activo en 24-48 horas · Incluye número WhatsApp dedicado</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-white font-semibold">AgentFlow AI</span>
          <span className="text-slate-500 text-sm">by Elevon AI</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 Elevon AI · elevonai.com · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NavBar />
      <Hero />
      <AgentHighlight />
      <Features />
      <HowItWorks />
      <Comparison />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
