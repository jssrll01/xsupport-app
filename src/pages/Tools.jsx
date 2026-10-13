import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, X, FileWarning, ChevronDown, ChevronUp, Mail, Phone, Link2 } from 'lucide-react';
import { fetchReports } from '../lib/reports.js';

const STATUS_OPTIONS = ['all', 'submitted', 'in_progress', 'resolved', 'closed'];

function statusColor(s) {
  const v = (s || 'submitted').toLowerCase();
  if (v === 'resolved')    return '#10B981';
  if (v === 'closed')      return '#EF4444';
  if (v === 'in_progress') return '#3B82F6';
  return '#F59E0B';
}

export default function Tools() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [user, setUser] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await fetchReports();
      setRows(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const userTerm = user.trim().toLowerCase();
    const fromTs = from ? new Date(from + 'T00:00:00').getTime() : null;
    const toTs   = to   ? new Date(to   + 'T23:59:59').getTime() : null;

    return rows.filter((r) => {
      if (status !== 'all' && (r.status || 'submitted').toLowerCase() !== status) return false;

      if (userTerm) {
        const hay = [r.user_id, r.gmail, r.phone].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(userTerm)) return false;
      }

      if (fromTs || toTs) {
        const t = new Date(r.created_at).getTime();
        if (fromTs && t < fromTs) return false;
        if (toTs && t > toTs) return false;
      }

      if (term) {
        const hay = [r.concern, r.category, r.gmail, r.phone, r.related_id, r.admin_note, r.id, r.user_id]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(term)) return false;
      }

      return true;
    });
  }, [rows, q, status, user, from, to]);

  const clearFilters = () => { setStatus('all'); setUser(''); setFrom(''); setTo(''); };

  const activeFilterCount =
    (status !== 'all' ? 1 : 0) + (user ? 1 : 0) + (from ? 1 : 0) + (to ? 1 : 0);

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Tools</h2>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>Search &amp; filter reports</p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: 15, color: '#97A0B5' }} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search concern, category, gmail, phone, related ID…"
          className="neu-input"
          style={{ paddingLeft: 40, paddingRight: q ? 40 : 14 }}
        />
        {q && (
          <button onClick={() => setQ('')} className="neu-btn"
            style={{ position: 'absolute', right: 8, top: 8, padding: 6, borderRadius: 8 }}>
            <X size={14} style={{ color: '#7A8499' }} />
          </button>
        )}
      </div>

      {/* Filter toggle */}
      <button onClick={() => setShowFilters((s) => !s)} className="neu-btn"
        style={{ width: '100%', padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} style={{ color: '#6366F1' }} />
          Advanced filter
          {activeFilterCount > 0 && (
            <span className="neu-badge" style={{ background: '#6366F1', color: 'white' }}>
              {activeFilterCount}
            </span>
          )}
        </span>
        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Filter panel */}
      {showFilters && (
        <div className="neu-card" style={{ padding: 16, marginTop: 12 }}>
          <label className="muted" style={{ fontSize: 11, fontWeight: 800 }}>STATUS</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="neu-input" style={{ marginTop: 6, marginBottom: 12 }}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>

          <label className="muted" style={{ fontSize: 11, fontWeight: 800 }}>USER (id / gmail / phone)</label>
          <input type="text" value={user} onChange={(e) => setUser(e.target.value)}
            placeholder="search by user"
            className="neu-input" style={{ marginTop: 6, marginBottom: 12 }} />

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label className="muted" style={{ fontSize: 11, fontWeight: 800 }}>FROM</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                className="neu-input" style={{ marginTop: 6 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="muted" style={{ fontSize: 11, fontWeight: 800 }}>TO</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                className="neu-input" style={{ marginTop: 6 }} />
            </div>
          </div>

          <button onClick={clearFilters} className="neu-btn"
            style={{ width: '100%', padding: 11, marginTop: 14, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <X size={14} /> Clear filters
          </button>
        </div>
      )}

      {/* Results */}
      <div style={{ marginTop: 16 }}>
        <div className="muted" style={{ fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
          {loading ? 'LOADING…' : (filtered.length + ' RESULT' + (filtered.length === 1 ? '' : 'S'))}
        </div>

        {!loading && !filtered.length && (
          <div className="neu-card" style={{ padding: 30, textAlign: 'center' }}>
            <FileWarning size={30} style={{ color: '#97A0B5', marginBottom: 8 }} />
            <div className="muted" style={{ fontSize: 13 }}>No matching tickets</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((row) => {
            const sc = statusColor(row.status);
            return (
              <div key={row.id} className="neu-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span className="neu-badge" style={{ background: '#EEF1F6', color: '#6366F1', textTransform: 'uppercase' }}>
                        {row.category || 'report'}
                      </span>
                      <span className="muted" style={{ fontSize: 11, fontWeight: 700 }}>#{row.id?.slice(0, 8)}</span>
                    </div>
                    <div className="muted" style={{ fontSize: 11 }}>
                      {new Date(row.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span className="neu-badge" style={{ background: sc + '22', color: sc, height: 'fit-content', whiteSpace: 'nowrap' }}>
                    {(row.status || 'submitted').replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: 12.5, color: '#3A4256', marginBottom: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {(row.concern || '').slice(0, 200)}{(row.concern || '').length > 200 ? '…' : ''}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 11, color: '#7A8499' }}>
                  {row.gmail && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={11} /> {row.gmail}
                    </span>
                  )}
                  {row.phone && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={11} /> {row.phone}
                    </span>
                  )}
                  {row.related_id && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Link2 size={11} /> {row.related_id}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
