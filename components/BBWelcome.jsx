import React, { useEffect, useState } from 'react';

function Card({ label, value }) {
  return (
    <div style={{ border: '1px solid #E5DDD5', borderRadius: 8, padding: 16, minWidth: 150 }}>
      <div style={{ fontSize: 12, color: '#8B7355', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 28, color: '#4A3F35' }}>{value ?? 0}</div>
    </div>
  );
}

export default function BBWelcome() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const AC = window.AdminJS?.ApiClient;
    if (!AC) { setLoading(false); return; }
    const api = new AC();
    api.getDashboard()
      .then(({ data }) => setCounts(data?.counts || null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, color: '#4A3F35' }}>Bow Beauty Dashboard</h1>
      {loading && <p style={{ color: '#9B8F7E' }}>Cargando…</p>}
      {!loading && counts && (
        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <Card label="Usuarios" value={counts.usuarios} />
          <Card label="Reels" value={counts.reels} />
          <Card label="Comentarios" value={counts.comentarios} />
          <Card label="Likes" value={counts.likes} />
        </div>
      )}
      {!loading && !counts && <p style={{ color: '#9B8F7E' }}>Sin datos</p>}
    </div>
  );
}
