import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bot, CheckCircle2, ArrowRight, ArrowLeft, Globe, Settings, Users, BarChart3 } from 'lucide-react';
import { t, defaultLang, setLang } from '../lib/i18n';

const API = import.meta.env.VITE_API_URL || '/api';
const tok = () => localStorage.getItem('token');

function Step1({ data, setData, T, lang }) {
  const types = lang === 'es'
    ? ['Medicare Advantage','Medicare Supplement','Medicaid','ACA','Privados','Vida','Auto','Hogar','Dental','Visión','Otro']
    : ['Medicare Advantage','Medicare Supplement','Medicaid','ACA','Private','Life','Auto','Home','Dental','Vision','Other'];
  const toggle = (v) => setData(d => ({
    ...d,
    insuranceTypes: (d.insuranceTypes||[]).includes(v)
      ? (d.insuranceTypes||[]).filter(x => x !== v)
      : [...(d.insuranceTypes||[]), v]
  }));
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_agency_name}</label>
        <input
          value={data.agencyDisplayName || ''}
          onChange={e => setData(d => ({ ...d, agencyDisplayName: e.target.value }))}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="Seguros Miami Pro"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_phone}</label>
        <input
          value={data.contactPhone || ''}
          onChange={e => setData(d => ({ ...d, contactPhone: e.target.value }))}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="+1 (305) 000-0000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">{T.ob_lang}</label>
        <div className="flex gap-3">
          {[['es', T.ob_lang_es], ['en', T.ob_lang_en], ['both', T.ob_lang_both]].map(([v, l]) => (
            <button key={v} onClick={() => setData(d => ({ ...d, primaryLang: v }))}
              className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.primaryLang === v ? 'bg-yellow-400 border-yellow-400 text-slate-950' : 'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">{T.ob_insurance}</label>
        <div className="flex flex-wrap gap-2">
          {types.map(ty => (
            <button key={ty} onClick={() => toggle(ty)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${(data.insuranceTypes||[]).includes(ty) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {ty}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepDone({ T, navigate }) {
  const nextSteps = [
    { icon: Settings, label: T.ob_next1 || 'Configura el speech y horarios de tu agente', color: 'bg-blue-50 text-blue-600' },
    { icon: Users, label: T.ob_next2 || 'Agrega a tu equipo de agentes', color: 'bg-violet-50 text-violet-600' },
    { icon: BarChart3, label: T.ob_next3 || 'Importa tus clientes existentes', color: 'bg-emerald-50 text-emerald-600' },
  ];
  return (
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-400 mb-6">
        <CheckCircle2 className="h-10 w-10 text-slate-950" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{T.ob_done_h}</h2>
      <p className="text-slate-500 mb-8">{T.ob_done_sub}</p>

      <div className="text-left space-y-3 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          {T.ob_next_label || 'Próximos pasos en el panel'}
        </p>
        {nextSteps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-700">{s.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/app/dashboard')}
        className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-4 rounded-2xl transition-all text-sm">
        {T.ob_go_dashboard || 'Ir al panel'} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lang, setLangState] = useState(defaultLang());
  const T = t[lang];
  const toggleLang = () => { const n = lang === 'es' ? 'en' : 'es'; setLang(n); setLangState(n); };
  const [data, setData] = useState({ primaryLang: 'both', insuranceTypes: [] });
  const [saving, setSaving] = useState(false);

  const canNext = () => step === 1 ? !!data.agencyDisplayName?.trim() : true;

  const handleFinish = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, data, {
        headers: { Authorization: `Bearer ${tok()}` }
      }).catch(() => {});
      setStep(2);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-5">
        <div className="mx-auto max-w-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-white font-bold">Open AG</span>
            <span className="text-slate-500 text-sm">— {T.ob_title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="flex items-center gap-1 text-xs text-slate-400 border border-white/10 rounded-lg px-3 py-1.5 hover:text-white transition-colors">
              <Globe className="h-3.5 w-3.5" />{lang === 'es' ? 'EN' : 'ES'}
            </button>
            {step === 1 && <span className="text-slate-400 text-sm">1 / 1</span>}
          </div>
        </div>
      </div>

      {/* Progress bar — only step 1 */}
      {step === 1 && (
        <div className="bg-white border-b border-slate-100">
          <div className="mx-auto max-w-xl px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-slate-950 text-xs font-bold flex-shrink-0">1</div>
              <span className="text-sm font-medium text-slate-900">{T.ob_s1_h}</span>
              <div className="flex-1 h-px bg-slate-200 ml-2" />
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          {step === 1 && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{T.ob_s1_h}</h2>
                <p className="mt-2 text-slate-500">{T.ob_s1_sub}</p>
              </div>
              <Step1 data={data} setData={setData} T={T} lang={lang} />
              <div className="flex items-center justify-end mt-10 pt-6 border-t border-slate-100">
                <button
                  onClick={handleFinish}
                  disabled={!canNext() || saving}
                  className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm px-8 py-3 rounded-2xl transition-all">
                  {saving ? (T.ob_saving || 'Guardando...') : (T.ob_finish || 'Crear mi agente')}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
          {step === 2 && <StepDone T={T} navigate={navigate} />}
        </div>
      </div>
    </div>
  );
}
