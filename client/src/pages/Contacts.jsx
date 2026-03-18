import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Search, X, Phone } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');
const api = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const TYPE_LABELS = { lead: 'Lead', client: 'Cliente', agent: 'Agente' };
const TYPE_COLORS = { lead: 'bg-blue-100 text-blue-700', client: 'bg-green-100 text-green-700', agent: 'bg-purple-100 text-purple-700' };

function ContactModal({ contact, onClose, onSave }) {
  const [form, setForm] = useState(contact || { name: '', whatsappNumber: '', type: 'lead', planType: '', insuranceCompany: '', paymentAmount: '', paymentDay: '', preferredLang: 'es' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{contact ? 'Editar contacto' : 'Nuevo contacto'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[['name', 'Nombre completo', 'text', '2'], ['whatsappNumber', 'WhatsApp (ej: +17861234567)', 'text', '2'], ['planType', 'Plan de seguro', 'text', '1'], ['insuranceCompany', 'Aseguradora', 'text', '1'], ['paymentAmount', 'Pago mensual ($)', 'number', '1'], ['paymentDay', 'Día de cobro (1-31)', 'number', '1']].map(([key, label, type, cols]) => (
            <div key={key} className={`col-span-${cols}`}>
              <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
              <input type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="lead">Lead</option>
              <option value="client">Cliente activo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Idioma preferido</label>
            <select value={form.preferredLang} onChange={e => set('preferredLang', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-2.5 rounded-xl text-sm font-semibold">Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default function Contacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'new' | contact object

  const { data, isLoading } = useQuery({
    queryKey: ['contacts', typeFilter, search],
    queryFn: () => axios.get(`${API}/contacts?type=${typeFilter !== 'all' ? typeFilter : ''}&search=${search}`, api()).then(r => r.data),
  });

  const saveMutation = useMutation({
    mutationFn: (form) => modal?.id
      ? axios.put(`${API}/contacts/${modal.id}`, form, api())
      : axios.post(`${API}/contacts`, form, api()),
    onSuccess: () => { qc.invalidateQueries(['contacts']); setModal(null); },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contactos & Leads</h1>
        <button onClick={() => setModal('new')}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm">
          <Plus className="w-4 h-4" /> Nuevo contacto
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o teléfono..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>
        {['all', 'lead', 'client'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${typeFilter === t ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t === 'all' ? 'Todos' : t === 'lead' ? 'Leads' : 'Clientes'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>{['Nombre', 'WhatsApp', 'Tipo', 'Plan', 'Agente', 'Pago/mes', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400">Cargando...</td></tr>
            ) : data?.contacts?.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                No hay contactos
              </td></tr>
            ) : data?.contacts?.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{c.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{c.whatsappNumber}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[c.type]}`}>{TYPE_LABELS[c.type]}</span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">{c.planType || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{c.agent?.name || '—'}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{c.paymentAmount ? `$${c.paymentAmount}` : '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setModal(c)} className="text-xs text-slate-400 hover:text-slate-700 underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <ContactModal
          contact={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={(form) => saveMutation.mutate(form)}
        />
      )}
    </div>
  );
}
