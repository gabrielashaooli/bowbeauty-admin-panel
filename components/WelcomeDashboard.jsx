import React, { useEffect, useState, useMemo } from 'react';
import { ApiClient } from 'adminjs';

const api = new ApiClient();

// Helper para formatear fechas con fallback
const fmtDate = (d) => {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

export default function WelcomeDashboard() {
  const [data, setData] = useState({
    counts: { usuarios: 0, reels: 0, comentarios: 0, likes: 0, codigosReset: 0, reelsHoy: 0, usuariosHoy: 0 },
    latest: { reels: [], usuarios: [], comentarios: [] },
    charts: { actividadSemanal: [], tiposContenido: [], actividadPorHora: [], topUsuarios: [] },
    metrics: { engagementRate: 0, avgLikesPerReel: 0, growthRate: 0 },
    alertas: [],
    meta: {}
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.getDashboard()
      .then(({ data }) => {
        setData(data || {});
      })
      .catch((error) => {
        console.error('Error loading dashboard:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const { counts = {}, latest = {}, charts = {}, metrics: serverMetrics = {} } = data;

  // Datos para gráficos (100% reales del handler)
  const chartData = useMemo(() => {
    // Semanal: usamos el arreglo que viene del handler y agregamos "value" para el SimpleChart
    const weekly = (charts.actividadSemanal || []).map((d) => ({
      day:
        d.day ||
        d.dia ||
        (d.date || d.fecha
          ? new Date(d.date || d.fecha).toLocaleDateString('es-ES', { weekday: 'short' })
          : ''),
      usuarios: d.usuarios || 0,
      reels: d.reels || 0,
      comentarios: d.comentarios || 0,
      value: (d.usuarios || 0) + (d.reels || 0),
    }));

    // Tipos de contenido: ya viene como { name, value, color }
    const contentTypes = charts.tiposContenido || [];

    // Actividad por hora: normalizamos "hora" -> "hour"
    const hourly = (charts.actividadPorHora || []).map((h) => ({
      ...h,
      hour: h.hour || h.hora,
    }));

    return { weekly, contentTypes, hourly };
  }, [charts]);

  // Métricas: usamos las del servidor; si no vienen, calculamos de counts
  const metrics = useMemo(() => {
    if (serverMetrics && serverMetrics.engagementRate !== undefined) {
      return {
        engagementRate: serverMetrics.engagementRate,
        avgLikesPerReel: serverMetrics.avgLikesPerReel,
        growthRate: serverMetrics.growthRate,
      };
    }
    const engagementRate = counts.reels > 0 ? ((counts.comentarios + counts.likes) / counts.reels).toFixed(1) : '0.0';
    const avgLikesPerReel = counts.reels > 0 ? (counts.likes / counts.reels).toFixed(1) : '0.0';
    const growthRate = counts.usuarios > 0 ? ((counts.usuariosHoy / counts.usuarios) * 100).toFixed(1) : '0.0';
    return { engagementRate, avgLikesPerReel, growthRate };
  }, [serverMetrics, counts]);

  // Tarjeta métrica compacta
  const MetricCard = ({ title, value, subtitle, trend }) => (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ fontSize: 12, color: '#8B7355', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#4A3F35', lineHeight: 1, marginBottom: 6 }}>
        {loading ? '...' : value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: '#9B8F7E', display: 'flex', alignItems: 'center', gap: 6 }}>
          {typeof trend === 'number' && (
            <span
              style={{
                color: trend > 0 ? '#6B5B47' : trend < 0 ? '#8B7355' : '#9B8F7E',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
            </span>
          )}
          {subtitle}
        </div>
      )}
    </div>
  );

  // Gráfico de barras súper simple
  const SimpleChart = ({ data, type = 'bar', height = 140, color = '#D4B896' }) => {
    if (!data || data.length === 0) {
      return <div style={{ color: '#9B8F7E', textAlign: 'center', padding: 40 }}>No hay datos</div>;
    }
    const maxValue = Math.max(...data.map((d) => d.value || d.usuarios || d.reels || d.actividad || 0), 0);
    const chartHeight = height - 40; // espacio para labels

    return (
      <div style={{ padding: '10px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            height: chartHeight,
            gap: type === 'bar' ? 4 : 2,
            justifyContent: 'space-around',
          }}
        >
          {data.slice(0, 12).map((item, index) => {
            const value = item.value || item.usuarios || item.reels || item.actividad || 0;
            const barHeight = maxValue > 0 ? (value / maxValue) * (chartHeight - 16) : 0;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 20 }}>
                <div
                  style={{
                    width: type === 'bar' ? 16 : 3,
                    height: `${Math.max(barHeight, 2)}px`,
                    background: color,
                    borderRadius: type === 'bar' ? '2px 2px 0 0' : 2,
                    marginBottom: 6,
                  }}
                />
                <div style={{ fontSize: 10, color: '#9B8F7E', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>
                  {item.day || item.hour || item.name || `${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Pie chart básico
  const SimplePieChart = ({ data, size = 130 }) => {
    if (!data || data.length === 0) return <div style={{ color: '#9B8F7E', textAlign: 'center', padding: 40 }}>No hay datos</div>;
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    if (total === 0) return <div style={{ color: '#9B8F7E', textAlign: 'center', padding: 40 }}>Sin contenido</div>;

    let currentAngle = 0;
    const center = size / 2;
    const radius = center - 8;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {data.map((item, index) => {
            const angle = ((item.value || 0) / total) * 360;
            const x1 = center + radius * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = center + radius * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = center + radius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = center + radius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = [`M ${center} ${center}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');
            currentAngle += angle;

            return <path key={index} d={pathData} fill={item.color || '#D4B896'} stroke="#fff" strokeWidth="2" />;
          })}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color || '#D4B896' }} />
              <span style={{ fontSize: 12, color: '#4A3F35', fontWeight: 500 }}>
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Feed de actividad (últimos reels/usuarios/comentarios)
  const ActivityFeed = () => (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', color: '#4A3F35', fontSize: 18, fontWeight: 700 }}>Actividad Reciente</h3>
      <div style={{ maxHeight: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Últimos reels */}
        {(latest.reels || []).slice(0, 4).map((reel) => (
          <div
            key={`reel-${reel._id}`}
            style={{
              padding: 12,
              background: '#FDFCFB',
              borderRadius: 8,
              border: '1px solid #F0EBE3',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#F0EBE3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#8B7355',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {reel.TipoArchivo === 'video' ? 'VID' : 'IMG'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: '#4A3F35',
                  fontSize: 14,
                  marginBottom: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {reel.Titulo || 'Sin título'}
              </div>
              <div style={{ fontSize: 12, color: '#9B8F7E', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span>{reel.TipoArchivo || 'contenido'}</span>
                <span>•</span>
                <span>{fmtDate(reel.createdAt)}</span>
                {!!reel.Likes && reel.Likes > 0 && (
                  <>
                    <span>•</span>
                    <span>{reel.Likes} likes</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Nuevos usuarios */}
        {(latest.usuarios || []).slice(0, 3).map((usuario) => (
          <div
            key={`user-${usuario._id}`}
            style={{
              padding: 12,
              background: '#FDFCFB',
              borderRadius: 8,
              border: '1px solid #F0EBE3',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#E5DDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#8B7355',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              USR
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: '#4A3F35',
                  fontSize: 14,
                  marginBottom: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {usuario.Name || 'Usuario sin nombre'}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#9B8F7E',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {usuario.Email} • {fmtDate(usuario.createdAt)}
              </div>
            </div>
          </div>
        ))}

        {/* Comentarios recientes */}
        {(latest.comentarios || []).slice(0, 2).map((comentario) => (
          <div
            key={`comment-${comentario._id}`}
            style={{
              padding: 12,
              background: '#FDFCFB',
              borderRadius: 8,
              border: '1px solid #F0EBE3',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#F0EBE3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#8B7355',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              COM
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: '#4A3F35', fontSize: 14, marginBottom: 2 }}>Nuevo comentario</div>
              <div
                style={{
                  fontSize: 13,
                  color: '#4A3F35',
                  marginBottom: 4,
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                "{(comentario.Contenido || '').substring(0, 120)}{(comentario.Contenido || '').length > 120 ? '...' : ''}"
              </div>
              <div style={{ fontSize: 12, color: '#9B8F7E' }}>{fmtDate(comentario.createdAt)}</div>
            </div>
          </div>
        ))}

        {/* Mensaje cuando no hay actividad */}
        {(!latest.reels || latest.reels.length === 0) &&
          (!latest.usuarios || latest.usuarios.length === 0) &&
          (!latest.comentarios || latest.comentarios.length === 0) && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: '#9B8F7E' }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No hay actividad reciente</div>
              <div style={{ fontSize: 13 }}>La actividad aparecerá aquí cuando los usuarios interactúen</div>
            </div>
          )}
      </div>
    </div>
  );

  // Tabs
  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      style={{
        padding: '10px 18px',
        border: 'none',
        borderRadius: 8,
        background: active ? '#E5DDD5' : 'transparent',
        color: active ? '#4A3F35' : '#8B7355',
        fontWeight: active ? 600 : 500,
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        background: '#FDFCFB',
        padding: 24,
        borderRadius: 16,
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36,
            fontWeight: 700,
            margin: '0 0 6px 0',
            color: '#4A3F35',
          }}
        >
          Bow Beauty Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#8B7355', margin: 0, fontWeight: 400 }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            background: '#ffffff',
            padding: 6,
            borderRadius: 12,
            border: '1px solid #E5DDD5',
            flexWrap: 'wrap',
          }}
        >
          <TabButton id="overview" label="Resumen" active={activeTab === 'overview'} onClick={setActiveTab} />
          <TabButton id="analytics" label="Analítica" active={activeTab === 'analytics'} onClick={setActiveTab} />
          <TabButton id="activity" label="Actividad" active={activeTab === 'activity'} onClick={setActiveTab} />
        </div>
      </div>

      {/* Contenido */}
      {activeTab === 'overview' && (
        <>
          {/* Métricas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <MetricCard title="Total Usuarios" value={counts.usuarios?.toLocaleString() || '0'} subtitle={`+${counts.usuariosHoy || 0} hoy`} trend={counts.usuariosHoy} />
            <MetricCard title="Contenido Publicado" value={counts.reels?.toLocaleString() || '0'} subtitle={`+${counts.reelsHoy || 0} hoy`} trend={counts.reelsHoy} />
            <MetricCard title="Engagement Rate" value={`${metrics.engagementRate}%`} subtitle="Promedio de interacción" />
            <MetricCard title="Comentarios Activos" value={counts.comentarios?.toLocaleString() || '0'} subtitle="Total de comentarios" />
          </div>

          {/* Gráficos */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E5DDD5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#4A3F35', fontSize: 16, fontWeight: 700 }}>Actividad Semanal</h3>
              <SimpleChart data={chartData.weekly} type="bar" color="#D4B896" />
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E5DDD5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#4A3F35', fontSize: 16, fontWeight: 700 }}>Tipos de Contenido</h3>
              <SimplePieChart data={chartData.contentTypes} />
            </div>
          </div>

          {/* Actividad */}
          <ActivityFeed />
        </>
      )}

      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E5DDD5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#4A3F35', fontSize: 16, fontWeight: 700 }}>Actividad por Horas del Día</h3>
            <SimpleChart data={chartData.hourly} type="bar" height={200} color="#D4B896" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <MetricCard title="Promedio Likes/Reel" value={metrics.avgLikesPerReel} subtitle="Media de interacciones" />
            <MetricCard title="Tasa de Crecimiento" value={`${metrics.growthRate}%`} subtitle="Usuarios nuevos hoy" />
            <MetricCard title="Códigos Pendientes" value={counts.codigosReset || 0} subtitle="Reset de contraseña" />
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
          <ActivityFeed />

          <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E5DDD5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#4A3F35', fontSize: 16, fontWeight: 700 }}>Acciones Rápidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                style={{
                  padding: '12px 16px',
                  border: '1px solid #E5DDD5',
                  borderRadius: 8,
                  background: '#FDFCFB',
                  color: '#4A3F35',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                }}
              >
                Revisar Contenido Reportado
              </button>
              <button
                style={{
                  padding: '12px 16px',
                  border: '1px solid #E5DDD5',
                  borderRadius: 8,
                  background: '#FDFCFB',
                  color: '#4A3F35',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                }}
              >
                Generar Reporte Semanal
              </button>
              <button
                style={{
                  padding: '12px 16px',
                  border: '1px solid #E5DDD5',
                  borderRadius: 8,
                  background: '#FDFCFB',
                  color: '#4A3F35',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                }}
              >
                Limpiar Códigos Expirados
              </button>
              <button
                style={{
                  padding: '12px 16px',
                  border: '1px solid #E5DDD5',
                  borderRadius: 8,
                  background: '#FDFCFB',
                  color: '#4A3F35',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                }}
              >
                Backup de Base de Datos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: '#ffffff',
          borderRadius: 12,
          textAlign: 'center',
          border: '1px solid #E5DDD5',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ margin: '0 0 2px 0', color: '#4A3F35', fontSize: 15, fontWeight: 700 }}>Bow Beauty Admin Panel</div>
            <div style={{ margin: 0, color: '#8B7355', fontSize: 12 }}>
              v2.0 • Última actualización: {new Date().toLocaleTimeString('es-ES')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9B8F7E' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: loading ? '#D4B896' : '#8B7355' }} />
              {loading ? 'Cargando...' : 'Sistema activo'}
            </div>
            <div style={{ fontSize: 12, color: '#9B8F7E', display: 'flex', alignItems: 'center', gap: 4 }}>
              {counts.usuarios || 0} usuarios
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
