import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');
const api = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const STATUS = {
  pending:  { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  paid:     { label: 'Pagado',     color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  failed:   { label: 'Fallido',    color: 'bg-red-100 text-red-700',      icon: AlertCircle },
  overdue:  { label: 'Vencido',    color: 'bg-red-200 text-red-800',      icon: AlertCircle },
};

function SummaryCard({ label, value, color = 'slate' }) {
  return (
    <div className={`bg-white rounded-xl p-5 border border-slate-100 shadow-sm`}>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default function Payments() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['payments', statusFilter],
    queryFn: () => axios.get(`${API}/payments?status=${statusFilter}`, api()).then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['payments-summary'],
    queryFn: () => axios.get(`${API}/payments/summary`, api()).then(r => r.data),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id) => axios.put(`${API}/payments/${id}/mark-paid`, {}, api()),
    onSuccess: () => { qc.invalidateQueries(['payments']); qc.invalidateQueries(['payments-summary']); },
  });

  const fmt = (n) => n ? `$${parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pagos & Comisiones</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Pagos pendientes" value={summary?.countPending ?? '—'} />
        <SummaryCard label="Total pendiente" value={fmt(summary?.totalPending)} />
        <SummaryCard label="Cobrado este mes" value={fmt(summary?.totalPaidThisMonth)} />
        <SummaryCard label="Comisiones por pagar" value={fmt(summary?.commissionsPending)} />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'paid', 'failed', 'overdue'].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {s === 'all' ? 'Todos' : STATUS[s]?.label || s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>{['Cliente', 'Agente', 'Monto', 'Vencimiento', 'Estado', 'Comisión', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-400">Cargando...</td></tr>
            ) : data?.payments?.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                No hay pagos registrados
              </td></tr>
            ) : data?.payments?.map(p => {
              const s = STATUS[p.status] || STATUS.pending;
              const Icon = s.icon;
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.contact?.name || p.contact?.whatsappNumber || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{p.agent?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-700">{fmt(p.amount)}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {p.dueDate ? new Date(p.dueDate).toLocaleDateString('es-ES') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>
                      <Icon className="w-3 h-3" />{s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{p.commissionAmount ? fmt(p.commissionAmount) : '—'}</td>
                  <td className="px-4 py-3">
                    {p.status === 'pending' || p.status === 'failed' ? (
                      <button onClick={() => markPaidMutation.mutate(p.id)}
                        disabled={markPaidMutation.isPending}
                        className="text-xs text-green-600 hover:text-green-700 font-medium underline disabled:opacity-50">
                        Marcar pagado
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
