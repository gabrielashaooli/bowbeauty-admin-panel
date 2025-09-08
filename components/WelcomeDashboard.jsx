import React, { useEffect, useState } from 'react';

function Card({ title, value }) {
  return (
    <div style={{ border: '1px solid #E5DDD5', borderRadius: 8, padding: 16, minWidth: 160 }}>
      <div style={{ fontSize: 12, color: '#8B7355', textTransform: 'uppercase', fontWeight: 600 }}>{title}</div>
      <div style={{ fontWeight: 800, fontSize: 28, color: '#4A3F35' }}>{value ?? 0}</div>
    </div>
  );
}

export default function WelcomeDashboard() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usa el cliente que AdminJS expone en el navegador
    const AC = window.AdminJS?.ApiClient;
    if (!AC) { setLoading(false); return; }
    const api = new AC();
    api.getDashboard()
      .then(({ data }) => setCounts(data?.counts || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, color: '#4A3F35' }}>Bow Beauty Dashboard</h1>
      {loading && <p style={{ color: '#9B8F7E' }}>Cargando…</p>}
      {!loading && !counts && <p style={{ color: '#9B8F7E' }}>Sin datos</p>}
      {!loading && counts && (
        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          <Card title="Usuarios"    value={counts.usuarios} />
          <Card title="Reels"       value={counts.reels} />
          <Card title="Comentarios" value={counts.comentarios} />
          <Card title="Likes"       value={counts.likes} />
        </div>
      )}
    </div>
  );
}
