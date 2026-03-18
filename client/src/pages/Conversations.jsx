import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageSquare, Filter } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');

export default function Conversations() {
  const [status, setStatus] = useState('open');

  const { data, isLoading } = useQuery({
    queryKey: ['conversations', status],
    queryFn: () => axios.get(`${API}/conversations?status=${status}&limit=100`, {
      headers: { Authorization: `Bearer ${token()}` }
    }).then(r => r.data),
  });

  const statusColors = {
    open: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-slate-100 text-slate-600',
  };

  const contextLabels = {
    service: 'Servicio',
    sales: 'Ventas',
    admin: 'Admin',
    education: 'Educación',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Conversaciones</h1>
        <div className="flex gap-2">
          {['open', 'pending', 'resolved', 'all'].map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                status === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'Todas' : s === 'open' ? 'Abiertas' : s === 'pending' ? 'Pendientes' : 'Resueltas'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Cargando...</div>
        ) : data?.conversations?.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p>No hay conversaciones {status === 'open' ? 'abiertas' : status}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {data?.conversations?.map(convo => (
              <Link
                key={convo.id}
                to={`/conversations/${convo.id}`}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-11 h-11 bg-slate-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {(convo.contact?.name || convo.contact?.whatsappNumber || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-slate-800 text-sm">
                      {convo.contact?.name || convo.contact?.whatsappNumber}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[convo.status]}`}>
                      {contextLabels[convo.context] || convo.context}
                    </span>
                    <span className="text-xs text-slate-400 capitalize bg-slate-100 px-2 py-0.5 rounded-full">
                      {convo.contact?.type}
                    </span>
                  </div>
                  {convo.assignedTo && (
                    <p className="text-xs text-slate-400">Asignada a {convo.assignedTo.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {new Date(convo.updatedAt).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short',
                    })}
                  </p>
                  {convo.status === 'open' && (
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full mt-1" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
