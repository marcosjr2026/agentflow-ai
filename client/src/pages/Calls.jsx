import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Phone, Upload, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const token = () => localStorage.getItem('token');
const api = () => ({ headers: { Authorization: `Bearer ${token()}` } });

function ScoreBadge({ score }) {
  if (!score) return <span className="text-xs text-slate-400">—</span>;
  const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>{score}/100</span>;
}

function CheckItem({ label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {value ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
      <span className={value ? 'text-slate-700' : 'text-slate-400'}>{label}</span>
    </div>
  );
}

function CallDetail({ call, evaluation, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-slate-800">Evaluación de Llamada</h2>
            <p className="text-xs text-slate-400 mt-0.5">{call.agent?.name} · {new Date(call.calledAt || call.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
          <div className="flex items-center gap-3">
            <ScoreBadge score={call.score} />
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
          </div>
        </div>

        {!evaluation ? (
          <div className="p-8 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 animate-spin text-yellow-400" />
            <p>Analizando llamada...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Checklist */}
            <div>
              <h3 className="font-medium text-slate-700 mb-3 text-sm uppercase tracking-wide">Checklist del agente</h3>
              <div className="grid grid-cols-2 gap-2">
                <CheckItem label="Preguntó la edad" value={evaluation.askedAge} />
                <CheckItem label="Preguntó zip code" value={evaluation.askedZipcode} />
                <CheckItem label="Identificó necesidad" value={evaluation.askedNeed} />
                <CheckItem label="Presentó planes" value={evaluation.handledPriceObjection !== undefined} />
                <CheckItem label="Manejó objeción precio" value={evaluation.handledPriceObjection} />
                <CheckItem label="Manejó objeción competencia" value={evaluation.handledCompetitorObjection} />
                <CheckItem label="Intentó cerrar" value={evaluation.attemptedClose} />
                <CheckItem label="Cierre exitoso" value={evaluation.closeSuccessful} />
              </div>
            </div>

            {evaluation.positives && (
              <div className="bg-green-50 rounded-xl p-4">
                <h3 className="font-medium text-green-800 mb-2 text-sm">✅ Lo que hizo bien</h3>
                <p className="text-sm text-green-700">{evaluation.positives}</p>
              </div>
            )}

            {evaluation.improvements && (
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="font-medium text-red-800 mb-2 text-sm">⚠️ Áreas de mejora</h3>
                <p className="text-sm text-red-700">{evaluation.improvements}</p>
              </div>
            )}

            {evaluation.recommendations && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-medium text-blue-800 mb-2 text-sm">💡 Recomendaciones</h3>
                <p className="text-sm text-blue-700 whitespace-pre-wrap">{evaluation.recommendations}</p>
              </div>
            )}

            {evaluation.missedOpportunities?.length > 0 && (
              <div>
                <h3 className="font-medium text-slate-700 mb-2 text-sm">Oportunidades perdidas</h3>
                <ul className="space-y-1">
                  {evaluation.missedOpportunities.map((o, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-red-400">•</span>{o}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Calls() {
  const qc = useQueryClient();
  const fileRef = useRef();
  const [selected, setSelected] = useState(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ agentId: '', file: null });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const { data, isLoading } = useQuery({
    queryKey: ['calls'],
    queryFn: () => axios.get(`${API}/calls`, api()).then(r => r.data),
    refetchInterval: 10000,
  });

  const { data: evalData } = useQuery({
    queryKey: ['call-eval', selected?.id],
    queryFn: () => axios.get(`${API}/calls/${selected.id}`, api()).then(r => r.data),
    enabled: !!selected,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData) => axios.post(`${API}/calls/upload`, formData, {
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => { setUploadModal(false); qc.invalidateQueries(['calls']); },
  });

  function handleUpload() {
    if (!uploadForm.file) return;
    const fd = new FormData();
    fd.append('audio', uploadForm.file);
    fd.append('agentId', uploadForm.agentId || user.id);
    uploadMutation.mutate(fd);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Llamadas AI</h1>
        <button onClick={() => setUploadModal(true)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm">
          <Upload className="w-4 h-4" /> Subir llamada
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>{['Agente', 'Contacto', 'Fecha', 'Duración', 'Score', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Cargando...</td></tr>
            ) : data?.calls?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400">
                <Phone className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                <p>No hay llamadas analizadas aún</p>
                <p className="text-xs mt-1">Sube un audio para comenzar</p>
              </td></tr>
            ) : data?.calls?.map(call => (
              <tr key={call.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{call.agent?.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{call.contact?.name || call.contact?.whatsappNumber || '—'}</td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(call.calledAt || call.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {call.durationSeconds ? `${Math.floor(call.durationSeconds / 60)}:${String(call.durationSeconds % 60).padStart(2, '0')}` : '—'}
                </td>
                <td className="px-4 py-3"><ScoreBadge score={call.score} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(call)}
                    className="text-xs text-yellow-600 hover:text-yellow-700 font-medium underline">
                    Ver análisis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Subir llamada para análisis</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Archivo de audio (MP3, WAV, M4A)</label>
                <input type="file" ref={fileRef} accept="audio/*" onChange={e => setUploadForm(f => ({ ...f, file: e.target.files[0] }))}
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:text-xs" />
              </div>
              {uploadForm.file && <p className="text-xs text-green-600">✅ {uploadForm.file.name}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setUploadModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm">Cancelar</button>
              <button onClick={handleUpload} disabled={!uploadForm.file || uploadMutation.isPending}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                {uploadMutation.isPending ? 'Procesando...' : 'Analizar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <CallDetail
          call={selected}
          evaluation={evalData?.evaluation}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
