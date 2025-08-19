import React, { useEffect, useState } from 'react';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

export default function WelcomeDashboard() {
  const [data, setData] = useState({ 
    counts: { usuarios: 0, reels: 0 }, 
    latest: { reels: [], usuarios: [] } 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const { counts, latest } = data;

  // Componente de tarjeta con animación
  const Card = ({ title, value, icon }) => (
    <div className="bb-card" style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-50%',
        width: '200%',
        height: '200%',
        background: `linear-gradient(45deg, transparent 0%, ${icon === 'users' ? '#E4B1B1' : '#DED8F7'} 100%)`,
        opacity: 0.05,
        transform: 'rotate(15deg)'
      }} />
      
      {/* Icono */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        background: icon === 'users' ? '#ffffffff' : '#ffffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
        fontSize: '18px'
      }}>
        {icon === 'users' ? '👥' : '🎬'}
      </div>
      
      <div style={{ 
        fontSize: '10px', 
        color: '#6A2A2A', 
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        fontWeight: '600'
      }}>
        {title}
      </div>
      <div style={{ 
        fontSize: '28px', 
        fontWeight: '800', 
        color: '#4C1E1E',
        lineHeight: '1'
      }}>
        {loading ? '...' : value.toLocaleString()}
      </div>
    </div>
  );

  // Componente de lista mejorada
  const List = ({ title, items, render, icon }) => (
    <div style={{ 
      background: '#fff', 
      borderRadius: '12px', 
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header con icono */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '8px',
          fontSize: '12px'
        }}>
          {icon}
        </div>
        <h3 style={{ 
          margin: 0, 
          color: '#4C1E1E',
          fontSize: '16px',
          fontWeight: '700'
        }}>
          {title}
        </h3>
      </div>

      {loading ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#898A9A' 
        }}>
          Cargando...
        </div>
      ) : items.length > 0 ? (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {items.map(render)}
        </div>
      ) : (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#898A9A',
          fontStyle: 'italic'
        }}>
          No hay elementos recientes
        </div>
      )}
    </div>
  );

  // Elemento de lista individual
  const ListItem = ({ children }) => (
    <div style={{
      padding: '8px 12px',
      background: 'rgba(222, 216, 247, 0.1)',
      borderRadius: '6px',
      borderLeft: '2px solid #E4BB8D',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#454655'
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #FAEBDD 0%, #F6F7FB 100%)', 
      padding: '24px', 
      borderRadius: '12px',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 8px 0', 
          color: '#4C1E1E'
        }}>
          Bienvenido a Bow Beauty
        </h1>
        <p style={{ 
          fontSize: '16px',
          color: '#6A2A2A',
          margin: 0,
          fontWeight: '400'
        }}>
          Panel de administración • Resumen del sistema
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <Card title="Usuarios Registrados" value={counts.usuarios} icon="users" />
        <Card title="Reels Publicados" value={counts.reels} icon="reels" />
      </div>

      {/* Listas de actividad reciente */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        <List
          title="Últimos Reels"
          icon="🎬"
          items={latest.reels}
          render={(reel) => (
            <ListItem key={reel._id}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#4C1E1E',
                    marginBottom: '2px',
                    fontSize: '13px'
                  }}>
                    {reel.Titulo}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#898A9A',
                    textTransform: 'capitalize'
                  }}>
                    {reel.TipoArchivo} • {new Date(reel.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#E4BB8D' 
                }} />
              </div>
            </ListItem>
          )}
        />
        
        <List
          title="Nuevos Usuarios"
          icon="👥"
          items={latest.usuarios}
          render={(usuario) => (
            <ListItem key={usuario._id}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    color: '#4C1E1E',
                    marginBottom: '2px',
                    fontSize: '13px'
                  }}>
                    {usuario.Name || 'Usuario sin nombre'}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#898A9A'
                  }}>
                    {usuario.Email} • {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                }} />
              </div>
            </ListItem>
          )}
        />
      </div>

      {/* Footer del dashboard */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: 0, 
          color: '#6A2A2A',
          fontSize: '12px'
        }}>
          Bow Beauty Admin Panel
        </p>
      </div>
    </div>
  );
}