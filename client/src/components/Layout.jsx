import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Users, Phone,
  CreditCard, BarChart3, LogOut, Bot, ChevronRight, ShieldCheck, Settings
} from 'lucide-react';

const navItems = [
  { to: '/app/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/app/conversations', label: 'Conversaciones', icon: MessageSquare },
  { to: '/app/contacts',      label: 'Contactos',      icon: Users },
  { to: '/app/calls',         label: 'Llamadas AI',    icon: Phone },
  { to: '/app/payments',      label: 'Pagos',          icon: CreditCard },
  { to: '/app/analytics',     label: 'Analytics',      icon: BarChart3 },
  { to: '/app/settings',      label: 'Configuración',  icon: Settings },
];

const pageTitles = {
  '/app/dashboard': 'Resumen ejecutivo',
  '/app/conversations': 'Conversaciones',
  '/app/contacts': 'Contactos',
  '/app/calls': 'Llamadas AI',
  '/app/payments': 'Pagos',
  '/app/analytics': 'Analytics',
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const agency = JSON.parse(localStorage.getItem('agency') || '{}');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('agency');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200/70 bg-slate-950 text-white">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 shadow-lg shadow-yellow-500/20">
                <Bot className="h-7 w-7 text-slate-950" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold tracking-tight">Open AG</h1>
                <p className="truncate text-sm text-slate-400">{agency.name || 'Tu Agencia'}</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Admin</p>
              <p className="mt-2 font-medium text-white">{user.name || 'Usuario'}</p>
              <p className="mt-1 text-sm text-slate-400">{user.email || 'Sin email'}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100" />
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4 space-y-1">
            {user.role === 'super_admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-yellow-400 transition-colors hover:bg-yellow-400/10"
              >
                <ShieldCheck className="h-5 w-5" />
                Super Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Open AG Console</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {pageTitles[location.pathname] || 'Open AG'}
                </h2>
              </div>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:block">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Workspace</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{agency.name || 'Demo Agency'}</p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
