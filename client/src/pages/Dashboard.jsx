import { useQuery } from '@tanstack/react-query';
import {
  MessageSquare, Users, CreditCard, Phone,
  CheckCircle2, ArrowUpRight, Sparkles, ShieldCheck, Clock3
} from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');

function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value ?? '—'}</p>
          {sub && <p className="mt-2 text-sm text-slate-400">{sub}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const agency = JSON.parse(localStorage.getItem('agency') || '{}');

  const { data: convos } = useQuery({
    queryKey: ['conversations', 'open'],
    queryFn: () => axios.get(`${API}/conversations?status=open&limit=5`, {
      headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.data).catch(() => ({ total: 0, conversations: [] })),
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => axios.get(`${API}/analytics/summary`, {
      headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.data).catch(() => ({})),
  });

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 text-white shadow-2xl shadow-slate-300/40">
        <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.4fr_0.9fr] lg:px-10 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300">
              <Sparkles className="h-4 w-4" />
              Bilingual AI Operating System
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">
              Buenos días / Good morning, {user.name?.split(' ')[0] || 'Marcos'}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              AgentFlow centraliza conversaciones, seguimiento, cobros y coaching de llamadas para que tu agencia opere con más velocidad, menos fuga y mejor conversión.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-slate-400">Agencia activa</p>
                <p className="mt-1 font-semibold text-white">{agency.name || 'Demo Agency'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-slate-400">Estado del sistema</p>
                <p className="mt-1 font-semibold text-emerald-300">Operativo</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Health</p>
                  <p className="font-semibold text-white">API + Frontend OK</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Próximo enfoque</p>
                  <p className="font-semibold text-white">UI polish + data flows</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-300">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Goal</p>
                  <p className="font-semibold text-white">Demo presentable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={MessageSquare}
          label="Conversaciones abiertas"
          value={convos?.total ?? 0}
          accent="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Clientes activos"
          value={analytics?.totalClients ?? 0}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={CreditCard}
          label="Pagos en riesgo"
          value={analytics?.paymentsAtRisk ?? 0}
          accent="bg-rose-50 text-rose-600"
          sub="Vencen esta semana"
        />
        <StatCard
          icon={Phone}
          label="Score promedio equipo"
          value={analytics?.avgCallScore ? `${analytics.avgCallScore}/100` : '—'}
          accent="bg-violet-50 text-violet-600"
          sub="Esta semana"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white shadow-sm shadow-slate-200/60">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Conversaciones recientes</h2>
              <p className="mt-1 text-sm text-slate-500">Prioriza seguimiento y cierre.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {convos?.conversations?.slice(0, 5).map(convo => (
              <a
                key={convo.id}
                href={`/conversations/${convo.id}`}
                className="flex items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                  {(convo.contact?.name || convo.contact?.whatsappNumber || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">
                    {convo.contact?.name || convo.contact?.whatsappNumber}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 capitalize">
                    {convo.context} · {convo.contact?.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Open
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(convo.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </a>
            ))}

            {(!convos?.conversations?.length) && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Inbox limpio</h3>
                <p className="mt-2 text-sm text-slate-500">
                  No hay conversaciones abiertas ahora mismo.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Playbook</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Qué sigue</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Polish visual en módulos de Conversaciones, Contactos y Pagos</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Conectar datos demo para que el panel se vea vivo</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Refinar flujos bilingües de WhatsApp y coaching</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-6 shadow-sm shadow-yellow-100">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">North Star</p>
            <h3 className="mt-3 text-lg font-semibold text-slate-900">Tu agencia operando con IA, no con caos.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              El objetivo no es solo responder mensajes; es convertir, cobrar, retener y entrenar al equipo desde un solo sistema.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
