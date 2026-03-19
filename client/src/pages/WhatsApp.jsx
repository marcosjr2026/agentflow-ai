import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Smartphone, Wifi, WifiOff, RefreshCw, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '/api';
const token = () => localStorage.getItem('token');

export default function WhatsApp() {
  const [status, setStatus] = useState(null); // null | 'disconnected' | 'connecting' | 'qr_ready' | 'connected'
  const [qr, setQr] = useState(null);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar estado actual al montar
  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/oag/whatsapp/status`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setStatus(data.status);
      setPhone(data.phone);
      if (data.status === 'qr_ready') setQr(data.qr);
    } catch {
      setStatus('disconnected');
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // Polling cuando está en qr_ready — detectar cuando el usuario escaneó
  useEffect(() => {
    if (status !== 'qr_ready') return;
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API}/oag/whatsapp/status`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        if (data.status === 'open' || data.status === 'connected') {
          setStatus('connected');
          setPhone(data.phone);
          setQr(null);
          clearInterval(interval);
        }
      } catch {}
    }, 3000); // check cada 3 segundos
    return () => clearInterval(interval);
  }, [status]);

  // Conectar — solicitar QR
  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setQr(null);
    setStatus('connecting');

    try {
      const { data } = await axios.post(`${API}/oag/whatsapp/connect`, {}, {
        headers: { Authorization: `Bearer ${token()}` },
        timeout: 35000,
      });

      if (data.status === 'qr_ready') {
        setQr(data.qr);
        setStatus('qr_ready');
      } else if (data.status === 'connected') {
        setStatus('connected');
        setPhone(data.phone);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar. Intenta de nuevo.');
      setStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  // Desconectar
  const handleDisconnect = async () => {
    if (!confirm('¿Desconectar WhatsApp? El OAG dejará de responder mensajes.')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/oag/whatsapp/disconnect`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setStatus('disconnected');
      setPhone(null);
      setQr(null);
    } catch {
      setError('Error al desconectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">WhatsApp</h1>
        <p className="mt-1 text-sm text-slate-500">
          Conecta el número de WhatsApp de tu agencia para que el OAG atienda a tus clientes automáticamente.
        </p>
      </div>

      {/* Status card */}
      <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-sm shadow-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              status === 'connected' ? 'bg-emerald-50' :
              status === 'qr_ready' || status === 'connecting' ? 'bg-yellow-50' :
              'bg-slate-100'
            }`}>
              <Smartphone className={`h-7 w-7 ${
                status === 'connected' ? 'text-emerald-600' :
                status === 'qr_ready' || status === 'connecting' ? 'text-yellow-600' :
                'text-slate-400'
              }`} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {status === 'connected' ? `Conectado — +${phone}` :
                 status === 'qr_ready' ? 'Escanea el código QR' :
                 status === 'connecting' ? 'Conectando...' :
                 'Sin conectar'}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {status === 'connected' ? 'El OAG está activo y respondiendo mensajes' :
                 status === 'qr_ready' ? 'Abre WhatsApp → Dispositivos vinculados → Escanear código' :
                 status === 'connecting' ? 'Generando código QR, un momento...' :
                 'Conecta tu número de WhatsApp para activar el OAG'}
              </p>
            </div>
          </div>

          {/* Badge estado */}
          <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
            status === 'connected' ? 'bg-emerald-50 text-emerald-700' :
            status === 'qr_ready' || status === 'connecting' ? 'bg-yellow-50 text-yellow-700' :
            'bg-slate-100 text-slate-500'
          }`}>
            {status === 'connected' ? <><Wifi className="h-4 w-4" /> Activo</> :
             status === 'connecting' ? <><Loader2 className="h-4 w-4 animate-spin" /> Conectando</> :
             status === 'qr_ready' ? <><RefreshCw className="h-4 w-4" /> Esperando escaneo</> :
             <><WifiOff className="h-4 w-4" /> Desconectado</>}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* QR Code */}
        {status === 'qr_ready' && qr && (
          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="rounded-3xl border-4 border-slate-900 p-4 shadow-xl">
              <img src={qr} alt="QR WhatsApp" className="h-64 w-64" />
            </div>
            <div className="max-w-sm text-center">
              <p className="font-medium text-slate-900">Cómo escanear:</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-600 text-left">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs text-white font-bold">1</span>
                  Abre WhatsApp en tu teléfono
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs text-white font-bold">2</span>
                  Toca los 3 puntos → <strong>Dispositivos vinculados</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs text-white font-bold">3</span>
                  Toca <strong>Vincular un dispositivo</strong> y escanea este QR
                </li>
              </ol>
              <button
                onClick={handleConnect}
                className="mt-5 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mx-auto"
              >
                <RefreshCw className="h-4 w-4" /> Generar nuevo QR
              </button>
            </div>
          </div>
        )}

        {/* Conectado */}
        {status === 'connected' && (
          <div className="mt-6 rounded-2xl bg-emerald-50 px-6 py-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">OAG activo en +{phone}</p>
                <p className="mt-0.5 text-sm text-emerald-700">
                  Todos los mensajes entrantes son procesados automáticamente con el Soul v1.1
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-8 flex gap-3">
          {status !== 'connected' && (
            <button
              onClick={handleConnect}
              disabled={loading || status === 'connecting'}
              className="flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {loading || status === 'connecting'
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Conectando...</>
                : <><Smartphone className="h-4 w-4" /> Conectar WhatsApp</>}
            </button>
          )}
          {status === 'connected' && (
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" /> Desconectar
            </button>
          )}
          <button
            onClick={fetchStatus}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition-all hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        </div>
      </div>

      {/* Info adicional */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: '🔒', title: 'Tu número, tu control', desc: 'Usas el número de WhatsApp que ya tienen tus clientes. Sin cambios, sin fricción.' },
          { icon: '⚡', title: 'Respuesta en segundos', desc: 'El OAG procesa y responde mensajes en menos de 10 segundos, 24/7.' },
          { icon: '🧠', title: 'Soul v1.1 integrado', desc: 'Cada respuesta sigue los guardrails de compliance TCPA, HIPAA y FTC automáticamente.' },
        ].map(item => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm">
            <div className="text-2xl">{item.icon}</div>
            <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
