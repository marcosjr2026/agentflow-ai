import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Building2, Users, Activity, LogOut, RefreshCw, CheckCircle2, XCircle, Clock } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const tok = () => localStorage.getItem('token');

export default function SuperAdmin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [agencies, setAgencies] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, onboarded: 0 });
  const [loading, setLoading] = useState(true);

  // Solo super_admin puede acceder
  useEffect(() => {
    if (user.role !== 'super_admin') {
      navigate('/app/dashboard');
      return;
    }
    fetchAgencies();
  }, []);

  async function fetchAgencies() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/agencies`, {
        headers: { Authorization: `Bearer ${tok()}` }
      });
      setAgencies(data.agencies || []);
      setStats(data.stats || { total: 0, active: 0, onboarded: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  const planColor = (plan) => ({
    starter: 'bg-slate-100 text-slate-600',
    growth: 'bg-blue-50 text-blue-600',
    pro: 'bg-yellow-50 text-yellow-700',
  }[plan] || 'bg-slate-100 text-slate-600');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-yellow-400 rounded-xl flex items-center justify-center">
            <Bot className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">Open AG</span>
            <span className="ml-2 text-xs bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full font-medium">Super Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAgencies} className="flex items-center gap-2 text-xs text-slate-400 border border-white/10 rounded-lg px-3 py-2 hover:text-white transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Agencias totales', value: stats.total, icon: Building2, color: 'text-white' },
            { label: 'Activas', value: stats.active, icon: Activity, color: 'text-emerald-400' },
            { label: 'Onboarding completo', value: stats.onboarded, icon: CheckCircle2, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400">{s.label}</p>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className={`text-4xl font-bold ${s.color}`}>{loading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        {/* Agencies table */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white font-semibold">Todas las agencias</h2>
            <span className="text-xs text-slate-400">{agencies.length} registradas</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Cargando...</div>
          ) : agencies.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="h-12 w-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No hay agencias registradas todavía</p>
              <p className="text-slate-600 text-sm mt-1">Cuando alguien se registre aparecerá aquí</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {agencies.map(ag => (
                <div key={ag.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{ag.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{ag.adminEmail || '—'}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${planColor(ag.plan)}`}>
                      {ag.plan || 'starter'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {ag.onboardingCompleted
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        : <Clock className="h-4 w-4 text-yellow-400" />}
                      <span className="text-xs text-slate-400">
                        {ag.onboardingCompleted ? 'Configurado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${ag.status === 'active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {ag.status === 'active'
                        ? <Activity className="h-4 w-4" />
                        : <XCircle className="h-4 w-4" />}
                      <span className="text-xs">{ag.status === 'active' ? 'Activa' : 'Inactiva'}</span>
                    </div>
                    <p className="text-xs text-slate-600 w-24 text-right">
                      {ag.createdAt ? new Date(ag.createdAt).toLocaleDateString('es-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
