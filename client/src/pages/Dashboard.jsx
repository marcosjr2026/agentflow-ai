import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Users, CreditCard, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');

function StatCard({ icon: Icon, label, value, color = 'yellow', sub }) {
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-600',
    blue:   'bg-blue-50 text-blue-600',
    green:  'bg-green-50 text-green-600',
    red:    'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value ?? '—'}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const { data: convos } = useQuery({
    queryKey: ['conversations', 'open'],
    queryFn: () => axios.get(`${API}/conversations?status=open&limit=5`, {
      headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.data),
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => axios.get(`${API}/analytics/summary`, {
      headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.data).catch(() => ({})),
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Buenos días, {user.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Aquí está el resumen de tu agencia hoy.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={MessageSquare}
          label="Conversaciones abiertas"
          value={convos?.total ?? 0}
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Clientes activos"
          value={analytics?.totalClients ?? '—'}
          color="green"
        />
        <StatCard
          icon={CreditCard}
          label="Pagos en riesgo"
          value={analytics?.paymentsAtRisk ?? 0}
          color="red"
          sub="Vencen esta semana"
        />
        <StatCard
          icon={Phone}
          label="Score promedio equipo"
          value={analytics?.avgCallScore ? `${analytics.avgCallScore}/100` : '—'}
          color="purple"
          sub="Esta semana"
        />
      </div>

      {/* Conversaciones recientes */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Conversaciones recientes</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {convos?.conversations?.slice(0, 5).map(convo => (
            <a
              key={convo.id}
              href={`/conversations/${convo.id}`}
              className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                {(convo.contact?.name || convo.contact?.whatsappNumber || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">
                  {convo.contact?.name || convo.contact?.whatsappNumber}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{convo.context} · {convo.contact?.type}</p>
              </div>
              <div className="flex items-center gap-2">
                {convo.status === 'open' && (
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                )}
                <span className="text-xs text-slate-400">
                  {new Date(convo.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </a>
          ))}
          {(!convos?.conversations?.length) && (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <p className="text-sm">No hay conversaciones abiertas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
