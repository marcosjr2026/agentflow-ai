import { useState } from 'react';
import { Bot, MessageSquare, Phone, BarChart3, Zap, Users, CheckCircle2, ArrowRight, Globe, Brain, TrendingUp, ChevronDown } from 'lucide-react';
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
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
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

function Features({ lang }) {
  const T = t[lang];
  const features = [
    { icon: MessageSquare, color: 'bg-blue-500/10 text-blue-400', title: T.feat1_title, desc: T.feat1_desc },
    { icon: Brain, color: 'bg-indigo-500/10 text-indigo-400', title: T.feat2_title, desc: T.feat2_desc },
    { icon: Phone, color: 'bg-emerald-500/10 text-emerald-400', title: T.feat3_title, desc: T.feat3_desc },
    { icon: BarChart3, color: 'bg-yellow-500/10 text-yellow-400', title: T.feat4_title, desc: T.feat4_desc },
    { icon: TrendingUp, color: 'bg-rose-500/10 text-rose-400', title: T.feat5_title, desc: T.feat5_desc },
    { icon: Users, color: 'bg-violet-500/10 text-violet-400', title: T.feat6_title, desc: T.feat6_desc },
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

function Pricing({ lang }) {
  const T = t[lang];
  const plans = [
    { name: 'Starter', price: '$497', setup: `$1,500 ${T.price_setup}`, color: 'border-white/10', badge: null, features: [T.price_starter_f1,T.price_starter_f2,T.price_starter_f3,T.price_starter_f4,T.price_starter_f5] },
    { name: 'Growth', price: '$797', setup: `$2,000 ${T.price_setup}`, color: 'border-yellow-400/50', badge: T.price_popular, features: [T.price_growth_f1,T.price_growth_f2,T.price_growth_f3,T.price_growth_f4,T.price_growth_f5,T.price_growth_f6,T.price_growth_f7] },
    { name: 'Pro', price: '$1,297', setup: `$3,000 ${T.price_setup}`, color: 'border-white/10', badge: null, features: [T.price_pro_f1,T.price_pro_f2,T.price_pro_f3,T.price_pro_f4,T.price_pro_f5,T.price_pro_f6,T.price_pro_f7] },
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
      <Features lang={lang} />
      <HowItWorks lang={lang} />
      <Comparison lang={lang} />
      <Pricing lang={lang} />
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
