import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ agencyName: '', adminName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, loginForm);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('agency', JSON.stringify(data.agency));
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/register-agency`, registerForm);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('agency', JSON.stringify(data.agency));
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4">
            <Bot className="w-9 h-9 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-white">Open AG</h1>
          <p className="text-slate-400 mt-1">AI System for Insurance Agencies</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800 rounded-2xl p-1 mb-6">
          <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${tab === 'login' ? 'bg-yellow-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
            Iniciar sesión
          </button>
          <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${tab === 'register' ? 'bg-yellow-400 text-slate-900' : 'text-slate-400 hover:text-white'}`}>
            Crear cuenta
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="tu@agencia.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="••••••••" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de la agencia</label>
                <input type="text" value={registerForm.agencyName} onChange={e => setRegisterForm(f => ({ ...f, agencyName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="Seguros Miami Pro" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tu nombre</label>
                <input type="text" value={registerForm.adminName} onChange={e => setRegisterForm(f => ({ ...f, adminName: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="María García" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={registerForm.email} onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="admin@miagencia.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (WhatsApp)</label>
                <input type="tel" value={registerForm.phone} onChange={e => setRegisterForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="+1 (305) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                <input type="password" value={registerForm.password} onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  placeholder="Mínimo 8 caracteres" required minLength={8} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
              </button>
              <p className="text-xs text-center text-slate-400">Al registrarte, serás redirigido al proceso de configuración de tu agente.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
