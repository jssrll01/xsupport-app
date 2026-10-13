import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import Tools from './pages/Tools.jsx';
import NotFound from './pages/NotFound.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }} className="muted">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/"        element={<Protected><Dashboard /></Protected>} />
          <Route path="/reports" element={<Protected><Reports /></Protected>} />
          <Route path="/tools"   element={<Protected><Tools /></Protected>} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
