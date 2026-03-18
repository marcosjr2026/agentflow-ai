import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bot, Building2, MessageSquare, BookOpen, Users, DollarSign, CheckCircle2, ArrowRight, ArrowLeft, Upload, Plus, Trash2, Globe } from 'lucide-react';
import { t, defaultLang, setLang } from '../lib/i18n';

const API = import.meta.env.VITE_API_URL || '/api';
const tok = () => localStorage.getItem('token');
const ICONS = [Building2, MessageSquare, BookOpen, Users, DollarSign];

function Step1({ data, setData, T }) {
  const types = ['Medicare Advantage','Medicare Supplement','Medicaid','Vida','Auto','Hogar','Dental','Visión'];
  const toggle = (v) => setData(d => ({ ...d, insuranceTypes: (d.insuranceTypes||[]).includes(v) ? (d.insuranceTypes||[]).filter(x=>x!==v) : [...(d.insuranceTypes||[]),v] }));
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_agency_name}</label>
        <input value={data.agencyDisplayName||''} onChange={e=>setData(d=>({...d,agencyDisplayName:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" placeholder="Seguros Miami Pro" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_phone}</label>
        <input value={data.contactPhone||''} onChange={e=>setData(d=>({...d,contactPhone:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" placeholder="+1 (305) 000-0000" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_website}</label>
        <input value={data.website||''} onChange={e=>setData(d=>({...d,website:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" placeholder="www.miagencia.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">{T.ob_lang}</label>
        <div className="flex gap-3">
          {[['es',T.ob_lang_es],['en',T.ob_lang_en],['both',T.ob_lang_both]].map(([v,l])=>(
            <button key={v} onClick={()=>setData(d=>({...d,primaryLang:v}))} className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.primaryLang===v?'bg-yellow-400 border-yellow-400 text-slate-950':'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">{T.ob_insurance}</label>
        <div className="flex flex-wrap gap-2">
          {types.map(ty=>(
            <button key={ty} onClick={()=>toggle(ty)} className={`px-4 py-2 rounded-full text-sm border transition-all ${(data.insuranceTypes||[]).includes(ty)?'bg-slate-900 border-slate-900 text-white':'border-slate-200 text-slate-600 hover:border-slate-400'}`}>{ty}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ data, setData, T }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_hours_start}</label>
          <input type="time" value={data.hoursStart||'08:00'} onChange={e=>setData(d=>({...d,hoursStart:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_hours_end}</label>
          <input type="time" value={data.hoursEnd||'17:00'} onChange={e=>setData(d=>({...d,hoursEnd:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_after_hours}</label>
        <textarea value={data.afterHoursMsg||''} onChange={e=>setData(d=>({...d,afterHoursMsg:e.target.value}))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none" placeholder={T.ob_after_hours_ph} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_payment_days}</label>
        <div className="flex gap-3">
          {[1,2,3,5,7].map(d=>(
            <button key={d} onClick={()=>setData(dt=>({...dt,paymentReminderDays:d}))} className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.paymentReminderDays===d?'bg-yellow-400 border-yellow-400 text-slate-950':'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>{d}d</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_welcome}</label>
        <textarea value={data.welcomeMsg||''} onChange={e=>setData(d=>({...d,welcomeMsg:e.target.value}))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none" placeholder={T.ob_welcome_ph} />
        <p className="text-xs text-slate-400 mt-1">{T.ob_welcome_hint}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_escalation}</label>
        <input value={data.escalationPhone||''} onChange={e=>setData(d=>({...d,escalationPhone:e.target.value}))} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" placeholder="+1 (305) 000-0000" />
      </div>
    </div>
  );
}

function Step3({ data, setData, T }) {
  const addFaq = () => setData(d=>({...d,faqs:[...(d.faqs||[]),{q:'',a:''}]}));
  const upd = (i,f,v) => setData(d=>({...d,faqs:d.faqs.map((x,j)=>j===i?{...x,[f]:v}:x)}));
  const del = (i) => setData(d=>({...d,faqs:d.faqs.filter((_,j)=>j!==i)}));
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_speech}</label>
        <textarea value={data.salesSpeech||''} onChange={e=>setData(d=>({...d,salesSpeech:e.target.value}))} rows={5} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none" placeholder={T.ob_speech_ph} />
        <p className="text-xs text-slate-400 mt-1">{T.ob_speech_hint}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_objections}</label>
        <textarea value={data.objections||''} onChange={e=>setData(d=>({...d,objections:e.target.value}))} rows={4} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none" placeholder={T.ob_objections_ph} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">{T.ob_faq}</label>
          <button onClick={addFaq} className="flex items-center gap-1 text-xs text-yellow-600 font-medium hover:text-yellow-700"><Plus className="h-4 w-4"/>{T.ob_faq_add}</button>
        </div>
        <div className="space-y-3">
          {(data.faqs||[]).map((faq,i)=>(
            <div key={i} className="rounded-2xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <input value={faq.q} onChange={e=>upd(i,'q',e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" placeholder={T.ob_faq_q} />
                <button onClick={()=>del(i)} className="text-slate-300 hover:text-rose-400 mt-1"><Trash2 className="h-4 w-4"/></button>
              </div>
              <textarea value={faq.a} onChange={e=>upd(i,'a',e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" placeholder={T.ob_faq_a} />
            </div>
          ))}
          {!(data.faqs||[]).length && (
            <button onClick={addFaq} className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-yellow-300 hover:text-yellow-500 transition-colors">{T.ob_faq_first}</button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step4({ data, setData, T }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const handle = async (file) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h=>h.trim().replace(/"/g,''));
    const rows = lines.slice(1,6).map(l=>l.split(',').map(v=>v.trim().replace(/"/g,'')));
    setPreview({ headers, rows, total: lines.length-1 });
    setData(d=>({...d,csvFile:file,csvName:file.name,csvTotal:lines.length-1}));
  };
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">{T.ob_csv_sub}</p>
      <p className="text-xs text-slate-400">{T.ob_csv_cols} <span className="font-mono bg-slate-100 px-1 rounded">nombre, telefono, plan, fecha_efectiva, agente, estado_pago</span></p>
      {!preview ? (
        <div onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f?.name.endsWith('.csv'))handle(f);}} onDragOver={e=>e.preventDefault()} onClick={()=>fileRef.current?.click()} className="cursor-pointer border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-yellow-400 hover:bg-yellow-50 transition-all">
          <Upload className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="font-medium text-slate-700">{T.ob_csv_drop}</p>
          <p className="text-sm text-slate-400 mt-2">{T.ob_csv_type}</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e=>handle(e.target.files[0])} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="font-medium text-emerald-800 text-sm">{data.csvName}</p>
                <p className="text-xs text-emerald-600">{preview.total} {T.ob_csv_detected}</p>
              </div>
            </div>
            <button onClick={()=>{setPreview(null);setData(d=>({...d,csvFile:null,csvName:null,csvTotal:0}));}} className="text-xs text-slate-400 hover:text-slate-600">{T.ob_csv_change}</button>
          </div>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{T.ob_csv_preview}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-slate-100">{preview.headers.map(h=><th key={h} className="px-4 py-2 text-left text-slate-500 font-medium">{h}</th>)}</tr></thead>
                <tbody>{preview.rows.map((row,i)=><tr key={i} className="border-b border-slate-50">{row.map((c,j)=><td key={j} className="px-4 py-2 text-slate-700">{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4">
        <p className="text-sm text-blue-700 font-medium mb-1">{T.ob_csv_skip}</p>
        <p className="text-xs text-blue-600">{T.ob_csv_skip_sub}</p>
      </div>
    </div>
  );
}

function Step5({ data, setData, T }) {
  const add = () => setData(d=>({...d,commissionTiers:[...(d.commissionTiers||[]),{minSales:0,maxSales:0,amount:0}]}));
  const upd = (i,f,v) => setData(d=>({...d,commissionTiers:d.commissionTiers.map((x,j)=>j===i?{...x,[f]:Number(v)}:x)}));
  const del = (i) => setData(d=>({...d,commissionTiers:d.commissionTiers.filter((_,j)=>j!==i)}));
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_period}</label>
        <div className="flex gap-3">
          {[['monthly',T.ob_monthly],['biweekly',T.ob_biweekly]].map(([v,l])=>(
            <button key={v} onClick={()=>setData(d=>({...d,commissionPeriod:v}))} className={`flex-1 py-3 rounded-2xl border text-sm font-medium transition-all ${data.commissionPeriod===v?'bg-yellow-400 border-yellow-400 text-slate-950':'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">{T.ob_tiers}</label>
          <button onClick={add} className="flex items-center gap-1 text-xs text-yellow-600 font-medium hover:text-yellow-700"><Plus className="h-4 w-4"/>{T.ob_tier_add}</button>
        </div>
        <div className="space-y-3">
          {(data.commissionTiers||[]).map((tier,i)=>(
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
              <div><label className="text-xs text-slate-500 mb-1 block">{T.ob_tier_min}</label><input type="number" value={tier.minSales} onChange={e=>upd(i,'minSales',e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">{T.ob_tier_max}</label><input type="number" value={tier.maxSales} onChange={e=>upd(i,'maxSales',e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <div><label className="text-xs text-slate-500 mb-1 block">{T.ob_tier_amt}</label><input type="number" value={tier.amount} onChange={e=>upd(i,'amount',e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <button onClick={()=>del(i)} className="mt-5 text-slate-300 hover:text-rose-400"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}
          {!(data.commissionTiers||[]).length && (
            <button onClick={add} className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-yellow-300 hover:text-yellow-500 transition-colors">{T.ob_tier_first}</button>
          )}
        </div>
        {(data.commissionTiers||[]).length > 0 && (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">{T.ob_tier_preview}</p>
            {data.commissionTiers.map((t,i)=><p key={i} className="text-xs text-slate-600">{t.minSales}-{t.maxSales} → <span className="font-semibold text-slate-800">${t.amount}/sale</span></p>)}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{T.ob_notes}</label>
        <textarea value={data.commissionNotes||''} onChange={e=>setData(d=>({...d,commissionNotes:e.target.value}))} rows={3} className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm resize-none" placeholder={T.ob_notes_ph} />
      </div>
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [lang, setLangState] = useState(defaultLang());
  const T = t[lang];
  const toggleLang = () => { const n = lang==='es'?'en':'es'; setLang(n); setLangState(n); };
  const [data, setData] = useState({ primaryLang:'both', insuranceTypes:[], paymentReminderDays:3, commissionPeriod:'monthly', commissionTiers:[], faqs:[] });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const stepLabels = [T.ob_step1,T.ob_step2,T.ob_step3,T.ob_step4,T.ob_step5];

  const canNext = () => step===1 ? data.agencyDisplayName?.trim() : true;

  const handleFinish = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, data, { headers:{Authorization:`Bearer ${tok()}`} }).catch(()=>{});
      setDone(true);
      setTimeout(()=>navigate('/app/dashboard'), 2500);
    } finally { setSaving(false); }
  };

  if (done) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-yellow-400 mb-6"><CheckCircle2 className="h-12 w-12 text-slate-950"/></div>
        <h1 className="text-3xl font-bold text-white">{T.ob_done_h}</h1>
        <p className="mt-3 text-slate-400">{T.ob_done_sub}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-950 px-6 py-5">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-yellow-400 rounded-xl flex items-center justify-center"><Bot className="h-5 w-5 text-slate-950"/></div>
            <span className="text-white font-bold">Open AG</span>
            <span className="text-slate-500 text-sm">— {T.ob_title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleLang} className="flex items-center gap-1 text-xs text-slate-400 border border-white/10 rounded-lg px-3 py-1.5 hover:text-white transition-colors"><Globe className="h-3.5 w-3.5"/>{lang==='es'?'EN':'ES'}</button>
            <span className="text-slate-400 text-sm">{step} / 5</span>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center gap-2">
            {stepLabels.map((label,i)=>(
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 transition-all ${step===i+1?'bg-yellow-400 text-slate-950':step>i+1?'bg-slate-900 text-white':'bg-slate-100 text-slate-400'}`}>
                    {step>i+1?<CheckCircle2 className="h-4 w-4"/>:i+1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step===i+1?'text-slate-900':'text-slate-400'}`}>{label}</span>
                </div>
                {i<4&&<div className={`flex-1 h-px ${step>i+1?'bg-slate-900':'bg-slate-200'}`}/>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{[T.ob_s1_h,T.ob_s2_h,T.ob_s3_h,T.ob_s4_h,T.ob_s5_h][step-1]}</h2>
            <p className="mt-2 text-slate-500">{[T.ob_s1_sub,T.ob_s2_sub,T.ob_s3_sub,T.ob_s4_sub,T.ob_s5_sub][step-1]}</p>
          </div>
          {step===1&&<Step1 data={data} setData={setData} T={T}/>}
          {step===2&&<Step2 data={data} setData={setData} T={T}/>}
          {step===3&&<Step3 data={data} setData={setData} T={T}/>}
          {step===4&&<Step4 data={data} setData={setData} T={T}/>}
          {step===5&&<Step5 data={data} setData={setData} T={T}/>}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
            <button onClick={()=>setStep(s=>s-1)} disabled={step===1} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ArrowLeft className="h-4 w-4"/>{T.ob_prev}
            </button>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n=><div key={n} className={`h-2 rounded-full transition-all ${step===n?'w-6 bg-yellow-400':step>n?'w-2 bg-slate-900':'w-2 bg-slate-200'}`}/>)}
            </div>
            <button onClick={step<5?()=>setStep(s=>s+1):handleFinish} disabled={!canNext()||saving} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm px-6 py-3 rounded-2xl transition-all">
              {saving?T.ob_saving:step===5?T.ob_finish:T.ob_next}<ArrowRight className="h-4 w-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
