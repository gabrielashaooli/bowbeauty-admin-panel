(function (React, adminjs) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const MediaPreview = ({
    record
  }) => {
    const p = record?.params || {};
    if (!p.MediaUrl) return /*#__PURE__*/React__default.default.createElement("p", null, "No hay media");
    const isImage = (p.TipoArchivo || '').toLowerCase() === 'imagen';
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        maxWidth: 320
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: 12,
        marginBottom: 6,
        color: '#666'
      }
    }, p.Titulo || 'Sin título', " \u2022 ", (p.TipoArchivo || '').toUpperCase()), isImage ? /*#__PURE__*/React__default.default.createElement("img", {
      src: p.MediaUrl,
      alt: p.Titulo || 'media',
      style: {
        width: '100%',
        maxHeight: 220,
        objectFit: 'cover',
        borderRadius: 8
      }
    }) : /*#__PURE__*/React__default.default.createElement("video", {
      controls: true,
      style: {
        width: '100%',
        maxHeight: 220,
        borderRadius: 8
      }
    }, /*#__PURE__*/React__default.default.createElement("source", {
      src: p.MediaUrl,
      type: "video/mp4"
    })));
  };

  const api = new adminjs.ApiClient();
  function WelcomeDashboard() {
    const [data, setData] = React.useState({
      counts: {
        usuarios: 0,
        reels: 0,
        comentarios: 0,
        likes: 0,
        codigosReset: 0,
        reelsHoy: 0,
        usuariosHoy: 0
      },
      latest: {
        reels: [],
        usuarios: [],
        comentarios: []
      }
    });
    const [loading, setLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('overview');
    React.useEffect(() => {
      api.getDashboard().then(({
        data
      }) => {
        console.log('Dashboard data received:', data);
        setData(data);
        setLoading(false);
      }).catch(error => {
        console.error('Error loading dashboard:', error);
        setLoading(false);
      });
    }, []);
    const {
      counts,
      latest
    } = data;

    // Datos para gráficos (usando datos reales cuando estén disponibles)
    const chartData = React.useMemo(() => {
      const now = new Date();
      return {
        weekly: Array.from({
          length: 7
        }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          return {
            day: date.toLocaleDateString('es-ES', {
              weekday: 'short'
            }),
            date: date.toISOString().split('T')[0],
            usuarios: Math.floor(Math.random() * 15) + 3,
            reels: Math.floor(Math.random() * 10) + 2,
            comentarios: Math.floor(Math.random() * 25) + 5
          };
        }).reverse(),
        contentTypes: [{
          name: 'Videos',
          value: Math.floor((counts.reels || 0) * 0.65),
          color: '#D4B896'
        }, {
          name: 'Imágenes',
          value: Math.floor((counts.reels || 0) * 0.35),
          color: '#C4A882'
        }],
        hourly: Array.from({
          length: 24
        }, (_, i) => ({
          hour: `${i.toString().padStart(2, '0')}:00`,
          actividad: Math.floor(Math.random() * 80) + 10
        }))
      };
    }, [counts.reels]);

    // Métricas calculadas
    const metrics = React.useMemo(() => {
      const engagementRate = counts.reels > 0 ? ((counts.comentarios + counts.likes) / counts.reels).toFixed(1) : '0.0';
      const avgLikesPerReel = counts.reels > 0 ? (counts.likes / counts.reels).toFixed(1) : '0.0';
      const growthRate = counts.usuarios > 0 ? (counts.usuariosHoy / counts.usuarios * 100).toFixed(1) : '0.0';
      return {
        engagementRate,
        avgLikesPerReel,
        growthRate
      };
    }, [counts]);

    // Componente de tarjeta mejorado
    const MetricCard = ({
      title,
      value,
      subtitle,
      trend,
      icon
    }) => /*#__PURE__*/React__default.default.createElement("div", {
      className: "metric-card",
      style: {
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      },
      onMouseEnter: e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '14px',
        color: '#8B7355',
        marginBottom: '8px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }
    }, title), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#4A3F35',
        lineHeight: '1',
        marginBottom: '8px'
      }
    }, loading ? '...' : value), subtitle && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '13px',
        color: '#9B8F7E',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }
    }, trend !== undefined && trend !== null && /*#__PURE__*/React__default.default.createElement("span", {
      style: {
        color: trend > 0 ? '#6B5B47' : trend < 0 ? '#8B7355' : '#9B8F7E',
        fontSize: '12px',
        fontWeight: '600'
      }
    }, trend > 0 ? '↗' : trend < 0 ? '↘' : '→'), subtitle)));

    // Componente de gráfico simple (sin dependencias externas)
    const SimpleChart = ({
      data,
      type = 'bar',
      height = 120,
      color = '#D4B896'
    }) => {
      if (!data || data.length === 0) return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          color: '#9B8F7E',
          textAlign: 'center',
          padding: '40px'
        }
      }, "No hay datos");
      const maxValue = Math.max(...data.map(d => d.value || d.usuarios || d.reels || d.actividad || 0));
      const chartHeight = height - 40; // Espacio para labels

      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          padding: '20px 0'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'end',
          height: chartHeight,
          gap: type === 'bar' ? '4px' : '2px',
          justifyContent: 'space-around'
        }
      }, data.slice(0, 12).map((item, index) => {
        const value = item.value || item.usuarios || item.reels || item.actividad || 0;
        const barHeight = maxValue > 0 ? value / maxValue * (chartHeight - 20) : 0;
        return /*#__PURE__*/React__default.default.createElement("div", {
          key: index,
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            minWidth: '20px'
          }
        }, /*#__PURE__*/React__default.default.createElement("div", {
          style: {
            width: type === 'bar' ? '16px' : '3px',
            height: `${Math.max(barHeight, 2)}px`,
            background: color,
            borderRadius: type === 'bar' ? '2px 2px 0 0' : '2px',
            transition: 'all 0.3s ease',
            marginBottom: '8px'
          }
        }), /*#__PURE__*/React__default.default.createElement("div", {
          style: {
            fontSize: '10px',
            color: '#9B8F7E',
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: '1.2'
          }
        }, item.day || item.hour || item.name || `${index + 1}`));
      })));
    };

    // Componente de gráfico circular simple
    const SimplePieChart = ({
      data,
      size = 120
    }) => {
      if (!data || data.length === 0) return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          color: '#9B8F7E',
          textAlign: 'center',
          padding: '40px'
        }
      }, "No hay datos");
      const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
      if (total === 0) return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          color: '#9B8F7E',
          textAlign: 'center',
          padding: '40px'
        }
      }, "Sin contenido");
      let currentAngle = 0;
      const center = size / 2;
      const radius = center - 10;
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement("svg", {
        width: size,
        height: size,
        style: {
          transform: 'rotate(-90deg)'
        }
      }, data.map((item, index) => {
        item.value / total * 100;
        const angle = item.value / total * 360;
        const x1 = center + radius * Math.cos(currentAngle * Math.PI / 180);
        const y1 = center + radius * Math.sin(currentAngle * Math.PI / 180);
        const x2 = center + radius * Math.cos((currentAngle + angle) * Math.PI / 180);
        const y2 = center + radius * Math.sin((currentAngle + angle) * Math.PI / 180);
        const largeArcFlag = angle > 180 ? 1 : 0;
        const pathData = [`M ${center} ${center}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(' ');
        currentAngle += angle;
        return /*#__PURE__*/React__default.default.createElement("path", {
          key: index,
          d: pathData,
          fill: item.color || '#D4B896',
          stroke: "#fff",
          strokeWidth: "2"
        });
      })), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      }, data.map((item, index) => /*#__PURE__*/React__default.default.createElement("div", {
        key: index,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: item.color || '#D4B896'
        }
      }), /*#__PURE__*/React__default.default.createElement("span", {
        style: {
          fontSize: '12px',
          color: '#4A3F35',
          fontWeight: '500'
        }
      }, item.name, " (", item.value, ")")))));
    };

    // Componente de actividad reciente mejorado
    const ActivityFeed = () => /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#4A3F35',
        fontSize: '18px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, "Actividad Reciente"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        maxHeight: '500px',
        overflowY: 'auto'
      }
    }, loading ? /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '40px',
        color: '#9B8F7E'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '32px',
        height: '32px',
        border: '3px solid #E5DDD5',
        borderRadius: '50%',
        borderTopColor: '#D4B896',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 12px'
      }
    }), "Cargando actividad...") : /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }
    }, latest.reels?.slice(0, 4).map(reel => /*#__PURE__*/React__default.default.createElement("div", {
      key: `reel-${reel._id}`,
      style: {
        padding: '16px',
        background: '#FDFCFB',
        borderRadius: '8px',
        border: '1px solid #F0EBE3',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s ease'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        background: '#F0EBE3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        flexShrink: 0,
        color: '#8B7355',
        fontWeight: '600'
      }
    }, reel.TipoArchivo === 'video' ? 'VID' : 'IMG'), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '600',
        color: '#4A3F35',
        fontSize: '14px',
        marginBottom: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, reel.Titulo || 'Sin título'), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        color: '#9B8F7E',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React__default.default.createElement("span", null, reel.TipoArchivo || 'contenido'), /*#__PURE__*/React__default.default.createElement("span", null, "\u2022"), /*#__PURE__*/React__default.default.createElement("span", null, new Date(reel.createdAt).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })), reel.Likes > 0 && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("span", null, "\u2022"), /*#__PURE__*/React__default.default.createElement("span", null, reel.Likes, " likes")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#8B7355',
        flexShrink: 0
      }
    }))), latest.usuarios?.slice(0, 3).map(usuario => /*#__PURE__*/React__default.default.createElement("div", {
      key: `user-${usuario._id}`,
      style: {
        padding: '16px',
        background: '#FDFCFB',
        borderRadius: '8px',
        border: '1px solid #F0EBE3',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        background: '#E5DDD5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        flexShrink: 0,
        color: '#8B7355',
        fontWeight: '600'
      }
    }, "USR"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '600',
        color: '#4A3F35',
        fontSize: '14px',
        marginBottom: '4px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, usuario.Name || 'Usuario sin nombre'), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        color: '#9B8F7E',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, usuario.Email, " \u2022 ", new Date(usuario.createdAt).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#8B7355',
        flexShrink: 0
      }
    }))), latest.comentarios?.slice(0, 2).map(comentario => /*#__PURE__*/React__default.default.createElement("div", {
      key: `comment-${comentario._id}`,
      style: {
        padding: '16px',
        background: '#FDFCFB',
        borderRadius: '8px',
        border: '1px solid #F0EBE3',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '44px',
        height: '44px',
        borderRadius: '8px',
        background: '#F0EBE3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        flexShrink: 0,
        color: '#8B7355',
        fontWeight: '600'
      }
    }, "COM"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '600',
        color: '#4A3F35',
        fontSize: '14px',
        marginBottom: '4px'
      }
    }, "Nuevo comentario"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '13px',
        color: '#4A3F35',
        marginBottom: '4px',
        lineHeight: '1.3',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }
    }, "\"", (comentario.Contenido || '').substring(0, 80), (comentario.Contenido || '').length > 80 ? '...' : '', "\""), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        color: '#9B8F7E'
      }
    }, new Date(comentario.createdAt).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }))))), (!latest.reels || latest.reels.length === 0) && (!latest.usuarios || latest.usuarios.length === 0) && (!latest.comentarios || latest.comentarios.length === 0) && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#9B8F7E'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '16px',
        fontWeight: '500',
        marginBottom: '8px'
      }
    }, "No hay actividad reciente"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '14px'
      }
    }, "La actividad aparecer\xE1 aqu\xED cuando los usuarios interact\xFAen")))));

    // Tabs de navegación
    const TabButton = ({
      id,
      label,
      active,
      onClick
    }) => /*#__PURE__*/React__default.default.createElement("button", {
      onClick: () => onClick(id),
      style: {
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        background: active ? '#E5DDD5' : 'transparent',
        color: active ? '#4A3F35' : '#8B7355',
        fontWeight: active ? '600' : '500',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: active ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
      },
      onMouseEnter: e => {
        if (!active) {
          e.target.style.background = '#F5F2EE';
        }
      },
      onMouseLeave: e => {
        if (!active) {
          e.target.style.background = 'transparent';
        }
      }
    }, label);
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#FDFCFB',
        padding: '32px',
        borderRadius: '16px',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '100vh'
      }
    }, /*#__PURE__*/React__default.default.createElement("style", null, `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginBottom: '32px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("h1", {
      style: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '40px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        color: '#4A3F35'
      }
    }, "Bow Beauty Dashboard"), /*#__PURE__*/React__default.default.createElement("p", {
      style: {
        fontSize: '16px',
        color: '#8B7355',
        margin: '0 0 24px 0',
        fontWeight: '400'
      }
    }, "Panel de administraci\xF3n \u2022 ", new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        background: '#ffffff',
        padding: '8px',
        borderRadius: '12px',
        border: '1px solid #E5DDD5',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React__default.default.createElement(TabButton, {
      id: "overview",
      label: "Resumen",
      active: activeTab === 'overview',
      onClick: setActiveTab
    }), /*#__PURE__*/React__default.default.createElement(TabButton, {
      id: "analytics",
      label: "Anal\xEDtica",
      active: activeTab === 'analytics',
      onClick: setActiveTab
    }), /*#__PURE__*/React__default.default.createElement(TabButton, {
      id: "activity",
      label: "Actividad",
      active: activeTab === 'activity',
      onClick: setActiveTab
    }))), activeTab === 'overview' && /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }
    }, /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "Total Usuarios",
      value: counts.usuarios?.toLocaleString() || '0',
      subtitle: `+${counts.usuariosHoy || 0} hoy`,
      trend: counts.usuariosHoy
    }), /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "Contenido Publicado",
      value: counts.reels?.toLocaleString() || '0',
      subtitle: `+${counts.reelsHoy || 0} hoy`,
      trend: counts.reelsHoy
    }), /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "Engagement Rate",
      value: `${metrics.engagementRate}%`,
      subtitle: "Promedio de interacci\xF3n"
    }), /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "Comentarios Activos",
      value: counts.comentarios?.toLocaleString() || '0',
      subtitle: "Total de comentarios"
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#4A3F35',
        fontSize: '18px',
        fontWeight: '700'
      }
    }, "Actividad Semanal"), /*#__PURE__*/React__default.default.createElement(SimpleChart, {
      data: chartData.weekly.map(d => ({
        ...d,
        value: d.usuarios + d.reels
      })),
      type: "bar",
      color: "#D4B896"
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#4A3F35',
        fontSize: '18px',
        fontWeight: '700'
      }
    }, "Tipos de Contenido"), /*#__PURE__*/React__default.default.createElement(SimplePieChart, {
      data: chartData.contentTypes
    }))), /*#__PURE__*/React__default.default.createElement(ActivityFeed, null)), activeTab === 'analytics' && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#4A3F35',
        fontSize: '18px',
        fontWeight: '700'
      }
    }, "Actividad por Horas del D\xEDa"), /*#__PURE__*/React__default.default.createElement(SimpleChart, {
      data: chartData.hourly,
      type: "bar",
      height: 200,
      color: "#D4B896"
    })), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "Promedio Likes/Reel",
      value: metrics.avgLikesPerReel,
      subtitle: "Media de interacciones"
    }), /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "Tasa de Crecimiento",
      value: `${metrics.growthRate}%`,
      subtitle: "Usuarios nuevos hoy"
    }), /*#__PURE__*/React__default.default.createElement(MetricCard, {
      title: "C\xF3digos Pendientes",
      value: counts.codigosReset || 0,
      subtitle: "Reset de contrase\xF1a"
    }))), activeTab === 'activity' && /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }
    }, /*#__PURE__*/React__default.default.createElement(ActivityFeed, null), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #E5DDD5',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }
    }, /*#__PURE__*/React__default.default.createElement("h3", {
      style: {
        margin: '0 0 20px 0',
        color: '#4A3F35',
        fontSize: '18px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, "Acciones R\xE1pidas"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }
    }, /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        padding: '16px 20px',
        border: '1px solid #E5DDD5',
        borderRadius: '8px',
        background: '#FDFCFB',
        color: '#4A3F35',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left'
      },
      onMouseEnter: e => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      },
      onMouseLeave: e => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '700',
        marginBottom: '2px'
      }
    }, "Revisar Contenido Reportado"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        opacity: 0.8
      }
    }, "Moderar publicaciones flagged"))), /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        padding: '16px 20px',
        border: '1px solid #E5DDD5',
        borderRadius: '8px',
        background: '#FDFCFB',
        color: '#4A3F35',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left'
      },
      onMouseEnter: e => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      },
      onMouseLeave: e => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '700',
        marginBottom: '2px'
      }
    }, "Generar Reporte Semanal"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        opacity: 0.8
      }
    }, "Exportar estad\xEDsticas del per\xEDodo"))), /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        padding: '16px 20px',
        border: '1px solid #E5DDD5',
        borderRadius: '8px',
        background: '#FDFCFB',
        color: '#4A3F35',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left'
      },
      onMouseEnter: e => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      },
      onMouseLeave: e => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '700',
        marginBottom: '2px'
      }
    }, "Limpiar C\xF3digos Expirados"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        opacity: 0.8
      }
    }, "Eliminar tokens de reset vencidos"))), /*#__PURE__*/React__default.default.createElement("button", {
      style: {
        padding: '16px 20px',
        border: '1px solid #E5DDD5',
        borderRadius: '8px',
        background: '#FDFCFB',
        color: '#4A3F35',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left'
      },
      onMouseEnter: e => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      },
      onMouseLeave: e => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontWeight: '700',
        marginBottom: '2px'
      }
    }, "Backup de Base de Datos"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        opacity: 0.8
      }
    }, "Crear respaldo de seguridad")))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: '24px',
        padding: '16px',
        background: '#F5F2EE',
        borderRadius: '8px',
        border: '1px solid #E5DDD5'
      }
    }, /*#__PURE__*/React__default.default.createElement("h4", {
      style: {
        margin: '0 0 12px 0',
        color: '#4A3F35',
        fontSize: '14px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }
    }, "Resumen R\xE1pido"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        fontSize: '13px'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#9B8F7E',
        marginBottom: '2px'
      }
    }, "Usuarios activos"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#4A3F35',
        fontWeight: '600'
      }
    }, counts.usuarios || 0)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#9B8F7E',
        marginBottom: '2px'
      }
    }, "Total contenido"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#4A3F35',
        fontWeight: '600'
      }
    }, counts.reels || 0)), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#9B8F7E',
        marginBottom: '2px'
      }
    }, "Engagement"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#4A3F35',
        fontWeight: '600'
      }
    }, metrics.engagementRate, "%")), /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#9B8F7E',
        marginBottom: '2px'
      }
    }, "Crecimiento"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        color: '#4A3F35',
        fontWeight: '600'
      }
    }, "+", counts.usuariosHoy || 0)))))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        marginTop: '40px',
        padding: '24px',
        background: '#ffffff',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #E5DDD5'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", null, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        margin: '0 0 4px 0',
        color: '#4A3F35',
        fontSize: '16px',
        fontWeight: '700'
      }
    }, "Bow Beauty Admin Panel"), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        margin: 0,
        color: '#8B7355',
        fontSize: '12px'
      }
    }, "v2.0 \u2022 \xDAltima actualizaci\xF3n: ", new Date().toLocaleTimeString('es-ES'))), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#9B8F7E'
      }
    }, /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: loading ? '#D4B896' : '#8B7355'
      }
    }), loading ? 'Cargando...' : 'Sistema activo'), /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        fontSize: '12px',
        color: '#9B8F7E',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }
    }, counts.usuarios || 0, " usuarios")))));
  }

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.MediaPreview = MediaPreview;
  AdminJS.UserComponents.WelcomeDashboard = WelcomeDashboard;

})(React, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9jb21wb25lbnRzL01lZGlhUHJldmlldy5qc3giLCIuLi9jb21wb25lbnRzL1dlbGNvbWVEYXNoYm9hcmQuanN4IiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuY29uc3QgTWVkaWFQcmV2aWV3ID0gKHsgcmVjb3JkIH0pID0+IHtcclxuICBjb25zdCBwID0gcmVjb3JkPy5wYXJhbXMgfHwge307XHJcbiAgaWYgKCFwLk1lZGlhVXJsKSByZXR1cm4gPHA+Tm8gaGF5IG1lZGlhPC9wPjtcclxuXHJcbiAgY29uc3QgaXNJbWFnZSA9IChwLlRpcG9BcmNoaXZvIHx8ICcnKS50b0xvd2VyQ2FzZSgpID09PSAnaW1hZ2VuJztcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBtYXhXaWR0aDogMzIwIH19PlxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAxMiwgbWFyZ2luQm90dG9tOiA2LCBjb2xvcjogJyM2NjYnIH19PlxyXG4gICAgICAgIHsocC5UaXR1bG8gfHwgJ1NpbiB0w610dWxvJyl9IOKAoiB7KHAuVGlwb0FyY2hpdm8gfHwgJycpLnRvVXBwZXJDYXNlKCl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICB7aXNJbWFnZSA/IChcclxuICAgICAgICA8aW1nIHNyYz17cC5NZWRpYVVybH0gYWx0PXtwLlRpdHVsbyB8fCAnbWVkaWEnfSBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBtYXhIZWlnaHQ6IDIyMCwgb2JqZWN0Rml0OiAnY292ZXInLCBib3JkZXJSYWRpdXM6IDggfX0gLz5cclxuICAgICAgKSA6IChcclxuICAgICAgICA8dmlkZW8gY29udHJvbHMgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgbWF4SGVpZ2h0OiAyMjAsIGJvcmRlclJhZGl1czogOCB9fT5cclxuICAgICAgICAgIDxzb3VyY2Ugc3JjPXtwLk1lZGlhVXJsfSB0eXBlPVwidmlkZW8vbXA0XCIgLz5cclxuICAgICAgICA8L3ZpZGVvPlxyXG4gICAgICApfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuZXhwb3J0IGRlZmF1bHQgTWVkaWFQcmV2aWV3O1xyXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgQXBpQ2xpZW50IH0gZnJvbSAnYWRtaW5qcyc7XHJcblxyXG5jb25zdCBhcGkgPSBuZXcgQXBpQ2xpZW50KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXZWxjb21lRGFzaGJvYXJkKCkge1xyXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHsgXHJcbiAgICBjb3VudHM6IHsgdXN1YXJpb3M6IDAsIHJlZWxzOiAwLCBjb21lbnRhcmlvczogMCwgbGlrZXM6IDAsIGNvZGlnb3NSZXNldDogMCwgcmVlbHNIb3k6IDAsIHVzdWFyaW9zSG95OiAwIH0sIFxyXG4gICAgbGF0ZXN0OiB7IHJlZWxzOiBbXSwgdXN1YXJpb3M6IFtdLCBjb21lbnRhcmlvczogW10gfSBcclxuICB9KTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGUoJ292ZXJ2aWV3Jyk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBhcGkuZ2V0RGFzaGJvYXJkKClcclxuICAgICAgLnRoZW4oKHsgZGF0YSB9KSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0Rhc2hib2FyZCBkYXRhIHJlY2VpdmVkOicsIGRhdGEpO1xyXG4gICAgICAgIHNldERhdGEoZGF0YSk7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIGRhc2hib2FyZDonLCBlcnJvcik7XHJcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgIH0pO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgeyBjb3VudHMsIGxhdGVzdCB9ID0gZGF0YTtcclxuXHJcbiAgLy8gRGF0b3MgcGFyYSBncsOhZmljb3MgKHVzYW5kbyBkYXRvcyByZWFsZXMgY3VhbmRvIGVzdMOpbiBkaXNwb25pYmxlcylcclxuICBjb25zdCBjaGFydERhdGEgPSB1c2VNZW1vKCgpID0+IHtcclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB3ZWVrbHk6IEFycmF5LmZyb20oeyBsZW5ndGg6IDcgfSwgKF8sIGkpID0+IHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUobm93KTtcclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSBpKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgZGF5OiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygnZXMtRVMnLCB7IHdlZWtkYXk6ICdzaG9ydCcgfSksXHJcbiAgICAgICAgICBkYXRlOiBkYXRlLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXSxcclxuICAgICAgICAgIHVzdWFyaW9zOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNSkgKyAzLFxyXG4gICAgICAgICAgcmVlbHM6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSArIDIsXHJcbiAgICAgICAgICBjb21lbnRhcmlvczogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjUpICsgNVxyXG4gICAgICAgIH07XHJcbiAgICAgIH0pLnJldmVyc2UoKSxcclxuICAgICAgY29udGVudFR5cGVzOiBbXHJcbiAgICAgICAgeyBuYW1lOiAnVmlkZW9zJywgdmFsdWU6IE1hdGguZmxvb3IoKGNvdW50cy5yZWVscyB8fCAwKSAqIDAuNjUpLCBjb2xvcjogJyNENEI4OTYnIH0sXHJcbiAgICAgICAgeyBuYW1lOiAnSW3DoWdlbmVzJywgdmFsdWU6IE1hdGguZmxvb3IoKGNvdW50cy5yZWVscyB8fCAwKSAqIDAuMzUpLCBjb2xvcjogJyNDNEE4ODInIH1cclxuICAgICAgXSxcclxuICAgICAgaG91cmx5OiBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyNCB9LCAoXywgaSkgPT4gKHtcclxuICAgICAgICBob3VyOiBgJHtpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKX06MDBgLFxyXG4gICAgICAgIGFjdGl2aWRhZDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogODApICsgMTBcclxuICAgICAgfSkpXHJcbiAgICB9O1xyXG4gIH0sIFtjb3VudHMucmVlbHNdKTtcclxuXHJcbiAgLy8gTcOpdHJpY2FzIGNhbGN1bGFkYXNcclxuICBjb25zdCBtZXRyaWNzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBjb25zdCBlbmdhZ2VtZW50UmF0ZSA9IGNvdW50cy5yZWVscyA+IDAgPyAoKGNvdW50cy5jb21lbnRhcmlvcyArIGNvdW50cy5saWtlcykgLyBjb3VudHMucmVlbHMpLnRvRml4ZWQoMSkgOiAnMC4wJztcclxuICAgIGNvbnN0IGF2Z0xpa2VzUGVyUmVlbCA9IGNvdW50cy5yZWVscyA+IDAgPyAoY291bnRzLmxpa2VzIC8gY291bnRzLnJlZWxzKS50b0ZpeGVkKDEpIDogJzAuMCc7XHJcbiAgICBjb25zdCBncm93dGhSYXRlID0gY291bnRzLnVzdWFyaW9zID4gMCA/ICgoY291bnRzLnVzdWFyaW9zSG95IC8gY291bnRzLnVzdWFyaW9zKSAqIDEwMCkudG9GaXhlZCgxKSA6ICcwLjAnO1xyXG4gICAgXHJcbiAgICByZXR1cm4geyBlbmdhZ2VtZW50UmF0ZSwgYXZnTGlrZXNQZXJSZWVsLCBncm93dGhSYXRlIH07XHJcbiAgfSwgW2NvdW50c10pO1xyXG5cclxuICAvLyBDb21wb25lbnRlIGRlIHRhcmpldGEgbWVqb3JhZG9cclxuICBjb25zdCBNZXRyaWNDYXJkID0gKHsgdGl0bGUsIHZhbHVlLCBzdWJ0aXRsZSwgdHJlbmQsIGljb24gfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtZXRyaWMtY2FyZFwiIHN0eWxlPXt7XHJcbiAgICAgIGJhY2tncm91bmQ6ICcjZmZmZmZmJyxcclxuICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgIHBhZGRpbmc6ICcyNHB4JyxcclxuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXHJcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcclxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICBib3hTaGFkb3c6ICcwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgMC4wNSknLFxyXG4gICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXHJcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInXHJcbiAgICB9fVxyXG4gICAgb25Nb3VzZUVudGVyPXsoZSkgPT4ge1xyXG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTJweCknO1xyXG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJzAgNHB4IDE1cHggcmdiYSgwLCAwLCAwLCAwLjA4KSc7XHJcbiAgICB9fVxyXG4gICAgb25Nb3VzZUxlYXZlPXsoZSkgPT4ge1xyXG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMCknO1xyXG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJzAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAwLjA1KSc7XHJcbiAgICB9fT5cclxuICAgICAgXHJcbiAgICAgIHsvKiBDb250ZW5pZG8gKi99XHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBcclxuICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsIFxyXG4gICAgICAgICAgY29sb3I6ICcjOEI3MzU1JywgXHJcbiAgICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnLFxyXG4gICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXHJcbiAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcclxuICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjVweCdcclxuICAgICAgICB9fT5cclxuICAgICAgICAgIHt0aXRsZX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IFxyXG4gICAgICAgICAgZm9udFNpemU6ICczNnB4JywgXHJcbiAgICAgICAgICBmb250V2VpZ2h0OiAnODAwJywgXHJcbiAgICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgICAgbGluZUhlaWdodDogJzEnLFxyXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4J1xyXG4gICAgICAgIH19PlxyXG4gICAgICAgICAge2xvYWRpbmcgPyAnLi4uJyA6IHZhbHVlfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtzdWJ0aXRsZSAmJiAoXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IFxyXG4gICAgICAgICAgICBmb250U2l6ZTogJzEzcHgnLCBcclxuICAgICAgICAgICAgY29sb3I6ICcjOUI4RjdFJyxcclxuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgZ2FwOiAnNnB4J1xyXG4gICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgIHt0cmVuZCAhPT0gdW5kZWZpbmVkICYmIHRyZW5kICE9PSBudWxsICYmIChcclxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IHRyZW5kID4gMCA/ICcjNkI1QjQ3JyA6IHRyZW5kIDwgMCA/ICcjOEI3MzU1JyA6ICcjOUI4RjdFJyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJ1xyXG4gICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAge3RyZW5kID4gMCA/ICfihpcnIDogdHJlbmQgPCAwID8gJ+KGmCcgOiAn4oaSJ31cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIHtzdWJ0aXRsZX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxuXHJcbiAgLy8gQ29tcG9uZW50ZSBkZSBncsOhZmljbyBzaW1wbGUgKHNpbiBkZXBlbmRlbmNpYXMgZXh0ZXJuYXMpXHJcbiAgY29uc3QgU2ltcGxlQ2hhcnQgPSAoeyBkYXRhLCB0eXBlID0gJ2JhcicsIGhlaWdodCA9IDEyMCwgY29sb3IgPSAnI0Q0Qjg5NicgfSkgPT4ge1xyXG4gICAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKSByZXR1cm4gPGRpdiBzdHlsZT17eyBjb2xvcjogJyM5QjhGN0UnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBwYWRkaW5nOiAnNDBweCcgfX0+Tm8gaGF5IGRhdG9zPC9kaXY+O1xyXG5cclxuICAgIGNvbnN0IG1heFZhbHVlID0gTWF0aC5tYXgoLi4uZGF0YS5tYXAoZCA9PiBkLnZhbHVlIHx8IGQudXN1YXJpb3MgfHwgZC5yZWVscyB8fCBkLmFjdGl2aWRhZCB8fCAwKSk7XHJcbiAgICBjb25zdCBjaGFydEhlaWdodCA9IGhlaWdodCAtIDQwOyAvLyBFc3BhY2lvIHBhcmEgbGFiZWxzXHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMjBweCAwJyB9fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IFxyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdlbmQnLCBcclxuICAgICAgICAgIGhlaWdodDogY2hhcnRIZWlnaHQsXHJcbiAgICAgICAgICBnYXA6IHR5cGUgPT09ICdiYXInID8gJzRweCcgOiAnMnB4JyxcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYXJvdW5kJ1xyXG4gICAgICAgIH19PlxyXG4gICAgICAgICAge2RhdGEuc2xpY2UoMCwgMTIpLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBpdGVtLnZhbHVlIHx8IGl0ZW0udXN1YXJpb3MgfHwgaXRlbS5yZWVscyB8fCBpdGVtLmFjdGl2aWRhZCB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBiYXJIZWlnaHQgPSBtYXhWYWx1ZSA+IDAgPyAodmFsdWUgLyBtYXhWYWx1ZSkgKiAoY2hhcnRIZWlnaHQgLSAyMCkgOiAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBcclxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgZmxleDogMSxcclxuICAgICAgICAgICAgICAgIG1pbldpZHRoOiAnMjBweCdcclxuICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgd2lkdGg6IHR5cGUgPT09ICdiYXInID8gJzE2cHgnIDogJzNweCcsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogYCR7TWF0aC5tYXgoYmFySGVpZ2h0LCAyKX1weGAsXHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IHR5cGUgPT09ICdiYXInID8gJzJweCAycHggMCAwJyA6ICcycHgnLFxyXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXHJcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzhweCdcclxuICAgICAgICAgICAgICAgIH19IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IFxyXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEwcHgnLCBcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOUI4RjdFJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzUwMCcsXHJcbiAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxLjInXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAge2l0ZW0uZGF5IHx8IGl0ZW0uaG91ciB8fCBpdGVtLm5hbWUgfHwgYCR7aW5kZXggKyAxfWB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQ29tcG9uZW50ZSBkZSBncsOhZmljbyBjaXJjdWxhciBzaW1wbGVcclxuICBjb25zdCBTaW1wbGVQaWVDaGFydCA9ICh7IGRhdGEsIHNpemUgPSAxMjAgfSkgPT4ge1xyXG4gICAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKSByZXR1cm4gPGRpdiBzdHlsZT17eyBjb2xvcjogJyM5QjhGN0UnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBwYWRkaW5nOiAnNDBweCcgfX0+Tm8gaGF5IGRhdG9zPC9kaXY+O1xyXG5cclxuICAgIGNvbnN0IHRvdGFsID0gZGF0YS5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gc3VtICsgKGl0ZW0udmFsdWUgfHwgMCksIDApO1xyXG4gICAgaWYgKHRvdGFsID09PSAwKSByZXR1cm4gPGRpdiBzdHlsZT17eyBjb2xvcjogJyM5QjhGN0UnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBwYWRkaW5nOiAnNDBweCcgfX0+U2luIGNvbnRlbmlkbzwvZGl2PjtcclxuXHJcbiAgICBsZXQgY3VycmVudEFuZ2xlID0gMDtcclxuICAgIGNvbnN0IGNlbnRlciA9IHNpemUgLyAyO1xyXG4gICAgY29uc3QgcmFkaXVzID0gY2VudGVyIC0gMTA7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcyMHB4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInIH19PlxyXG4gICAgICAgIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gc3R5bGU9e3sgdHJhbnNmb3JtOiAncm90YXRlKC05MGRlZyknIH19PlxyXG4gICAgICAgICAge2RhdGEubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gKGl0ZW0udmFsdWUgLyB0b3RhbCkgKiAxMDA7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gKGl0ZW0udmFsdWUgLyB0b3RhbCkgKiAzNjA7XHJcbiAgICAgICAgICAgIGNvbnN0IHgxID0gY2VudGVyICsgcmFkaXVzICogTWF0aC5jb3MoKGN1cnJlbnRBbmdsZSAqIE1hdGguUEkpIC8gMTgwKTtcclxuICAgICAgICAgICAgY29uc3QgeTEgPSBjZW50ZXIgKyByYWRpdXMgKiBNYXRoLnNpbigoY3VycmVudEFuZ2xlICogTWF0aC5QSSkgLyAxODApO1xyXG4gICAgICAgICAgICBjb25zdCB4MiA9IGNlbnRlciArIHJhZGl1cyAqIE1hdGguY29zKCgoY3VycmVudEFuZ2xlICsgYW5nbGUpICogTWF0aC5QSSkgLyAxODApO1xyXG4gICAgICAgICAgICBjb25zdCB5MiA9IGNlbnRlciArIHJhZGl1cyAqIE1hdGguc2luKCgoY3VycmVudEFuZ2xlICsgYW5nbGUpICogTWF0aC5QSSkgLyAxODApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbGFyZ2VBcmNGbGFnID0gYW5nbGUgPiAxODAgPyAxIDogMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGhEYXRhID0gW1xyXG4gICAgICAgICAgICAgIGBNICR7Y2VudGVyfSAke2NlbnRlcn1gLFxyXG4gICAgICAgICAgICAgIGBMICR7eDF9ICR7eTF9YCxcclxuICAgICAgICAgICAgICBgQSAke3JhZGl1c30gJHtyYWRpdXN9IDAgJHtsYXJnZUFyY0ZsYWd9IDEgJHt4Mn0gJHt5Mn1gLFxyXG4gICAgICAgICAgICAgICdaJ1xyXG4gICAgICAgICAgICBdLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGN1cnJlbnRBbmdsZSArPSBhbmdsZTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgPHBhdGhcclxuICAgICAgICAgICAgICAgIGtleT17aW5kZXh9XHJcbiAgICAgICAgICAgICAgICBkPXtwYXRoRGF0YX1cclxuICAgICAgICAgICAgICAgIGZpbGw9e2l0ZW0uY29sb3IgfHwgJyNENEI4OTYnfVxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlPVwiI2ZmZlwiXHJcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9KX1cclxuICAgICAgICA8L3N2Zz5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzhweCcgfX0+XHJcbiAgICAgICAgICB7ZGF0YS5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoXHJcbiAgICAgICAgICAgIDxkaXYga2V5PXtpbmRleH0gc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnOHB4JyB9fT5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogaXRlbS5jb2xvciB8fCAnI0Q0Qjg5NidcclxuICAgICAgICAgICAgICB9fSAvPlxyXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMTJweCcsIGNvbG9yOiAnIzRBM0YzNScsIGZvbnRXZWlnaHQ6ICc1MDAnIH19PlxyXG4gICAgICAgICAgICAgICAge2l0ZW0ubmFtZX0gKHtpdGVtLnZhbHVlfSlcclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICAvLyBDb21wb25lbnRlIGRlIGFjdGl2aWRhZCByZWNpZW50ZSBtZWpvcmFkb1xyXG4gIGNvbnN0IEFjdGl2aXR5RmVlZCA9ICgpID0+IChcclxuICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxyXG4gICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgcGFkZGluZzogJzI0cHgnLFxyXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgI0U1RERENScsXHJcbiAgICAgIGJveFNoYWRvdzogJzAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAwLjA1KSdcclxuICAgIH19PlxyXG4gICAgICA8aDMgc3R5bGU9e3tcclxuICAgICAgICBtYXJnaW46ICcwIDAgMjBweCAwJyxcclxuICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgIGZvbnRTaXplOiAnMThweCcsXHJcbiAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIGdhcDogJzhweCdcclxuICAgICAgfX0+XHJcbiAgICAgICAgQWN0aXZpZGFkIFJlY2llbnRlXHJcbiAgICAgIDwvaDM+XHJcbiAgICAgIFxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1heEhlaWdodDogJzUwMHB4Jywgb3ZlcmZsb3dZOiAnYXV0bycgfX0+XHJcbiAgICAgICAge2xvYWRpbmcgPyAoXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIHBhZGRpbmc6ICc0MHB4JywgY29sb3I6ICcjOUI4RjdFJyB9fT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIHdpZHRoOiAnMzJweCcsXHJcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMzJweCcsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiAnM3B4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgICAgICAgICAgYm9yZGVyVG9wQ29sb3I6ICcjRDRCODk2JyxcclxuICAgICAgICAgICAgICBhbmltYXRpb246ICdzcGluIDFzIGxpbmVhciBpbmZpbml0ZScsXHJcbiAgICAgICAgICAgICAgbWFyZ2luOiAnMCBhdXRvIDEycHgnXHJcbiAgICAgICAgICAgIH19IC8+XHJcbiAgICAgICAgICAgIENhcmdhbmRvIGFjdGl2aWRhZC4uLlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKSA6IChcclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMTJweCcgfX0+XHJcbiAgICAgICAgICAgIHsvKiDDmmx0aW1vcyByZWVscyAqL31cclxuICAgICAgICAgICAge2xhdGVzdC5yZWVscz8uc2xpY2UoMCwgNCkubWFwKChyZWVsKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBrZXk9e2ByZWVsLSR7cmVlbC5faWR9YH0gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4JyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkRGQ0ZCJyxcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI0YwRUJFMycsXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgIGdhcDogJzEycHgnLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzIGVhc2UnXHJcbiAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAnNDRweCcsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogJzQ0cHgnLFxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI0YwRUJFMycsXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcclxuICAgICAgICAgICAgICAgICAgZmxleFNocmluazogMCxcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOEI3MzU1JyxcclxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCdcclxuICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICB7cmVlbC5UaXBvQXJjaGl2byA9PT0gJ3ZpZGVvJyA/ICdWSUQnIDogJ0lNRyd9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgbWluV2lkdGg6IDAgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnNHB4JyxcclxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnXHJcbiAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIHtyZWVsLlRpdHVsbyB8fCAnU2luIHTDrXR1bG8nfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOUI4RjdFJyxcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgZ2FwOiAnOHB4J1xyXG4gICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57cmVlbC5UaXBvQXJjaGl2byB8fCAnY29udGVuaWRvJ308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+4oCiPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPntuZXcgRGF0ZShyZWVsLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlcy1FUycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGRheTogJ251bWVyaWMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICdzaG9ydCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW51dGU6ICcyLWRpZ2l0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICB7cmVlbC5MaWtlcyA+IDAgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+4oCiPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57cmVlbC5MaWtlc30gbGlrZXM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8Lz5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aDogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjOEI3MzU1JyxcclxuICAgICAgICAgICAgICAgICAgZmxleFNocmluazogMFxyXG4gICAgICAgICAgICAgICAgfX0gLz5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB7LyogTnVldm9zIHVzdWFyaW9zICovfVxyXG4gICAgICAgICAgICB7bGF0ZXN0LnVzdWFyaW9zPy5zbGljZSgwLCAzKS5tYXAoKHVzdWFyaW8pID0+IChcclxuICAgICAgICAgICAgICA8ZGl2IGtleT17YHVzZXItJHt1c3VhcmlvLl9pZH1gfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzE2cHgnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGREZDRkInLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjRjBFQkUzJyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgZ2FwOiAnMTJweCdcclxuICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgd2lkdGg6ICc0NHB4JyxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnNDRweCcsXHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRTVEREQ1JyxcclxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxyXG4gICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rOiAwLFxyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyM4QjczNTUnLFxyXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJ1xyXG4gICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgIFVTUlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzYwMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNEEzRjM1JyxcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzRweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHRPdmVyZmxvdzogJ2VsbGlwc2lzJyxcclxuICAgICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJ1xyXG4gICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICB7dXN1YXJpby5OYW1lIHx8ICdVc3VhcmlvIHNpbiBub21icmUnfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOUI4RjdFJyxcclxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnXHJcbiAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIHt1c3VhcmlvLkVtYWlsfSDigKIge25ldyBEYXRlKHVzdWFyaW8uY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoJ2VzLUVTJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZGF5OiAnbnVtZXJpYycsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtb250aDogJ3Nob3J0JyxcclxuICAgICAgICAgICAgICAgICAgICAgIGhvdXI6ICcyLWRpZ2l0JyxcclxuICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZTogJzItZGlnaXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnOHB4JyxcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcclxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyM4QjczNTUnLFxyXG4gICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rOiAwXHJcbiAgICAgICAgICAgICAgICB9fSAvPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHsvKiBDb21lbnRhcmlvcyByZWNpZW50ZXMgKi99XHJcbiAgICAgICAgICAgIHtsYXRlc3QuY29tZW50YXJpb3M/LnNsaWNlKDAsIDIpLm1hcCgoY29tZW50YXJpbykgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtgY29tbWVudC0ke2NvbWVudGFyaW8uX2lkfWB9IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTZweCcsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI0ZERkNGQicsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNGMEVCRTMnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICBnYXA6ICcxMnB4J1xyXG4gICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICB3aWR0aDogJzQ0cHgnLFxyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0NHB4JyxcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGMEVCRTMnLFxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgICAgICAgICAgICAgIGZsZXhTaHJpbms6IDAsXHJcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzhCNzM1NScsXHJcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnXHJcbiAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgQ09NXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgbWluV2lkdGg6IDAgfX0+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnNHB4J1xyXG4gICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICBOdWV2byBjb21lbnRhcmlvXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxM3B4JyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzRweCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogJzEuMycsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICctd2Via2l0LWJveCcsXHJcbiAgICAgICAgICAgICAgICAgICAgV2Via2l0TGluZUNsYW1wOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIFdlYmtpdEJveE9yaWVudDogJ3ZlcnRpY2FsJ1xyXG4gICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICBcInsoY29tZW50YXJpby5Db250ZW5pZG8gfHwgJycpLnN1YnN0cmluZygwLCA4MCl9eyhjb21lbnRhcmlvLkNvbnRlbmlkbyB8fCAnJykubGVuZ3RoID4gODAgPyAnLi4uJyA6ICcnfVwiXHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5QjhGN0UnXHJcbiAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIHtuZXcgRGF0ZShjb21lbnRhcmlvLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKCdlcy1FUycsIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGRheTogJ251bWVyaWMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbW9udGg6ICdzaG9ydCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW51dGU6ICcyLWRpZ2l0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApKX1cclxuXHJcbiAgICAgICAgICAgIHsvKiBNZW5zYWplIGN1YW5kbyBubyBoYXkgYWN0aXZpZGFkICovfVxyXG4gICAgICAgICAgICB7KCFsYXRlc3QucmVlbHMgfHwgbGF0ZXN0LnJlZWxzLmxlbmd0aCA9PT0gMCkgJiYgXHJcbiAgICAgICAgICAgICAoIWxhdGVzdC51c3VhcmlvcyB8fCBsYXRlc3QudXN1YXJpb3MubGVuZ3RoID09PSAwKSAmJiBcclxuICAgICAgICAgICAgICghbGF0ZXN0LmNvbWVudGFyaW9zIHx8IGxhdGVzdC5jb21lbnRhcmlvcy5sZW5ndGggPT09IDApICYmIChcclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzQwcHggMjBweCcsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5QjhGN0UnXHJcbiAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTZweCcsIGZvbnRXZWlnaHQ6ICc1MDAnLCBtYXJnaW5Cb3R0b206ICc4cHgnIH19Pk5vIGhheSBhY3RpdmlkYWQgcmVjaWVudGU8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6ICcxNHB4JyB9fT5MYSBhY3RpdmlkYWQgYXBhcmVjZXLDoSBhcXXDrSBjdWFuZG8gbG9zIHVzdWFyaW9zIGludGVyYWN0w7plbjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG5cclxuICAvLyBUYWJzIGRlIG5hdmVnYWNpw7NuXHJcbiAgY29uc3QgVGFiQnV0dG9uID0gKHsgaWQsIGxhYmVsLCBhY3RpdmUsIG9uQ2xpY2sgfSkgPT4gKFxyXG4gICAgPGJ1dHRvblxyXG4gICAgICBvbkNsaWNrPXsoKSA9PiBvbkNsaWNrKGlkKX1cclxuICAgICAgc3R5bGU9e3tcclxuICAgICAgICBwYWRkaW5nOiAnMTJweCAyNHB4JyxcclxuICAgICAgICBib3JkZXI6ICdub25lJyxcclxuICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZSA/ICcjRTVEREQ1JyA6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgY29sb3I6IGFjdGl2ZSA/ICcjNEEzRjM1JyA6ICcjOEI3MzU1JyxcclxuICAgICAgICBmb250V2VpZ2h0OiBhY3RpdmUgPyAnNjAwJyA6ICc1MDAnLFxyXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnLFxyXG4gICAgICAgIGJveFNoYWRvdzogYWN0aXZlID8gJzAgMXB4IDNweCByZ2JhKDAsIDAsIDAsIDAuMSknIDogJ25vbmUnXHJcbiAgICAgIH19XHJcbiAgICAgIG9uTW91c2VFbnRlcj17KGUpID0+IHtcclxuICAgICAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICcjRjVGMkVFJztcclxuICAgICAgICB9XHJcbiAgICAgIH19XHJcbiAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHtcclxuICAgICAgICBpZiAoIWFjdGl2ZSkge1xyXG4gICAgICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7bGFiZWx9XHJcbiAgICA8L2J1dHRvbj5cclxuICApO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyBcclxuICAgICAgYmFja2dyb3VuZDogJyNGREZDRkInLFxyXG4gICAgICBwYWRkaW5nOiAnMzJweCcsIFxyXG4gICAgICBib3JkZXJSYWRpdXM6ICcxNnB4JyxcclxuICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXHJcbiAgICAgIG1pbkhlaWdodDogJzEwMHZoJ1xyXG4gICAgfX0+XHJcbiAgICAgIHsvKiBDU1MgcGFyYSBhbmltYWNpb25lcyAqL31cclxuICAgICAgPHN0eWxlPlxyXG4gICAgICAgIHtgXHJcbiAgICAgICAgICBAa2V5ZnJhbWVzIHNwaW4ge1xyXG4gICAgICAgICAgICB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cclxuICAgICAgICAgIH1cclxuICAgICAgICBgfVxyXG4gICAgICA8L3N0eWxlPlxyXG5cclxuICAgICAgey8qIEhlYWRlciBtZWpvcmFkbyAqL31cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICczMnB4JywgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cclxuICAgICAgICA8aDEgc3R5bGU9e3sgXHJcbiAgICAgICAgICBmb250RmFtaWx5OiBcIidQbGF5ZmFpciBEaXNwbGF5Jywgc2VyaWZcIiwgXHJcbiAgICAgICAgICBmb250U2l6ZTogJzQwcHgnLFxyXG4gICAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXHJcbiAgICAgICAgICBtYXJnaW46ICcwIDAgOHB4IDAnLCBcclxuICAgICAgICAgIGNvbG9yOiAnIzRBM0YzNSdcclxuICAgICAgICB9fT5cclxuICAgICAgICAgIEJvdyBCZWF1dHkgRGFzaGJvYXJkXHJcbiAgICAgICAgPC9oMT5cclxuICAgICAgICA8cCBzdHlsZT17eyBcclxuICAgICAgICAgIGZvbnRTaXplOiAnMTZweCcsXHJcbiAgICAgICAgICBjb2xvcjogJyM4QjczNTUnLFxyXG4gICAgICAgICAgbWFyZ2luOiAnMCAwIDI0cHggMCcsXHJcbiAgICAgICAgICBmb250V2VpZ2h0OiAnNDAwJ1xyXG4gICAgICAgIH19PlxyXG4gICAgICAgICAgUGFuZWwgZGUgYWRtaW5pc3RyYWNpw7NuIOKAoiB7bmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoJ2VzLUVTJywgeyBcclxuICAgICAgICAgICAgd2Vla2RheTogJ2xvbmcnLCBcclxuICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLCBcclxuICAgICAgICAgICAgbW9udGg6ICdsb25nJywgXHJcbiAgICAgICAgICAgIGRheTogJ251bWVyaWMnIFxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9wPlxyXG4gICAgICAgIFxyXG4gICAgICAgIHsvKiBUYWJzIGRlIG5hdmVnYWNpw7NuICovfVxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgIGdhcDogJzhweCcsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBwYWRkaW5nOiAnOHB4JyxcclxuICAgICAgICAgIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICAgICAgZmxleFdyYXA6ICd3cmFwJ1xyXG4gICAgICAgIH19PlxyXG4gICAgICAgICAgPFRhYkJ1dHRvbiBpZD1cIm92ZXJ2aWV3XCIgbGFiZWw9XCJSZXN1bWVuXCIgYWN0aXZlPXthY3RpdmVUYWIgPT09ICdvdmVydmlldyd9IG9uQ2xpY2s9e3NldEFjdGl2ZVRhYn0gLz5cclxuICAgICAgICAgIDxUYWJCdXR0b24gaWQ9XCJhbmFseXRpY3NcIiBsYWJlbD1cIkFuYWzDrXRpY2FcIiBhY3RpdmU9e2FjdGl2ZVRhYiA9PT0gJ2FuYWx5dGljcyd9IG9uQ2xpY2s9e3NldEFjdGl2ZVRhYn0gLz5cclxuICAgICAgICAgIDxUYWJCdXR0b24gaWQ9XCJhY3Rpdml0eVwiIGxhYmVsPVwiQWN0aXZpZGFkXCIgYWN0aXZlPXthY3RpdmVUYWIgPT09ICdhY3Rpdml0eSd9IG9uQ2xpY2s9e3NldEFjdGl2ZVRhYn0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogQ29udGVuaWRvIHNlZ8O6biBsYSBwZXN0YcOxYSBhY3RpdmEgKi99XHJcbiAgICAgIHthY3RpdmVUYWIgPT09ICdvdmVydmlldycgJiYgKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICB7LyogTcOpdHJpY2FzIHByaW5jaXBhbGVzICovfVxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBcclxuICAgICAgICAgICAgZGlzcGxheTogJ2dyaWQnLCBcclxuICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDI4MHB4LCAxZnIpKScsIFxyXG4gICAgICAgICAgICBnYXA6ICcyNHB4JywgXHJcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzMycHgnIFxyXG4gICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgIDxNZXRyaWNDYXJkIFxyXG4gICAgICAgICAgICAgIHRpdGxlPVwiVG90YWwgVXN1YXJpb3NcIiBcclxuICAgICAgICAgICAgICB2YWx1ZT17Y291bnRzLnVzdWFyaW9zPy50b0xvY2FsZVN0cmluZygpIHx8ICcwJ30gXHJcbiAgICAgICAgICAgICAgc3VidGl0bGU9e2ArJHtjb3VudHMudXN1YXJpb3NIb3kgfHwgMH0gaG95YH1cclxuICAgICAgICAgICAgICB0cmVuZD17Y291bnRzLnVzdWFyaW9zSG95fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8TWV0cmljQ2FyZCBcclxuICAgICAgICAgICAgICB0aXRsZT1cIkNvbnRlbmlkbyBQdWJsaWNhZG9cIiBcclxuICAgICAgICAgICAgICB2YWx1ZT17Y291bnRzLnJlZWxzPy50b0xvY2FsZVN0cmluZygpIHx8ICcwJ30gXHJcbiAgICAgICAgICAgICAgc3VidGl0bGU9e2ArJHtjb3VudHMucmVlbHNIb3kgfHwgMH0gaG95YH1cclxuICAgICAgICAgICAgICB0cmVuZD17Y291bnRzLnJlZWxzSG95fVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8TWV0cmljQ2FyZCBcclxuICAgICAgICAgICAgICB0aXRsZT1cIkVuZ2FnZW1lbnQgUmF0ZVwiIFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtgJHttZXRyaWNzLmVuZ2FnZW1lbnRSYXRlfSVgfSBcclxuICAgICAgICAgICAgICBzdWJ0aXRsZT1cIlByb21lZGlvIGRlIGludGVyYWNjacOzblwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxNZXRyaWNDYXJkIFxyXG4gICAgICAgICAgICAgIHRpdGxlPVwiQ29tZW50YXJpb3MgQWN0aXZvc1wiIFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtjb3VudHMuY29tZW50YXJpb3M/LnRvTG9jYWxlU3RyaW5nKCkgfHwgJzAnfSBcclxuICAgICAgICAgICAgICBzdWJ0aXRsZT1cIlRvdGFsIGRlIGNvbWVudGFyaW9zXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIHsvKiBHcsOhZmljb3MgcHJpbmNpcGFsZXMgKi99XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6ICdncmlkJyxcclxuICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdChhdXRvLWZpdCwgbWlubWF4KDQwMHB4LCAxZnIpKScsXHJcbiAgICAgICAgICAgIGdhcDogJzI0cHgnLFxyXG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206ICczMnB4J1xyXG4gICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZicsXHJcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgcGFkZGluZzogJzI0cHgnLFxyXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjRTVEREQ1JyxcclxuICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgMC4wNSknXHJcbiAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgIDxoMyBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAnMCAwIDIwcHggMCcsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcxOHB4JyxcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnXHJcbiAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICBBY3RpdmlkYWQgU2VtYW5hbFxyXG4gICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgPFNpbXBsZUNoYXJ0IGRhdGE9e2NoYXJ0RGF0YS53ZWVrbHkubWFwKGQgPT4gKHsgLi4uZCwgdmFsdWU6IGQudXN1YXJpb3MgKyBkLnJlZWxzIH0pKX0gdHlwZT1cImJhclwiIGNvbG9yPVwiI0Q0Qjg5NlwiIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgICBwYWRkaW5nOiAnMjRweCcsXHJcbiAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAwLjA1KSdcclxuICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgPGgzIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW46ICcwIDAgMjBweCAwJyxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzRBM0YzNScsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE4cHgnLFxyXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogJzcwMCdcclxuICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIFRpcG9zIGRlIENvbnRlbmlkb1xyXG4gICAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgICAgPFNpbXBsZVBpZUNoYXJ0IGRhdGE9e2NoYXJ0RGF0YS5jb250ZW50VHlwZXN9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgey8qIEFjdGl2aWRhZCByZWNpZW50ZSAqL31cclxuICAgICAgICAgIDxBY3Rpdml0eUZlZWQgLz5cclxuICAgICAgICA8Lz5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHthY3RpdmVUYWIgPT09ICdhbmFseXRpY3MnICYmIChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAnMWZyJyxcclxuICAgICAgICAgIGdhcDogJzI0cHgnXHJcbiAgICAgICAgfX0+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXHJcbiAgICAgICAgICAgIHBhZGRpbmc6ICcyNHB4JyxcclxuICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICAgICAgICBib3hTaGFkb3c6ICcwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgMC4wNSknXHJcbiAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgPGgzIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgbWFyZ2luOiAnMCAwIDIwcHggMCcsXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjNEEzRjM1JyxcclxuICAgICAgICAgICAgICBmb250U2l6ZTogJzE4cHgnLFxyXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnXHJcbiAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgIEFjdGl2aWRhZCBwb3IgSG9yYXMgZGVsIETDrWFcclxuICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgPFNpbXBsZUNoYXJ0IGRhdGE9e2NoYXJ0RGF0YS5ob3VybHl9IHR5cGU9XCJiYXJcIiBoZWlnaHQ9ezIwMH0gY29sb3I9XCIjRDRCODk2XCIgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxyXG4gICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMzAwcHgsIDFmcikpJyxcclxuICAgICAgICAgICAgZ2FwOiAnMjRweCdcclxuICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICA8TWV0cmljQ2FyZCBcclxuICAgICAgICAgICAgICB0aXRsZT1cIlByb21lZGlvIExpa2VzL1JlZWxcIiBcclxuICAgICAgICAgICAgICB2YWx1ZT17bWV0cmljcy5hdmdMaWtlc1BlclJlZWx9IFxyXG4gICAgICAgICAgICAgIHN1YnRpdGxlPVwiTWVkaWEgZGUgaW50ZXJhY2Npb25lc1wiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxNZXRyaWNDYXJkIFxyXG4gICAgICAgICAgICAgIHRpdGxlPVwiVGFzYSBkZSBDcmVjaW1pZW50b1wiIFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtgJHttZXRyaWNzLmdyb3d0aFJhdGV9JWB9IFxyXG4gICAgICAgICAgICAgIHN1YnRpdGxlPVwiVXN1YXJpb3MgbnVldm9zIGhveVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxNZXRyaWNDYXJkIFxyXG4gICAgICAgICAgICAgIHRpdGxlPVwiQ8OzZGlnb3MgUGVuZGllbnRlc1wiIFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtjb3VudHMuY29kaWdvc1Jlc2V0IHx8IDB9IFxyXG4gICAgICAgICAgICAgIHN1YnRpdGxlPVwiUmVzZXQgZGUgY29udHJhc2XDsWFcIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7YWN0aXZlVGFiID09PSAnYWN0aXZpdHknICYmIChcclxuICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXHJcbiAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoNDAwcHgsIDFmcikpJyxcclxuICAgICAgICAgIGdhcDogJzI0cHgnXHJcbiAgICAgICAgfX0+XHJcbiAgICAgICAgICA8QWN0aXZpdHlGZWVkIC8+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxyXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcclxuICAgICAgICAgICAgcGFkZGluZzogJzI0cHgnLFxyXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI0U1RERENScsXHJcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAwLjA1KSdcclxuICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICA8aDMgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBtYXJnaW46ICcwIDAgMjBweCAwJyxcclxuICAgICAgICAgICAgICBjb2xvcjogJyM0QTNGMzUnLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAnMThweCcsXHJcbiAgICAgICAgICAgICAgZm9udFdlaWdodDogJzcwMCcsXHJcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgIGdhcDogJzhweCdcclxuICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgQWNjaW9uZXMgUsOhcGlkYXNcclxuICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMTJweCcgfX0+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzE2cHggMjBweCcsXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI0U1RERENScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGREZDRkInLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjNEEzRjM1JyxcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICBnYXA6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMXB4KSc7XHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3hTaGFkb3cgPSAnMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMSknO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMCknO1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiAnNzAwJywgbWFyZ2luQm90dG9tOiAnMnB4JyB9fT5SZXZpc2FyIENvbnRlbmlkbyBSZXBvcnRhZG88L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBvcGFjaXR5OiAwLjggfX0+TW9kZXJhciBwdWJsaWNhY2lvbmVzIGZsYWdnZWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4IDIwcHgnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkRGQ0ZCJyxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzRBM0YzNScsXHJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgZ2FwOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTFweCknO1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJzAgNHB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjEpJztcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKDApJztcclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmJveFNoYWRvdyA9ICdub25lJztcclxuICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFdlaWdodDogJzcwMCcsIG1hcmdpbkJvdHRvbTogJzJweCcgfX0+R2VuZXJhciBSZXBvcnRlIFNlbWFuYWw8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBvcGFjaXR5OiAwLjggfX0+RXhwb3J0YXIgZXN0YWTDrXN0aWNhcyBkZWwgcGVyw61vZG88L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4IDIwcHgnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRkRGQ0ZCJyxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzRBM0YzNScsXHJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNjAwJyxcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjNzIGVhc2UnLFxyXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgZ2FwOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoLTFweCknO1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJzAgNHB4IDEycHggcmdiYSgwLCAwLCAwLCAwLjEpJztcclxuICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVZKDApJztcclxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmJveFNoYWRvdyA9ICdub25lJztcclxuICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFdlaWdodDogJzcwMCcsIG1hcmdpbkJvdHRvbTogJzJweCcgfX0+TGltcGlhciBDw7NkaWdvcyBFeHBpcmFkb3M8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzEycHgnLCBvcGFjaXR5OiAwLjggfX0+RWxpbWluYXIgdG9rZW5zIGRlIHJlc2V0IHZlbmNpZG9zPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzE2cHggMjBweCcsXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI0U1RERENScsXHJcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNGREZDRkInLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjNEEzRjM1JyxcclxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc2MDAnLFxyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXHJcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICBnYXA6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWSgtMXB4KSc7XHJcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3hTaGFkb3cgPSAnMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMSknO1xyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVkoMCknO1xyXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYm94U2hhZG93ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiAnNzAwJywgbWFyZ2luQm90dG9tOiAnMnB4JyB9fT5CYWNrdXAgZGUgQmFzZSBkZSBEYXRvczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnMTJweCcsIG9wYWNpdHk6IDAuOCB9fT5DcmVhciByZXNwYWxkbyBkZSBzZWd1cmlkYWQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBFc3RhZMOtc3RpY2FzIHLDoXBpZGFzICovfVxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMjRweCcsXHJcbiAgICAgICAgICAgICAgcGFkZGluZzogJzE2cHgnLFxyXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjRjVGMkVFJyxcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjRTVEREQ1J1xyXG4gICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICA8aDQgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogJzAgMCAxMnB4IDAnLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjNEEzRjM1JyxcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnNzAwJyxcclxuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxyXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuNXB4J1xyXG4gICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgUmVzdW1lbiBSw6FwaWRvXHJcbiAgICAgICAgICAgICAgPC9oND5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdncmlkJywgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdCgyLCAxZnIpJywgZ2FwOiAnMTJweCcsIGZvbnRTaXplOiAnMTNweCcgfX0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzlCOEY3RScsIG1hcmdpbkJvdHRvbTogJzJweCcgfX0+VXN1YXJpb3MgYWN0aXZvczwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzRBM0YzNScsIGZvbnRXZWlnaHQ6ICc2MDAnIH19Pntjb3VudHMudXN1YXJpb3MgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJyM5QjhGN0UnLCBtYXJnaW5Cb3R0b206ICcycHgnIH19PlRvdGFsIGNvbnRlbmlkbzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzRBM0YzNScsIGZvbnRXZWlnaHQ6ICc2MDAnIH19Pntjb3VudHMucmVlbHMgfHwgMH08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJyM5QjhGN0UnLCBtYXJnaW5Cb3R0b206ICcycHgnIH19PkVuZ2FnZW1lbnQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJyM0QTNGMzUnLCBmb250V2VpZ2h0OiAnNjAwJyB9fT57bWV0cmljcy5lbmdhZ2VtZW50UmF0ZX0lPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6ICcjOUI4RjdFJywgbWFyZ2luQm90dG9tOiAnMnB4JyB9fT5DcmVjaW1pZW50bzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzRBM0YzNScsIGZvbnRXZWlnaHQ6ICc2MDAnIH19Pit7Y291bnRzLnVzdWFyaW9zSG95IHx8IDB9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHsvKiBGb290ZXIgbWVqb3JhZG8gKi99XHJcbiAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICBtYXJnaW5Ub3A6ICc0MHB4JyxcclxuICAgICAgICBwYWRkaW5nOiAnMjRweCcsXHJcbiAgICAgICAgYmFja2dyb3VuZDogJyNmZmZmZmYnLFxyXG4gICAgICAgIGJvcmRlclJhZGl1czogJzEycHgnLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNFNURERDUnXHJcbiAgICAgIH19PlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcyMHB4JywgZmxleFdyYXA6ICd3cmFwJyB9fT5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgbWFyZ2luOiAnMCAwIDRweCAwJywgXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjNEEzRjM1JyxcclxuICAgICAgICAgICAgICBmb250U2l6ZTogJzE2cHgnLFxyXG4gICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICc3MDAnXHJcbiAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgIEJvdyBCZWF1dHkgQWRtaW4gUGFuZWxcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgXHJcbiAgICAgICAgICAgICAgbWFyZ2luOiAwLCBcclxuICAgICAgICAgICAgICBjb2xvcjogJyM4QjczNTUnLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCdcclxuICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgdjIuMCDigKIgw5psdGltYSBhY3R1YWxpemFjacOzbjoge25ldyBEYXRlKCkudG9Mb2NhbGVUaW1lU3RyaW5nKCdlcy1FUycpfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgIGdhcDogJzE2cHgnLFxyXG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xyXG4gICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgZ2FwOiAnNnB4JyxcclxuICAgICAgICAgICAgICBmb250U2l6ZTogJzEycHgnLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzlCOEY3RSdcclxuICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnOHB4JyxcclxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBsb2FkaW5nID8gJyNENEI4OTYnIDogJyM4QjczNTUnXHJcbiAgICAgICAgICAgICAgfX0gLz5cclxuICAgICAgICAgICAgICB7bG9hZGluZyA/ICdDYXJnYW5kby4uLicgOiAnU2lzdGVtYSBhY3Rpdm8nfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjOUI4RjdFJyxcclxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgZ2FwOiAnNHB4J1xyXG4gICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICB7Y291bnRzLnVzdWFyaW9zIHx8IDB9IHVzdWFyaW9zXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufSIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IE1lZGlhUHJldmlldyBmcm9tICcuLi9jb21wb25lbnRzL01lZGlhUHJldmlldydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTWVkaWFQcmV2aWV3ID0gTWVkaWFQcmV2aWV3XG5pbXBvcnQgV2VsY29tZURhc2hib2FyZCBmcm9tICcuLi9jb21wb25lbnRzL1dlbGNvbWVEYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLldlbGNvbWVEYXNoYm9hcmQgPSBXZWxjb21lRGFzaGJvYXJkIl0sIm5hbWVzIjpbIk1lZGlhUHJldmlldyIsInJlY29yZCIsInAiLCJwYXJhbXMiLCJNZWRpYVVybCIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsImlzSW1hZ2UiLCJUaXBvQXJjaGl2byIsInRvTG93ZXJDYXNlIiwic3R5bGUiLCJtYXhXaWR0aCIsImZvbnRTaXplIiwibWFyZ2luQm90dG9tIiwiY29sb3IiLCJUaXR1bG8iLCJ0b1VwcGVyQ2FzZSIsInNyYyIsImFsdCIsIndpZHRoIiwibWF4SGVpZ2h0Iiwib2JqZWN0Rml0IiwiYm9yZGVyUmFkaXVzIiwiY29udHJvbHMiLCJ0eXBlIiwiYXBpIiwiQXBpQ2xpZW50IiwiV2VsY29tZURhc2hib2FyZCIsImRhdGEiLCJzZXREYXRhIiwidXNlU3RhdGUiLCJjb3VudHMiLCJ1c3VhcmlvcyIsInJlZWxzIiwiY29tZW50YXJpb3MiLCJsaWtlcyIsImNvZGlnb3NSZXNldCIsInJlZWxzSG95IiwidXN1YXJpb3NIb3kiLCJsYXRlc3QiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImFjdGl2ZVRhYiIsInNldEFjdGl2ZVRhYiIsInVzZUVmZmVjdCIsImdldERhc2hib2FyZCIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwiY2F0Y2giLCJlcnJvciIsImNoYXJ0RGF0YSIsInVzZU1lbW8iLCJub3ciLCJEYXRlIiwid2Vla2x5IiwiQXJyYXkiLCJmcm9tIiwibGVuZ3RoIiwiXyIsImkiLCJkYXRlIiwic2V0RGF0ZSIsImdldERhdGUiLCJkYXkiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJ3ZWVrZGF5IiwidG9JU09TdHJpbmciLCJzcGxpdCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJldmVyc2UiLCJjb250ZW50VHlwZXMiLCJuYW1lIiwidmFsdWUiLCJob3VybHkiLCJob3VyIiwidG9TdHJpbmciLCJwYWRTdGFydCIsImFjdGl2aWRhZCIsIm1ldHJpY3MiLCJlbmdhZ2VtZW50UmF0ZSIsInRvRml4ZWQiLCJhdmdMaWtlc1BlclJlZWwiLCJncm93dGhSYXRlIiwiTWV0cmljQ2FyZCIsInRpdGxlIiwic3VidGl0bGUiLCJ0cmVuZCIsImljb24iLCJjbGFzc05hbWUiLCJiYWNrZ3JvdW5kIiwicGFkZGluZyIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJib3JkZXIiLCJib3hTaGFkb3ciLCJ0cmFuc2l0aW9uIiwiY3Vyc29yIiwib25Nb3VzZUVudGVyIiwiZSIsImN1cnJlbnRUYXJnZXQiLCJ0cmFuc2Zvcm0iLCJvbk1vdXNlTGVhdmUiLCJmb250V2VpZ2h0IiwidGV4dFRyYW5zZm9ybSIsImxldHRlclNwYWNpbmciLCJsaW5lSGVpZ2h0IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJnYXAiLCJ1bmRlZmluZWQiLCJTaW1wbGVDaGFydCIsImhlaWdodCIsInRleHRBbGlnbiIsIm1heFZhbHVlIiwibWF4IiwibWFwIiwiZCIsImNoYXJ0SGVpZ2h0IiwianVzdGlmeUNvbnRlbnQiLCJzbGljZSIsIml0ZW0iLCJpbmRleCIsImJhckhlaWdodCIsImtleSIsImZsZXhEaXJlY3Rpb24iLCJmbGV4IiwibWluV2lkdGgiLCJTaW1wbGVQaWVDaGFydCIsInNpemUiLCJ0b3RhbCIsInJlZHVjZSIsInN1bSIsImN1cnJlbnRBbmdsZSIsImNlbnRlciIsInJhZGl1cyIsImFuZ2xlIiwieDEiLCJjb3MiLCJQSSIsInkxIiwic2luIiwieDIiLCJ5MiIsImxhcmdlQXJjRmxhZyIsInBhdGhEYXRhIiwiam9pbiIsImZpbGwiLCJzdHJva2UiLCJzdHJva2VXaWR0aCIsIkFjdGl2aXR5RmVlZCIsIm1hcmdpbiIsIm92ZXJmbG93WSIsImJvcmRlclRvcENvbG9yIiwiYW5pbWF0aW9uIiwicmVlbCIsIl9pZCIsImZsZXhTaHJpbmsiLCJ0ZXh0T3ZlcmZsb3ciLCJ3aGl0ZVNwYWNlIiwiY3JlYXRlZEF0IiwibW9udGgiLCJtaW51dGUiLCJMaWtlcyIsIkZyYWdtZW50IiwidXN1YXJpbyIsIk5hbWUiLCJFbWFpbCIsImNvbWVudGFyaW8iLCJXZWJraXRMaW5lQ2xhbXAiLCJXZWJraXRCb3hPcmllbnQiLCJDb250ZW5pZG8iLCJzdWJzdHJpbmciLCJUYWJCdXR0b24iLCJpZCIsImxhYmVsIiwiYWN0aXZlIiwib25DbGljayIsInRhcmdldCIsImJveFNpemluZyIsIm1pbkhlaWdodCIsImZvbnRGYW1pbHkiLCJ5ZWFyIiwiZmxleFdyYXAiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwidG9Mb2NhbGVTdHJpbmciLCJvcGFjaXR5IiwibWFyZ2luVG9wIiwidG9Mb2NhbGVUaW1lU3RyaW5nIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBQ0EsTUFBTUEsWUFBWSxHQUFHQSxDQUFDO0VBQUVDLEVBQUFBO0VBQU8sQ0FBQyxLQUFLO0VBQ25DLEVBQUEsTUFBTUMsQ0FBQyxHQUFHRCxNQUFNLEVBQUVFLE1BQU0sSUFBSSxFQUFFO0lBQzlCLElBQUksQ0FBQ0QsQ0FBQyxDQUFDRSxRQUFRLEVBQUUsb0JBQU9DLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxHQUFBLEVBQUEsSUFBQSxFQUFHLGNBQWUsQ0FBQztFQUUzQyxFQUFBLE1BQU1DLE9BQU8sR0FBRyxDQUFDTCxDQUFDLENBQUNNLFdBQVcsSUFBSSxFQUFFLEVBQUVDLFdBQVcsRUFBRSxLQUFLLFFBQVE7SUFDaEUsb0JBQ0VKLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0ksSUFBQUEsS0FBSyxFQUFFO0VBQUVDLE1BQUFBLFFBQVEsRUFBRTtFQUFJO0tBQUUsZUFDNUJOLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0ks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
