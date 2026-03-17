import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Star, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const token = () => localStorage.getItem('token');
const api = () => ({ headers: { Authorization: `Bearer ${token()}` } });

function ScoreBar({ score }) {
  const color = score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-700 w-12 text-right">{score || 0}/100</span>
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState('week');

  const { data: team, isLoading } = useQuery({
    queryKey: ['team-performance', period],
    queryFn: () => axios.get(`${API}/analytics/team-performance?period=${period}`, api()).then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => axios.get(`${API}/analytics/summary`, api()).then(r => r.data),
  });

  const best = team?.bestPerformer;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reportes & Analytics</h1>
        <div className="flex gap-2">
          {['week', 'month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {p === 'week' ? 'Esta semana' : 'Este mes'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Clientes activos', value: summary?.totalClients ?? '—', icon: Users },
          { label: 'Leads activos', value: summary?.totalLeads ?? '—', icon: TrendingUp },
          { label: 'Score promedio equipo', value: team?.teamAvgScore ? `${team.teamAvgScore}/100` : '—', icon: BarChart3 },
          { label: 'Llamadas esta semana', value: summary?.totalCallsThisWeek ?? '—', icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <Icon className="w-5 h-5 text-yellow-500 mb-3" />
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team performance table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Performance del Equipo</h2>
            <p className="text-xs text-slate-400 mt-0.5">{period === 'week' ? 'Últimos 7 días' : 'Últimos 30 días'}</p>
          </div>
          <div className="p-5">
            {isLoading ? (
              <p className="text-slate-400 text-sm text-center py-4">Cargando...</p>
            ) : !team?.agents?.length ? (
              <p className="text-slate-400 text-sm text-center py-4">No hay datos de llamadas aún</p>
            ) : (
              <div className="space-y-4">
                {team.agents.map((agent, i) => (
                  <div key={agent.id} className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-yellow-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-700">{agent.name}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{agent.callsAnalyzed} llamadas</span>
                          <span>{agent.closeRate}% cierre</span>
                        </div>
                      </div>
                      <ScoreBar score={agent.avgScore} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Best performer */}
        <div className="space-y-4">
          {best ? (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Mejor agente</span>
              </div>
              <p className="text-xl font-bold mb-1">{best.name}</p>
              <p className="text-3xl font-black text-yellow-400">{best.avgScore}/100</p>
              <p className="text-xs text-slate-400 mt-2">{best.callsAnalyzed} llamadas · {best.closeRate}% cierre</p>
            </div>
          ) : null}

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Resumen rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Agentes activos</span>
                <span className="font-medium text-slate-800">{team?.agents?.length ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Score promedio</span>
                <span className="font-medium text-slate-800">{team?.teamAvgScore ?? 0}/100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Clientes activos</span>
                <span className="font-medium text-slate-800">{summary?.totalClients ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Leads en proceso</span>
                <span className="font-medium text-slate-800">{summary?.totalLeads ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
