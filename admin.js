// admin.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { ComponentLoader } from 'adminjs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Modelos
import Usuario from './models/Usuario.js';
import ReelPost from './models/ReelPost.js';
import ReelComment from './models/ReelComment.js';
import ReelLike from './models/ReelLike.js';
import PasswordResetCode from './models/PasswordResetCode.js';
import AdminUser from './models/AdminUser.js';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// AdminJS setup
AdminJS.registerAdapter(AdminJSMongoose);

const app = express();
app.set('trust proxy', 1);

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar:', err));

// Componentes personalizados
const componentLoader = new ComponentLoader();
const MediaPreview = componentLoader.add('MediaPreview', path.join(__dirname, 'components/MediaPreview.jsx'));
const WelcomeDashboard = AdminJS.bundle('./components/WelcomeDashboard.jsx');

// --- RECURSOS DEL ADMIN  ---

const usuarioResource = {
  resource: Usuario,
  options: {
    navigation: { name: 'Usuarios', icon: 'User' },
    properties: {
      _id: { isTitle: true, position: 1 },
      Name: { position: 2, label: 'Nombre' },
      Email: { position: 3, label: 'Correo' },
      AppleId: { position: 4, label: 'Apple ID', isVisible: { list: false, show: true, edit: false } },
      Password: { isVisible: false }, 
      createdAt: { 
        position: 5, 
        label: 'Fecha de Registro',
        isVisible: { list: true, filter: true, show: true, edit: false },
        type: 'datetime'
      },
      updatedAt: { 
        label: 'Última Actualización',
        isVisible: { list: false, show: true, edit: false } 
      },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['_id', 'Name', 'Email', 'createdAt'],
    showProperties: ['_id', 'Name', 'Email', 'AppleId', 'createdAt', 'updatedAt'],
    filterProperties: ['Name', 'Email', 'createdAt'],
    actions: {
      delete: {
        before: async (request) => {
          console.log('Eliminando usuario:', request.record.params._id);
          return request;
        }
      }
    }
  },
};

const reelResource = {
  resource: ReelPost,
  options: {
    navigation: { name: 'Contenido', icon: 'Video' },
    properties: {
      IdUsuario: { 
        label: 'Usuario ID', 
        position: 1,
        isVisible: { list: true, filter: true, show: true, edit: true }
      },
      Titulo: { 
        label: 'Título', 
        isTitle: true, 
        position: 2,
        type: 'string'
      },
      Descripcion: { 
        label: 'Descripción', 
        type: 'textarea', 
        position: 3 
      },
      TipoArchivo: { 
        label: 'Tipo', 
        position: 4, 
        availableValues: [
          { value: 'video', label: 'Video' }, 
          { value: 'imagen', label: 'Imagen' }
        ]
      },
      MediaUrl: { 
        label: 'Media', 
        position: 5, 
        components: { list: MediaPreview, show: MediaPreview },
        type: 'string'
      },
      Likes: { 
        label: 'Likes', 
        position: 6,
        type: 'number'
      },
      createdAt: { 
        label: 'Creado', 
        position: 7, 
        isVisible: { list: true, filter: true, show: true, edit: false },
        type: 'datetime'
      },
      updatedAt: { 
        label: 'Actualizado', 
        isVisible: { list: false, filter: true, show: true, edit: false },
        type: 'datetime'
      },
    },
    listProperties: ['MediaUrl', 'Titulo', 'TipoArchivo', 'IdUsuario', 'Likes', 'createdAt'],
    showProperties: ['MediaUrl', 'Titulo', 'Descripcion', 'TipoArchivo', 'IdUsuario', 'Likes', 'createdAt', 'updatedAt'],
    filterProperties: ['Titulo', 'TipoArchivo', 'IdUsuario', 'createdAt'],
    sort: { sortBy: 'createdAt', direction: 'desc' },
  },
};

const comentarioResource = {
  resource: ReelComment,
  options: {
    navigation: { name: 'Moderación', icon: 'MessageSquare' },
    properties: {
      ReelId: { 
        label: 'ID Reel', 
        position: 1,
        type: 'string'
      },
      IdUsuario: { 
        label: 'Usuario', 
        position: 2,
        type: 'string'
      },
      Contenido: { 
        label: 'Comentario', 
        position: 3, 
        type: 'textarea',
        isTitle: true
      },
      Eliminado: { 
        label: 'Estado', 
        position: 4, 
        availableValues: [
          { value: false, label: 'Activo' }, 
          { value: true, label: 'Eliminado' }
        ]
      },
      createdAt: { 
        label: 'Fecha', 
        position: 5, 
        isVisible: { list: true, filter: true, show: true, edit: false },
        type: 'datetime'
      },
      Fecha: { 
        label: 'Fecha Original', 
        position: 6, 
        isVisible: { list: false, filter: false, show: true, edit: false },
        type: 'datetime'
      },
    },
    listProperties: ['Contenido', 'IdUsuario', 'Eliminado', 'createdAt'],
    showProperties: ['ReelId', 'IdUsuario', 'Contenido', 'Eliminado', 'Fecha', 'createdAt'],
    filterProperties: ['ReelId', 'IdUsuario', 'Eliminado', 'createdAt'],
    sort: { sortBy: 'createdAt', direction: 'desc' },
  },
};

const passwordResetResource = {
  resource: PasswordResetCode,
  options: {
    navigation: { name: 'Seguridad', icon: 'Lock' },
    properties: {
      _id: { position: 1, isTitle: true },
      Email: { 
        position: 2, 
        label: 'Correo Electrónico',
        type: 'string'
      },
      Code: { 
        position: 3, 
        label: 'Código',
        type: 'string'
      },
      IsUsed: { 
        position: 4,
        label: 'Estado',
        availableValues: [
          { value: true, label: 'Usado' },
          { value: false, label: 'Pendiente' },
        ]
      },
      Expiration: { 
        position: 5, 
        label: 'Expira',
        type: 'datetime',
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
      createdAt: { 
        position: 6,
        label: 'Creado',
        isVisible: { list: false, filter: true, show: true, edit: false },
        type: 'datetime'
      },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['Email', 'Code', 'IsUsed', 'Expiration'],
    showProperties: ['Email', 'Code', 'IsUsed', 'Expiration', 'createdAt'],
    filterProperties: ['Email', 'IsUsed', 'createdAt'],
    actions: {
      new: { isVisible: false }, 
      edit: { isVisible: false },
      delete: {
        before: async (request) => {
          console.log('Eliminando código de reset:', request.record.params.Email);
          return request;
        }
      }
    }
  },
};


// --- CONFIGURACIÓN ADMINJS ---
const adminJs = new AdminJS({
  componentLoader,
  rootPath: '/admin',
dashboard: {
  component: WelcomeDashboard,
  handler: async (req, res, context) => {
    try {
      // Estadísticas principales
      const [usuarios, reels, comentarios, likes, codigosReset] = await Promise.all([
        Usuario.countDocuments({}),
        ReelPost.countDocuments({}),
        ReelComment.countDocuments({ Eliminado: false }),
        ReelLike.countDocuments({}),
        PasswordResetCode.countDocuments({ IsUsed: false }),
      ]);

      // Estadísticas de hoy
      const hoy = new Date(new Date().setHours(0, 0, 0, 0));
      const [usuariosHoy, reelsHoy, comentariosHoy] = await Promise.all([
        Usuario.countDocuments({ createdAt: { $gte: hoy } }),
        ReelPost.countDocuments({ createdAt: { $gte: hoy } }),
        ReelComment.countDocuments({ createdAt: { $gte: hoy }, Eliminado: false }),
      ]);

      // Actividad reciente - últimos elementos
      const [ultimosReels, ultimosUsuarios, ultimosComentarios] = await Promise.all([
        ReelPost.find({}, { 
          Titulo: 1, 
          TipoArchivo: 1, 
          Likes: 1, 
          createdAt: 1,
          MediaUrl: 1 
        }).sort({ createdAt: -1 }).limit(8).lean(),
        
        Usuario.find({}, { 
          Name: 1, 
          Email: 1, 
          createdAt: 1 
        }).sort({ createdAt: -1 }).limit(8).lean(),
        
        ReelComment.find({ Eliminado: false }, { 
          Contenido: 1, 
          IdUsuario: 1, 
          ReelId: 1,
          createdAt: 1 
        }).sort({ createdAt: -1 }).limit(8).lean(),
      ]);

      // Datos para gráficos - últimos 7 días
      const hace7Dias = new Date();
      hace7Dias.setDate(hace7Dias.getDate() - 7);
      
      const actividadSemanal = await Promise.all(
        Array.from({ length: 7 }, async (_, i) => {
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - i);
          const inicioDia = new Date(fecha.setHours(0, 0, 0, 0));
          const finDia = new Date(fecha.setHours(23, 59, 59, 999));
          
          const [usuariosDia, reelsDia, comentariosDia] = await Promise.all([
            Usuario.countDocuments({ 
              createdAt: { $gte: inicioDia, $lte: finDia } 
            }),
            ReelPost.countDocuments({ 
              createdAt: { $gte: inicioDia, $lte: finDia } 
            }),
            ReelComment.countDocuments({ 
              createdAt: { $gte: inicioDia, $lte: finDia },
              Eliminado: false 
            }),
          ]);
          
          return {
            fecha: inicioDia.toISOString().split('T')[0],
            dia: inicioDia.toLocaleDateString('es-ES', { weekday: 'short' }),
            usuarios: usuariosDia,
            reels: reelsDia,
            comentarios: comentariosDia
          };
        })
      );

      // Distribución de tipos de contenido
      const tiposContenido = await ReelPost.aggregate([
        {
          $group: {
            _id: "$TipoArchivo",
            count: { $sum: 1 }
          }
        }
      ]);

      // Actividad por horas (simulada - puedes implementar lógica real)
      const actividadPorHora = Array.from({ length: 24 }, (_, hora) => ({
        hora: `${hora.toString().padStart(2, '0')}:00`,
        actividad: Math.floor(Math.random() * 50) + 10 // Reemplazar con datos reales
      }));

      // Top usuarios más activos
      const topUsuarios = await ReelPost.aggregate([
        {
          $group: {
            _id: "$IdUsuario",
            totalReels: { $sum: 1 },
            totalLikes: { $sum: "$Likes" }
          }
        },
        { $sort: { totalReels: -1 } },
        { $limit: 5 }
      ]);

      // Métricas de engagement
      const engagementTotal = comentarios + likes;
      const engagementRate = reels > 0 ? ((engagementTotal / reels) * 100).toFixed(2) : 0;
      const avgLikesPerReel = reels > 0 ? (likes / reels).toFixed(1) : 0;
      const growthRate = usuarios > 0 ? ((usuariosHoy / usuarios) * 100).toFixed(2) : 0;

      // Alertas del sistema
      const alertas = [];
      if (codigosReset > 10) {
        alertas.push({
          tipo: 'warning',
          mensaje: `${codigosReset} códigos de reset pendientes`,
          accion: 'revisar_codigos'
        });
      }
      if (usuariosHoy > usuarios * 0.1) {
        alertas.push({
          tipo: 'success',
          mensaje: `Gran día! ${usuariosHoy} nuevos usuarios`,
          accion: 'celebrar'
        });
      }

      return {
        // Contadores principales
        counts: { 
          usuarios, 
          reels, 
          comentarios, 
          likes, 
          codigosReset,
          usuariosHoy,
          reelsHoy,
          comentariosHoy
        },
        
        // Actividad reciente
        latest: { 
          reels: ultimosReels, 
          usuarios: ultimosUsuarios,
          comentarios: ultimosComentarios
        },
        
        // Datos para gráficos
        charts: {
          actividadSemanal: actividadSemanal.reverse(),
          tiposContenido: tiposContenido.map(tipo => ({
            name: tipo._id === 'video' ? 'Videos' : 'Imágenes',
            value: tipo.count,
            color: tipo._id === 'video' ? '#E4B1B1' : '#DED8F7'
          })),
          actividadPorHora,
          topUsuarios
        },
        
        // Métricas calculadas
        metrics: {
          engagementRate,
          avgLikesPerReel,
          growthRate,
          totalEngagement: engagementTotal
        },
        
        // Alertas
        alertas,
        
        // Metadatos
        meta: {
          lastUpdate: new Date().toISOString(),
          version: '2.0'
        }
      };
    } catch (error) {
      console.error('Error en dashboard handler:', error);
      return {
        counts: { 
          usuarios: 0, reels: 0, comentarios: 0, likes: 0, 
          codigosReset: 0, usuariosHoy: 0, reelsHoy: 0, comentariosHoy: 0 
        },
        latest: { reels: [], usuarios: [], comentarios: [] },
        charts: {
          actividadSemanal: [],
          tiposContenido: [],
          actividadPorHora: [],
          topUsuarios: []
        },
        metrics: {
          engagementRate: 0,
          avgLikesPerReel: 0,
          growthRate: 0,
          totalEngagement: 0
        },
        alertas: [],
        meta: {
          lastUpdate: new Date().toISOString(),
          error: error.message}
        };
      }
    },
  },
  
  assets: { styles: ['/admin-assets/branding.css?v=12'] },

  branding: {
    companyName: 'Bow Beauty Admin',
    withMadeWithLove: false,
    logo: '/logo/bow_logo_Mesa de trabajo 1 copia.png',
    favicon: '/logo/bow_icono_Mesa de trabajo 1 copia.png',
    
    theme: {
      fonts: { 
        base: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
      },
    },
  },
  
  resources: [
    usuarioResource, 
    reelResource, 
    comentarioResource, 
    passwordResetResource
  ],
});


// Archivos estáticos
app.use('/logo', express.static(path.join(__dirname, 'logo')));
app.use('/admin-assets', express.static(path.join(__dirname, 'admin-assets')));

// Autenticación
const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      const user = await AdminUser.findOne({ email, isActive: true }).select('+password');
      if (!user) return null;
      if (!(await user.comparePassword(password))) return null;

      // Por ahora solo admin (super_admin lo activamos después)
      if (!['admin'].includes(user.role)) return null;

      return { email: user.email, role: user.role, name: user.name, id: String(user._id) };
    },
    cookiePassword: process.env.COOKIE_SECRET,
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  }
);

app.use(adminJs.options.rootPath, router);

// Middleware for API routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (separate from AdminJS)
app.use('/api', apiRoutes);

// Serve registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\nPanel de administración ejecutándose en:`);
  console.log(`Local: http://localhost:${PORT}/admin`);
  console.log(`Auth: usa tus credenciales de AdminUser (email + password)\n`);
});

export default adminJs;