import Onboarding from './pages/Onboarding';
import SuperAdmin from './pages/SuperAdmin';
import SettingsPage from './pages/Settings';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import ConversationDetail from './pages/ConversationDetail';
import Contacts from './pages/Contacts';
import Calls from './pages/Calls';
import Payments from './pages/Payments';
import Analytics from './pages/Analytics';
import WhatsApp from './pages/WhatsApp';
import Layout from './components/Layout';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected app routes */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="conversations" element={<Conversations />} />
            <Route path="conversations/:id" element={<ConversationDetail />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="calls" element={<Calls />} />
            <Route path="payments" element={<Payments />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin" element={<PrivateRoute><SuperAdmin /></PrivateRoute>} />
          {/* Legacy redirects */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
