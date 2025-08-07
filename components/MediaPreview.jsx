import React from 'react';

const MediaPreview = ({ record }) => {
  if (!record?.params) return <p>No hay datos</p>;

  const { MediaUrl, TipoArchivo, Titulo } = record.params;
  
  if (!MediaUrl) return <p>No hay media</p>;

  return (
    <div style={{ maxWidth: '300px' }}>
      <div style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>
        {Titulo} - {TipoArchivo}
      </div>
      
      {TipoArchivo === 'imagen' ? (
        <img 
          src={MediaUrl} 
          alt={Titulo} 
          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
        />
      ) : (
        <video controls style={{ width: '100%', maxHeight: '200px' }}>
          <source src={MediaUrl} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default MediaPreview;