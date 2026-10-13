import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, Save, X, User, Mail, Phone, Link2, Tag, Calendar } from 'lucide-react';
import { fetchReports, updateReport, deleteReport } from '../lib/reports.js';

const STATUS_OPTIONS = ['submitted', 'in_progress', 'resolved', 'closed'];

function statusColor(s) {
  const v = (s || 'submitted').toLowerCase();
  if (v === 'resolved')    return '#10B981';
  if (v === 'closed')      return '#EF4444';
  if (v === 'in_progress') return '#3B82F6';
  return '#F59E0B';
}

function Field({ icon: Icon, label, value, mono }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
      <Icon size={13} style={{ color: '#97A0B5', marginTop: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="muted" style={{ fontSize: 10, fontWeight: 800, letterSpacing: .4 }}>
          {label.toUpperCase()}
        </div>
        <div style={{
          fontSize: 12.5, color: '#3A4256', wordBreak: 'break-word',
          fontFamily: mono ? 'ui-monospace, Menlo, monospace' : 'inherit',
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await fetchReports();
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startEdit = (row) => {
    setEditing(row.id);
    setDraft({
      status: row.status || 'submitted',
      admin_note: row.admin_note || '',
    });
  };
  const cancelEdit = () => { setEditing(null); setDraft({}); };

  const saveEdit = async () => {
    setBusy(true);
    const { error } = await updateReport(editing, {
      ...draft,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) return alert(error.message);
    setEditing(null); setDraft({});
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this report? This cannot be undone.')) return;
    const { error } = await deleteReport(id);
    if (error) return alert(error.message);
    load();
  };

  if (loading) return <div style={{ padding: 30, textAlign: 'center' }} className="muted">Loading…</div>;

  if (!rows.length) {
    return (
      <div className="page-enter" style={{ padding: 30, textAlign: 'center' }}>
        <div className="muted">No reports yet</div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Reports</h2>
      <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
        {rows.length} ticket{rows.length === 1 ? '' : 's'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((row) => {
          const isEditing = editing === row.id;
          const sc = statusColor(row.status);

          return (
            <div key={row.id} className="neu-card" style={{ padding: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="neu-badge" style={{ background: '#EEF1F6', color: '#6366F1', textTransform: 'uppercase' }}>
                      {row.category || 'report'}
                    </span>
                    <span className="muted" style={{ fontSize: 11, fontWeight: 700 }}>
                      #{row.id?.slice(0, 8)}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    {new Date(row.created_at).toLocaleString()}
                    {row.updated_at && row.updated_at !== row.created_at ? (
                      <> · edited {new Date(row.updated_at).toLocaleString()}</>
                    ) : null}
                  </div>
                </div>
                <span className="neu-badge" style={{ background: sc + '22', color: sc, height: 'fit-content', whiteSpace: 'nowrap' }}>
                  {(row.status || 'submitted').replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Concern (main body) */}
              <div className="neu-card-inset" style={{ padding: 12, marginBottom: 12 }}>
                <div className="muted" style={{ fontSize: 10, fontWeight: 800, letterSpacing: .4, marginBottom: 4 }}>
                  CONCERN
                </div>
                <div style={{ fontSize: 13.5, color: '#2B3244', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                  {row.concern || '—'}
                </div>
              </div>

              {/* Details grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px 14px',
                marginBottom: 12,
              }}>
                <Field icon={Mail}     label="Gmail"      value={row.gmail} />
                <Field icon={Phone}    label="Phone"      value={row.phone} />
                <Field icon={User}     label="User ID"    value={row.user_id?.slice(0, 12) + '…'} mono />
                <Field icon={Link2}    label="Related ID" value={row.related_id} mono />
              </div>

              {/* Admin note */}
              {row.admin_note && !isEditing && (
                <div style={{
                  padding: 10, marginBottom: 12, borderRadius: 10,
                  background: '#E8ECF4',
                  boxShadow: 'inset 2px 2px 4px rgba(163,177,198,.45), inset -2px -2px 4px rgba(255,255,255,.9)',
                }}>
                  <div className="muted" style={{ fontSize: 10, fontWeight: 800, letterSpacing: .4, marginBottom: 3 }}>
                    ADMIN NOTE
                  </div>
                  <div style={{ fontSize: 12.5, color: '#3A4256', whiteSpace: 'pre-wrap' }}>
                    {row.admin_note}
                  </div>
                </div>
              )}

              {/* Edit / Delete */}
              {isEditing ? (
                <>
                  <label className="muted" style={{ fontSize: 11, fontWeight: 800 }}>STATUS</label>
                  <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                    className="neu-input" style={{ marginTop: 6, marginBottom: 12 }}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>

                  <label className="muted" style={{ fontSize: 11, fontWeight: 800 }}>ADMIN NOTE</label>
                  <textarea value={draft.admin_note} onChange={(e) => setDraft({ ...draft, admin_note: e.target.value })}
                    rows={3} className="neu-input" style={{ marginTop: 6, marginBottom: 12, resize: 'vertical' }} />

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={saveEdit} disabled={busy} className="neu-btn-primary"
                      style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13 }}>
                      <Save size={14} /> {busy ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={cancelEdit} className="neu-btn"
                      style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13 }}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => startEdit(row)} className="neu-btn"
                    style={{ flex: 1, padding: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5 }}>
                    <Edit3 size={14} /> Edit
                  </button>
                  <button onClick={() => remove(row.id)} className="neu-btn"
                    style={{ padding: '11px 16px', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
