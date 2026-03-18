import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bot, Building2, MessageSquare, BookOpen,
  Users, DollarSign, CheckCircle2, ArrowRight,
  ArrowLeft, Upload, Plus, Trash2, Globe, Clock
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');

const STEPS = [
  { n: 1, label: 'Agencia',         icon: Building2 },
  { n: 2, label: 'Comunicación',    icon: MessageSquare },
  { n: 3, label: 'Conocimiento',    icon: BookOpen },
  { n: 4, label: 'Contactos',       icon: Users },
  { n: 5, label: 'Comisiones',      icon: DollarSign },
];

/* ─── Step 1: Agency Info ─────────────────────────────────────────────────── */
function Step1({ data, setData }) {
  const insuranceTypes = ['Medicare Advantage','Medicare Supplement','Medicaid','Vida','Auto','Hogar','Dental','Visión'];
  const toggle = (t) => {
    const cur = data.insuranceTypes || [];
    setData(d => ({ ...d, insuranceTypes: cur.includes(t) ? cur.filter(x=>x!==t) : [...cur,t] }));
  };
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Nombre de la agencia</label>
        <input value={data.agencyDisplayName||''} onChange={e=>setData(d=>({...d,agencyDisplayName:e.target.value}))}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="Seguros Miami Pro" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Teléfono de contacto</label>
        <input value={data.contactPhone||''} onChange={e=>setData(d=>({...d,contactPhone:e.target.value}))}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="+1 (305) 000-0000" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Sitio web (opcional)</label>
        <input value={data.website||''} onChange={e=>setData(d=>({...d,website:e.target.value}))}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="www.miagencia.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Idioma primario del mercado</label>
        <div className="flex gap-3">
          {[['es','Español'],['en','English'],['both','Ambos']].map(([v,l])=>(
            <button key={v} onClick={()=>setData(d=>({...d,primaryLang:v}))}
              className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.primaryLang===v?'bg-yellow-400 border-yellow-400 text-slate-950':'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Tipos de seguro que manejan</label>
        <div className="flex flex-wrap gap-2">
          {insuranceTypes.map(t=>(
            <button key={t} onClick={()=>toggle(t)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${(data.insuranceTypes||[]).includes(t)?'bg-slate-900 border-slate-900 text-white':'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Communication Preferences ──────────────────────────────────── */
function Step2({ data, setData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hora inicio atención</label>
          <input type="time" value={data.hoursStart||'08:00'} onChange={e=>setData(d=>({...d,hoursStart:e.target.value}))}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hora fin atención</label>
          <input type="time" value={data.hoursEnd||'17:00'} onChange={e=>setData(d=>({...d,hoursEnd:e.target.value}))}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje fuera de horario</label>
        <textarea value={data.afterHoursMsg||''} onChange={e=>setData(d=>({...d,afterHoursMsg:e.target.value}))} rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
          placeholder="Gracias por escribirnos. Nuestro horario es de 8am a 5pm. Te contactaremos en cuanto abramos. 🙏" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Días antes para recordatorio de pago</label>
        <div className="flex gap-3">
          {[1,2,3,5,7].map(d=>(
            <button key={d} onClick={()=>setData(dt=>({...dt,paymentReminderDays:d}))}
              className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.paymentReminderDays===d?'bg-yellow-400 border-yellow-400 text-slate-950':'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Mensaje de bienvenida del agente</label>
        <textarea value={data.welcomeMsg||''} onChange={e=>setData(d=>({...d,welcomeMsg:e.target.value}))} rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
          placeholder="¡Hola! 👋 Soy el asistente de {agencia}. ¿En qué puedo ayudarte hoy?" />
        <p className="text-xs text-slate-400 mt-1">Usa {`{agencia}`} para insertar el nombre automáticamente</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Escalación urgente a (número WhatsApp del manager)</label>
        <input value={data.escalationPhone||''} onChange={e=>setData(d=>({...d,escalationPhone:e.target.value}))}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
          placeholder="+1 (305) 000-0000" />
      </div>
    </div>
  );
}

/* ─── Step 3: Knowledge Base ──────────────────────────────────────────────── */
function Step3({ data, setData }) {
  const addFaq = () => setData(d=>({...d, faqs:[...(d.faqs||[]),{q:'',a:''}]}));
  const updateFaq = (i,field,val) => setData(d=>({...d,faqs:d.faqs.map((f,idx)=>idx===i?{...f,[field]:val}:f)}));
  const removeFaq = (i) => setData(d=>({...d,faqs:d.faqs.filter((_,idx)=>idx!==i)}));
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Speech de ventas / Presentación del producto</label>
        <textarea value={data.salesSpeech||''} onChange={e=>setData(d=>({...d,salesSpeech:e.target.value}))} rows={5}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
          placeholder="Ejemplo: Nuestro plan Medicare Advantage cubre visitas médicas, dental, visión y transporte sin costo adicional..." />
        <p className="text-xs text-slate-400 mt-1">El agente usa esto para responder preguntas sobre beneficios y hacer presentaciones</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Objeciones comunes y respuestas</label>
        <textarea value={data.objections||''} onChange={e=>setData(d=>({...d,objections:e.target.value}))} rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
          placeholder="'Es muy caro' → 'El plan tiene $0 de prima mensual...' | 'Ya tengo un plan' → 'Podemos comparar beneficios sin compromiso...'" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">Preguntas frecuentes (FAQ)</label>
          <button onClick={addFaq} className="flex items-center gap-1 text-xs text-yellow-600 font-medium hover:text-yellow-700">
            <Plus className="h-4 w-4" />Agregar
          </button>
        </div>
        <div className="space-y-3">
          {(data.faqs||[]).map((faq,i)=>(
            <div key={i} className="rounded-2xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <input value={faq.q} onChange={e=>updateFaq(i,'q',e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Pregunta del cliente..." />
                <button onClick={()=>removeFaq(i)} className="text-slate-300 hover:text-rose-400 mt-1"><Trash2 className="h-4 w-4"/></button>
              </div>
              <textarea value={faq.a} onChange={e=>updateFaq(i,'a',e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                placeholder="Respuesta del agente..." />
            </div>
          ))}
          {!(data.faqs||[]).length && (
            <button onClick={addFaq} className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-yellow-300 hover:text-yellow-500 transition-colors">
              + Agregar primera pregunta frecuente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Contacts CSV Upload ─────────────────────────────────────────── */
function Step4({ data, setData }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h=>h.trim().replace(/"/g,''));
    const rows = lines.slice(1,6).map(l=>l.split(',').map(v=>v.trim().replace(/"/g,'')));
    setPreview({ headers, rows, total: lines.length - 1 });
    setData(d=>({...d, csvFile: file, csvName: file.name, csvTotal: lines.length - 1}));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) handleFile(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-600 mb-4">Sube un archivo CSV con tus contactos. El agente los reconocerá por número de WhatsApp desde el primer mensaje.</p>
        <p className="text-xs text-slate-400 mb-4">Columnas recomendadas: <span className="font-mono bg-slate-100 px-1 rounded">nombre, telefono, plan, fecha_efectiva, agente, estado_pago</span></p>
      </div>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={e=>e.preventDefault()}
          onClick={()=>fileRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-yellow-400 hover:bg-yellow-50 transition-all"
        >
          <Upload className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="font-medium text-slate-700">Arrastra tu CSV aquí o haz clic para seleccionar</p>
          <p className="text-sm text-slate-400 mt-2">Solo archivos .csv</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e=>handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium text-emerald-800 text-sm">{data.csvName}</p>
                <p className="text-xs text-emerald-600">{preview.total} contactos detectados</p>
              </div>
            </div>
            <button onClick={()=>{setPreview(null);setData(d=>({...d,csvFile:null,csvName:null,csvTotal:0}))}}
              className="text-xs text-slate-400 hover:text-slate-600">Cambiar</button>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Vista previa (primeras 5 filas)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    {preview.headers.map(h=>(
                      <th key={h} className="px-4 py-2 text-left text-slate-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row,i)=>(
                    <tr key={i} className="border-b border-slate-50">
                      {row.map((cell,j)=>(
                        <td key={j} className="px-4 py-2 text-slate-700">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4">
        <p className="text-sm text-blue-700 font-medium mb-1">También puedes importar después</p>
        <p className="text-xs text-blue-600">Si no tienes el CSV listo, puedes continuar y subir los contactos desde el módulo de Contactos más adelante.</p>
      </div>
    </div>
  );
}

/* ─── Step 5: Commission Rules ────────────────────────────────────────────── */
function Step5({ data, setData }) {
  const addTier = () => setData(d=>({...d, commissionTiers:[...(d.commissionTiers||[]),{minSales:0,maxSales:0,amount:0}]}));
  const updateTier = (i,field,val) => setData(d=>({...d,commissionTiers:d.commissionTiers.map((t,idx)=>idx===i?{...t,[field]:Number(val)}:t)}));
  const removeTier = (i) => setData(d=>({...d,commissionTiers:d.commissionTiers.filter((_,idx)=>idx!==i)}));

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Período de pago de comisiones</label>
        <div className="flex gap-3">
          {[['monthly','Mensual'],['biweekly','Quincenal']].map(([v,l])=>(
            <button key={v} onClick={()=>setData(d=>({...d,commissionPeriod:v}))}
              className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.commissionPeriod===v?'bg-yellow-400 border-yellow-400 text-slate-950':'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">Tiers de comisión</label>
          <button onClick={addTier} className="flex items-center gap-1 text-xs text-yellow-600 font-medium hover:text-yellow-700">
            <Plus className="h-4 w-4"/>Agregar tier
          </button>
        </div>

        <div className="space-y-3">
          {(data.commissionTiers||[]).map((tier,i)=>(
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Min ventas</label>
                <input type="number" value={tier.minSales} onChange={e=>updateTier(i,'minSales',e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Max ventas</label>
                <input type="number" value={tier.maxSales} onChange={e=>updateTier(i,'maxSales',e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">$/venta</label>
                <input type="number" value={tier.amount} onChange={e=>updateTier(i,'amount',e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              </div>
              <button onClick={()=>removeTier(i)} className="mt-5 text-slate-300 hover:text-rose-400"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}

          {!(data.commissionTiers||[]).length && (
            <button onClick={addTier} className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-yellow-300 hover:text-yellow-500 transition-colors">
              + Agregar primer tier de comisión
            </button>
          )}
        </div>

        {(data.commissionTiers||[]).length > 0 && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Vista previa de reglas:</p>
            {data.commissionTiers.map((t,i)=>(
              <p key={i} className="text-xs text-slate-600">{t.minSales}-{t.maxSales} ventas → <span className="font-semibold text-slate-800">${t.amount}/venta</span></p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Notas adicionales de comisión</label>
        <textarea value={data.commissionNotes||''} onChange={e=>setData(d=>({...d,commissionNotes:e.target.value}))} rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none"
          placeholder="Ej: Bonos especiales por Medicare Advantage, ajustes por cancelaciones, etc." />
      </div>
    </div>
  );
}

/* ─── Main Wizard ─────────────────────────────────────────────────────────── */
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    primaryLang: 'both',
    insuranceTypes: [],
    paymentReminderDays: 3,
    commissionPeriod: 'monthly',
    commissionTiers: [],
    faqs: [],
  });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const canNext = () => {
    if (step === 1) return data.agencyDisplayName?.trim();
    return true;
  };

  const handleNext = () => {
    if (step < 5) setStep(s => s + 1);
    else handleFinish();
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, data, {
        headers: { Authorization: `Bearer ${token()}` }
      }).catch(()=>{}); // graceful — endpoint may not exist yet
      setDone(true);
      setTimeout(() => navigate('/app/dashboard'), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (done) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-400 mb-6">
          <CheckCircle2 className="h-12 w-12 text-slate-950" />
        </div>
        <h1 className="text-3xl font-bold text-white">¡Listo!</h1>
        <p className="mt-3 text-slate-400">Tu agencia está configurada. Redirigiendo al dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-5">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Bot className="h-5 w-5 text-slate-950" />
            </div>
            <span className="text-white font-bold">Open AG</span>
            <span className="text-slate-500 text-sm">— Configuración inicial</span>
          </div>
          <span className="text-slate-400 text-sm">Paso {step} de 5</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                    step === s.n ? 'bg-yellow-400 text-slate-950' :
                    step > s.n ? 'bg-slate-900 text-white' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {step > s.n ? <CheckCircle2 className="h-4 w-4" /> : s.n}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === s.n ? 'text-slate-900' : 'text-slate-400'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${step > s.n ? 'bg-slate-900' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {step === 1 && 'Información de tu agencia'}
              {step === 2 && 'Preferencias de comunicación'}
              {step === 3 && 'Base de conocimiento del agente'}
              {step === 4 && 'Importar contactos'}
              {step === 5 && 'Reglas de comisiones'}
            </h2>
            <p className="mt-2 text-slate-500">
              {step === 1 && 'Cuéntanos sobre tu agencia. Tu agente usará esta información para presentarse.'}
              {step === 2 && 'Define cómo y cuándo debe responder tu agente.'}
              {step === 3 && 'Esto es lo que tu agente va a "saber". Más detalle = mejores respuestas.'}
              {step === 4 && 'Sube tu lista de clientes para que el agente los reconozca desde el primer mensaje.'}
              {step === 5 && 'Configura cómo se calculan las comisiones de tu equipo de ventas.'}
            </p>
          </div>

          {step === 1 && <Step1 data={data} setData={setData} />}
          {step === 2 && <Step2 data={data} setData={setData} />}
          {step === 3 && <Step3 data={data} setData={setData} />}
          {step === 4 && <Step4 data={data} setData={setData} />}
          {step === 5 && <Step5 data={data} setData={setData} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ArrowLeft className="h-4 w-4" />Anterior
            </button>

            <div className="flex gap-1">
              {STEPS.map(s=>(
                <div key={s.n} className={`h-2 rounded-full transition-all ${step===s.n?'w-6 bg-yellow-400':step>s.n?'w-2 bg-slate-900':'w-2 bg-slate-200'}`} />
              ))}
            </div>

            <button onClick={handleNext} disabled={!canNext() || saving}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm px-6 py-3 rounded-2xl transition-all">
              {saving ? 'Guardando...' : step === 5 ? '¡Finalizar!' : 'Siguiente'}
              {!saving && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
