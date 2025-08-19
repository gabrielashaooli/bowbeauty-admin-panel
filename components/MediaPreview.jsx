import React from 'react';
const MediaPreview = ({ record }) => {
  const p = record?.params || {};
  if (!p.MediaUrl) return <p>No hay media</p>;

  const isImage = (p.TipoArchivo || '').toLowerCase() === 'imagen';
  return (
    <div style={{ maxWidth: 320 }}>
      <div style={{ fontSize: 12, marginBottom: 6, color: '#666' }}>
        {(p.Titulo || 'Sin título')} • {(p.TipoArchivo || '').toUpperCase()}
      </div>
      {isImage ? (
        <img src={p.MediaUrl} alt={p.Titulo || 'media'} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }} />
      ) : (
        <video controls style={{ width: '100%', maxHeight: 220, borderRadius: 8 }}>
          <source src={p.MediaUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
export default MediaPreview;
