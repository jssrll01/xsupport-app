import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileWarning, Wrench, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';

export default function Layout({ children }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const nav = [
    { to: '/',        icon: LayoutDashboard, label: 'Home' },
    { to: '/reports', icon: FileWarning,     label: 'Reports' },
    { to: '/tools',   icon: Wrench,          label: 'Tools' },
  ];

  const handleSignOut = () => { signOut(); navigate('/login'); };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#EEF1F6' }}>
      <header style={{
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10,
        background: '#EEF1F6',
        boxShadow: '0 6px 14px rgba(163, 177, 198, 0.35)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="neu-card" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
            <img src="/icons/icon-192.png" alt="XSupport" style={{ width: 26, height: 26, borderRadius: 6 }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>XSupport</div>
            <div className="muted" style={{ fontSize: 11 }}>Admin console</div>
          </div>
        </div>
        <button onClick={handleSignOut} className="neu-btn" title="Sign out"
                style={{ padding: 10, borderRadius: 10 }}>
          <LogOut size={16} style={{ color: '#7A8499' }} />
        </button>
      </header>

      <main style={{ flex: 1, paddingBottom: 90 }}>{children}</main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#EEF1F6',
        boxShadow: '0 -6px 14px rgba(163, 177, 198, 0.35)',
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0 16px', zIndex: 20,
      }}>
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: isActive ? '#6366F1' : '#7A8499', fontSize: 10.5, fontWeight: 800,
              padding: '6px 16px', textDecoration: 'none',
              borderRadius: 12,
              background: isActive ? '#EEF1F6' : 'transparent',
              boxShadow: isActive
                ? '4px 4px 9px rgba(163, 177, 198, 0.55), -4px -4px 9px rgba(255, 255, 255, 0.95)'
                : 'none',
            })}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
