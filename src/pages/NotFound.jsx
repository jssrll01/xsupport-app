import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>404</div>
      <div className="muted" style={{ marginBottom: 20 }}>Page not found</div>
      <Link to="/" className="btn-primary" style={{ padding: '10px 20px', borderRadius: 10, display: 'inline-block' }}>
        Back to home
      </Link>
    </div>
  );
}
