import { useState, useRef } from 'react';
import axios from 'axios';
import { Settings, Users, BookOpen, DollarSign, Upload, Plus, Trash2, Save, CheckCircle2, Clock, Phone, Sparkles } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '/api';
const tok = () => localStorage.getItem('token');

const TABS = [
  { id: 'soul',        label: 'Identidad',      icon: Sparkles },
  { id: 'agent',       label: 'Comportamiento', icon: Settings },
  { id: 'team',        label: 'Equipo',         icon: Users },
  { id: 'knowledge',   label: 'Conocimiento',   icon: BookOpen },
  { id: 'commissions', label: 'Comisiones',     icon: DollarSign },
  { id: 'import',      label: 'Importar clientes', icon: Upload },
];

function SaveBtn({ saving, saved, onClick }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
      {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
      {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
    </button>
  );
}

function SoulTab() {
  const [form, setForm] = useState({
    agentName: '',
    agentGender: 'female',
    agentTone: 'warm',
    openingPhrase: '',
    closingPhrase: '',
    values: [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const tones = [
    ['warm',         '🤗 Cálido'],
    ['professional', '💼 Profesional'],
    ['formal',       '🎩 Formal'],
    ['friendly',     '😊 Amigable'],
  ];

  const valueOptions = [
    'Paciente', 'Empático', 'Nunca presiona', 'Siempre saluda por nombre',
    'Conciso', 'Proactivo', 'Respetuoso', 'Siempre ofrece ayuda adicional',
  ];

  const toggleValue = (v) => setForm(f => ({
    ...f,
    values: f.values.includes(v) ? f.values.filter(x => x !== v) : [...f.values, v]
  }));

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, { agentSoul: form }, { headers: { Authorization: `Bearer ${tok()}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const preview = form.agentName
    ? `Hola${form.agentTone === 'formal' ? '.' : ' 👋'} ${form.openingPhrase || `Soy ${form.agentName}, el asistente de tu agencia`}. ¿En qué puedo ayudarte hoy?`
    : 'Completa el nombre del agente para ver la vista previa.';

  return (
    <div className="space-y-8">
      {/* Preview */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Vista previa — primer mensaje</p>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 text-sm font-bold text-slate-950">
            {form.agentName ? form.agentName[0].toUpperCase() : '?'}
          </div>
          <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-100 leading-relaxed max-w-sm">
            {preview}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del agente</label>
          <input value={form.agentName} onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
            placeholder="Sofia, Carlos, Ana..." />
          <p className="text-xs text-slate-400 mt-1">El nombre que usarán tus clientes para conocerlo.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Género</label>
          <div className="flex gap-3">
            {[['female', '👩 Femenino'], ['male', '👨 Masculino'], ['neutral', '🧑 Neutro']].map(([v, l]) => (
              <button key={v} onClick={() => setForm(f => ({ ...f, agentGender: v }))}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${form.agentGender === v ? 'bg-yellow-400 border-yellow-400 text-slate-950' : 'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Tono de comunicación</label>
        <div className="grid grid-cols-4 gap-3">
          {tones.map(([v, l]) => (
            <button key={v} onClick={() => setForm(f => ({ ...f, agentTone: v }))}
              className={`py-3 rounded-xl border text-sm font-medium transition-all ${form.agentTone === v ? 'bg-yellow-400 border-yellow-400 text-slate-950' : 'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Frase de apertura personalizada</label>
        <input value={form.openingPhrase} onChange={e => setForm(f => ({ ...f, openingPhrase: e.target.value }))}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
          placeholder={`Soy ${form.agentName || 'Sofia'}, el asistente de [Agencia]`} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Frase de despedida</label>
        <input value={form.closingPhrase} onChange={e => setForm(f => ({ ...f, closingPhrase: e.target.value }))}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm"
          placeholder="Que tengas un excelente día. Estoy aquí si me necesitas 😊" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Valores del agente</label>
        <div className="flex flex-wrap gap-2">
          {valueOptions.map(v => (
            <button key={v} onClick={() => toggleValue(v)}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${form.values.includes(v) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}>
              {v}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Estos valores guían cómo el agente responde en situaciones difíciles.</p>
      </div>

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
    </div>
  );
}

function AgentTab() {
  const [form, setForm] = useState({ hoursStart: '08:00', hoursEnd: '17:00', afterHoursMsg: '', welcomeMsg: '', agentPersonality: 'professional', paymentReminderDays: 3 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, form, { headers: { Authorization: `Bearer ${tok()}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const personalities = [
    ['professional', 'Profesional'],
    ['friendly', 'Amigable'],
    ['formal', 'Formal'],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Horarios de atención</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Hora de inicio</label>
            <input type="time" value={form.hoursStart} onChange={e => setForm(f => ({ ...f, hoursStart: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1.5">Hora de cierre</label>
            <input type="time" value={form.hoursEnd} onChange={e => setForm(f => ({ ...f, hoursEnd: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensaje fuera de horario</label>
        <textarea value={form.afterHoursMsg} onChange={e => setForm(f => ({ ...f, afterHoursMsg: e.target.value }))} rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm resize-none"
          placeholder="Hola, en este momento estamos fuera de horario. Te contactaremos mañana a las 8am." />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensaje de bienvenida</label>
        <textarea value={form.welcomeMsg} onChange={e => setForm(f => ({ ...f, welcomeMsg: e.target.value }))} rows={3}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm resize-none"
          placeholder="¡Hola! 👋 Soy el asistente virtual de [Agencia]. ¿En qué puedo ayudarte hoy?" />
        <p className="text-xs text-slate-400 mt-1">Usa [Agencia] para incluir el nombre de tu agencia automáticamente.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Personalidad del agente</label>
        <div className="flex gap-3">
          {personalities.map(([v, l]) => (
            <button key={v} onClick={() => setForm(f => ({ ...f, agentPersonality: v }))}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${form.agentPersonality === v ? 'bg-yellow-400 border-yellow-400 text-slate-950' : 'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Recordar pagos con anticipación</label>
        <div className="flex gap-3">
          {[1, 2, 3, 5, 7].map(d => (
            <button key={d} onClick={() => setForm(f => ({ ...f, paymentReminderDays: d }))}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${form.paymentReminderDays === d ? 'bg-yellow-400 border-yellow-400 text-slate-950' : 'border-slate-200 text-slate-600 hover:border-yellow-300'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
    </div>
  );
}

function TeamTab() {
  const [members, setMembers] = useState([{ name: '', email: '', phone: '', role: 'agent' }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const add = () => setMembers(m => [...m, { name: '', email: '', phone: '', role: 'agent' }]);
  const remove = (i) => setMembers(m => m.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setMembers(m => m.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, { teamMembers: members }, { headers: { Authorization: `Bearer ${tok()}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  const roles = [['agent', 'Agente'], ['manager', 'Manager'], ['service_rep', 'Servicio al Cliente']];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-500">Los nuevos miembros recibirán contraseña temporal: <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">OpenAG2026!</code></p>
        <button onClick={add} className="flex items-center gap-2 text-sm font-medium text-yellow-600 hover:text-yellow-700">
          <Plus className="h-4 w-4" /> Agregar miembro
        </button>
      </div>

      {members.map((m, i) => (
        <div key={i} className="grid grid-cols-12 gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="col-span-3">
            <label className="block text-xs text-slate-500 mb-1">Nombre</label>
            <input value={m.name} onChange={e => update(i, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              placeholder="María García" />
          </div>
          <div className="col-span-3">
            <label className="block text-xs text-slate-500 mb-1">Email</label>
            <input type="email" value={m.email} onChange={e => update(i, 'email', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              placeholder="maria@agencia.com" />
          </div>
          <div className="col-span-3">
            <label className="block text-xs text-slate-500 mb-1">WhatsApp</label>
            <input value={m.phone} onChange={e => update(i, 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
              placeholder="+1 305..." />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Rol</label>
            <select value={m.role} onChange={e => update(i, 'role', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
              {roles.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="col-span-1 flex items-end pb-0.5">
            <button onClick={() => remove(i)} disabled={members.length === 1}
              className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors rounded-lg hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
    </div>
  );
}

function KnowledgeTab() {
  const [form, setForm] = useState({ agentSpeech: '', objections: '', faqs: [{ q: '', a: '' }] });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const addFaq = () => setForm(f => ({ ...f, faqs: [...f.faqs, { q: '', a: '' }] }));
  const removeFaq = (i) => setForm(f => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, field, val) => setForm(f => ({ ...f, faqs: f.faqs.map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, { agentSpeech: form.agentSpeech, objections: form.objections, faqs: form.faqs }, { headers: { Authorization: `Bearer ${tok()}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Speech del agente de ventas</label>
        <textarea value={form.agentSpeech} onChange={e => setForm(f => ({ ...f, agentSpeech: e.target.value }))} rows={5}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm resize-none"
          placeholder="Hola [nombre], le llamo de parte de [Agencia]. ¿Tiene un momento? Quería hablarle sobre los beneficios de su plan..." />
        <p className="text-xs text-slate-400 mt-1">El agente usará este guión como base para las conversaciones de ventas.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Manejo de objeciones frecuentes</label>
        <textarea value={form.objections} onChange={e => setForm(f => ({ ...f, objections: e.target.value }))} rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm resize-none"
          placeholder="Objeción: 'Es muy caro' → Respuesta: 'Entiendo. Este plan en realidad le ahorra $X al mes porque incluye...'&#10;Objeción: 'Ya tengo seguro' → Respuesta: '¿Le gustaría comparar beneficios?...'" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-slate-700">Preguntas frecuentes (FAQs)</label>
          <button onClick={addFaq} className="flex items-center gap-1.5 text-xs font-medium text-yellow-600 hover:text-yellow-700">
            <Plus className="h-3.5 w-3.5" /> Agregar FAQ
          </button>
        </div>
        <div className="space-y-3">
          {form.faqs.map((faq, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-start gap-2">
                <input value={faq.q} onChange={e => updateFaq(i, 'q', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                  placeholder="¿Cuándo se cobra mi plan?" />
                <button onClick={() => removeFaq(i)} disabled={form.faqs.length === 1}
                  className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors rounded-lg hover:bg-red-50 mt-0.5">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea value={faq.a} onChange={e => updateFaq(i, 'a', e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white resize-none"
                placeholder="Su plan se cobra el día X de cada mes. Si tiene dudas..." />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
    </div>
  );
}

function CommissionsTab() {
  const [rules, setRules] = useState([{ minSales: 0, maxSales: null, amount: '', type: 'per_sale', notes: '' }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const add = () => setRules(r => [...r, { minSales: 0, maxSales: null, amount: '', type: 'per_sale', notes: '' }]);
  const remove = (i) => setRules(r => r.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setRules(r => r.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/onboarding`, { commissionRules: rules }, { headers: { Authorization: `Bearer ${tok()}` } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200">
        <p className="text-sm text-yellow-800 font-medium mb-1">💡 Tip: También puedes configurar comisiones hablándole a tu OAG</p>
        <p className="text-xs text-yellow-700">Di en WhatsApp: "OAG, cambia las comisiones — si venden más de 10 este mes ganan $200 por venta"</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Define las reglas de comisión por nivel de ventas</p>
        <button onClick={add} className="flex items-center gap-1.5 text-sm font-medium text-yellow-600 hover:text-yellow-700">
          <Plus className="h-4 w-4" /> Agregar regla
        </button>
      </div>

      {rules.map((r, i) => (
        <div key={i} className="grid grid-cols-12 gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Ventas mín.</label>
            <input type="number" value={r.minSales} onChange={e => update(i, 'minSales', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" placeholder="0" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Ventas máx.</label>
            <input type="number" value={r.maxSales || ''} onChange={e => update(i, 'maxSales', e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" placeholder="Sin límite" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Monto $</label>
            <input value={r.amount} onChange={e => update(i, 'amount', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" placeholder="150" />
          </div>
          <div className="col-span-3">
            <label className="block text-xs text-slate-500 mb-1">Tipo</label>
            <select value={r.type} onChange={e => update(i, 'type', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white">
              <option value="per_sale">Por venta</option>
              <option value="bonus">Bono mensual</option>
              <option value="percentage">Porcentaje</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Nota</label>
            <input value={r.notes} onChange={e => update(i, 'notes', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white" placeholder="Ej: básico" />
          </div>
          <div className="col-span-1 flex items-end pb-0.5">
            <button onClick={() => remove(i)} disabled={rules.length === 1}
              className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors rounded-lg hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
    </div>
  );
}

function ImportTab() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    // Parse CSV preview (first 5 rows)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').slice(0, 6);
      setPreview(lines.map(l => l.split(',')));
    };
    reader.readAsText(f);
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${API}/contacts/import`, formData, {
        headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'multipart/form-data' }
      }).catch(() => {});
      setDone(true);
      setFile(null);
      setPreview([]);
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800 font-medium mb-1">Formato requerido del CSV</p>
        <p className="text-xs text-blue-700">Columnas: <code className="bg-blue-100 px-1 rounded">nombre, telefono, plan, fecha_efectiva, agente_asignado, monto_pago</code></p>
        <p className="text-xs text-blue-600 mt-1">El teléfono debe incluir código de país: +1 305...</p>
      </div>

      {done && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 font-medium">Clientes importados correctamente</p>
        </div>
      )}

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/50 transition-all">
        <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700">{file ? file.name : 'Haz clic o arrastra tu archivo CSV aquí'}</p>
        <p className="text-xs text-slate-400 mt-1">.csv o .xlsx — máx 10MB</p>
        <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFile} />
      </div>

      {preview.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>{preview[0]?.map((h, i) => <th key={i} className="px-3 py-2 text-left font-medium text-slate-600">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {preview.slice(1).map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} className="px-3 py-2 text-slate-600">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 px-3 py-2 border-t border-slate-100">Vista previa — primeras 5 filas</p>
        </div>
      )}

      {file && (
        <div className="flex justify-end">
          <button onClick={upload} disabled={uploading}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all">
            <Upload className="h-4 w-4" />
            {uploading ? 'Importando...' : 'Importar clientes'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('agent');
  const agency = JSON.parse(localStorage.getItem('agency') || '{}');

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
          <p className="text-slate-500 mt-1">{agency.name || 'Mi Agencia'} — personaliza tu agente y operación</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 mb-6 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {activeTab === 'soul'        && <SoulTab />}
          {activeTab === 'agent'       && <AgentTab />}
          {activeTab === 'team'        && <TeamTab />}
          {activeTab === 'knowledge'   && <KnowledgeTab />}
          {activeTab === 'commissions' && <CommissionsTab />}
          {activeTab === 'import'      && <ImportTab />}
        </div>
      </div>
    </div>
  );
}
