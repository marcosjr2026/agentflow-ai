import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Users, Phone,
  CreditCard, BarChart3, Settings, LogOut, Bot
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/conversations', label: 'Conversaciones',  icon: MessageSquare },
  { to: '/contacts',      label: 'Contactos',       icon: Users },
  { to: '/calls',         label: 'Llamadas AI',     icon: Phone },
  { to: '/payments',      label: 'Pagos',           icon: CreditCard },
  { to: '/analytics',     label: 'Analytics',       icon: BarChart3 },
];

export default function Layout() {
  const navigate = useNavigate();
  const agency = JSON.parse(localStorage.getItem('agency') || '{}');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('agency');
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Bot className="w-7 h-7 text-yellow-400" />
            <div>
              <h1 className="font-bold text-lg leading-tight">AgentFlow AI</h1>
              <p className="text-xs text-slate-400 truncate">{agency.name || 'Tu Agencia'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-yellow-400 text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
