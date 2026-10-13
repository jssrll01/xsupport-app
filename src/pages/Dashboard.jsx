import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileWarning, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { fetchReports } from '../lib/reports.js';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await fetchReports();
      const arr = data || [];
      setStats({
        total:    arr.length,
        pending:  arr.filter((r) => ['pending', 'open', 'processing'].includes((r.status || '').toLowerCase())).length,
        resolved: arr.filter((r) => (r.status || '').toLowerCase() === 'resolved').length,
        rejected: arr.filter((r) => (r.status || '').toLowerCase() === 'rejected').length,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'Total',    value: stats.total,    icon: FileWarning, color: '#8B5CF6' },
    { label: 'Pending',  value: stats.pending,  icon: Clock,        color: '#F59E0B' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: '#10B981' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle,      color: '#EF4444' },
  ];

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Dashboard</h2>
      <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>Support overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="neu-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div className="neu-card" style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="muted" style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: .3 }}>{label.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800 }}>{loading ? '…' : value}</div>
          </div>
        ))}
      </div>

      <Link to="/reports" className="neu-card" style={{ display: 'block', padding: 18, marginTop: 16, color: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>View all reports</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Open, edit, or delete tickets</div>
          </div>
          <div className="neu-card" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileWarning size={20} style={{ color: '#8B5CF6' }} />
          </div>
        </div>
      </Link>
    </div>
  );
}
