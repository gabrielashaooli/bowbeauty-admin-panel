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

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar:', err));

// Componentes personalizados
const componentLoader = new ComponentLoader();
const MediaPreview = componentLoader.add('MediaPreview', path.join(__dirname, 'components/MediaPreview.jsx'));
const WelcomeDashboard = componentLoader.add('WelcomeDashboard', path.join(__dirname, 'components/WelcomeDashboard.jsx'));

// --- RECURSOS DEL ADMIN ---

const usuarioResource = {
  resource: Usuario,
  options: {
    navigation: { name: 'Usuarios', icon: 'User' },
    properties: {
      _id: { isTitle: true, position: 1 },
      Name: { position: 2 },
      Email: { position: 3 },
      AppleId: { position: 4, isVisible: { list: false, show: true, edit: false } },
      Password: { isVisible: false }, // Completamente oculto
      createdAt: { 
        position: 5, 
        isVisible: { list: true, filter: true, show: true, edit: false },
        type: 'datetime'
      },
      updatedAt: { isVisible: { list: false, show: true, edit: false } },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['_id', 'Name', 'Email', 'createdAt'],
    showProperties: ['_id', 'Name', 'Email', 'AppleId', 'createdAt', 'updatedAt'],
    filterProperties: ['Name', 'Email', 'createdAt'],
    actions: {
      delete: {
        before: async (request) => {
          // Opcional: Lógica antes de eliminar usuario
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
      idUsuario:  { label: 'Id Usuario', position: 1 },
      titulo:     { label: 'Titulo', isTitle: true, position: 2 },
      descripcion:{ label: 'Descripcion', type: 'textarea', position: 3 },
      tipoArchivo:{ label: 'Tipo Archivo', position: 4, availableValues: [
        { value: 'video', label: 'Video' }, { value: 'imagen', label: 'Imagen' }
      ]},
      mediaUrl:   { label: 'Media', position: 5, components: { list: MediaPreview, show: MediaPreview } },
      likes:      { label: 'Likes', position: 6 },
      createdAt:  { label: 'Created At', position: 7, isVisible: { list:true, filter:true, show:true, edit:false } },
      updatedAt:  { label: 'Updated At', isVisible: { list:false, filter:true, show:true, edit:false } },
    },
    listProperties: ['mediaUrl','titulo','tipoArchivo','idUsuario','likes','createdAt'],
    showProperties: ['mediaUrl','titulo','descripcion','tipoArchivo','idUsuario','likes','createdAt','updatedAt'],
    filterProperties: ['titulo','tipoArchivo','idUsuario','createdAt'],
    sort: { sortBy: 'createdAt', direction: 'desc' },
  },
};

const comentarioResource = {
  resource: ReelComment,
  options: {
    navigation: { name: 'Moderación', icon: 'MessageSquare' },
    properties: {
      reelId:     { label: 'Id Reel', position: 1 },
      idUsuario:  { label: 'Id Usuario', position: 2 },
      contenido:  { label: 'Comentario', position: 3, type: 'textarea' },
      isActive:   { label: 'Activo', position: 4, availableValues: [
        { value: true, label: 'Activo' }, { value: false, label: 'Inactivo' }
      ]},
      createdAt:  { label: 'Created At', position: 5, isVisible: { list:true, filter:true, show:true, edit:false } },
    },
    listProperties: ['contenido','idUsuario','isActive','createdAt'],
    filterProperties: ['reelId','idUsuario','isActive','createdAt'],
    sort: { sortBy: 'createdAt', direction: 'desc' },
  },
};


const likeResource = {
  resource: ReelLike,
  options: {
    navigation: { name: 'Interacciones', icon: 'Heart' },
    properties: {
      _id: { position: 1, isTitle: true },
      IdReel: { position: 2 },
      IdUsuario: { position: 3 },
      createdAt: { 
        position: 4,
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['IdReel', 'IdUsuario', 'createdAt'],
    filterProperties: ['IdReel', 'IdUsuario', 'createdAt'],
    actions: {
      new: { isVisible: false }, // No crear likes desde admin
    }
  },
};

const passwordResetResource = {
  resource: PasswordResetCode,
  options: {
    navigation: { name: 'Seguridad', icon: 'Lock' },
    properties: {
      _id: { position: 1, isTitle: true },
      Email: { position: 2 },
      Code: { position: 3 },
      IsUsed: { 
        position: 4,
        availableValues: [
          { value: true, label: 'Usado' },
          { value: false, label: 'Pendiente' },
        ]
      },
      ExpiresAt: { position: 5, type: 'datetime' },
      createdAt: { 
        position: 6,
        isVisible: { list: true, filter: true, show: true, edit: false }
      },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['Email', 'IsUsed', 'ExpiresAt', 'createdAt'],
    filterProperties: ['Email', 'IsUsed', 'createdAt'],
    actions: {
      new: { isVisible: false }, // No crear códigos desde admin
      edit: { isVisible: false }, // No editar códigos
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
          ReelComment.countDocuments({}),
          ReelLike.countDocuments({}),
          PasswordResetCode.countDocuments({ IsUsed: false }),
        ]);

        // Actividad reciente
        const [ultimosReels, ultimosUsuarios, ultimosComentarios] = await Promise.all([
          ReelPost.find({}, { Titulo: 1, TipoArchivo: 1, Likes: 1, createdAt: 1 })
            .sort({ createdAt: -1 }).limit(5).lean(),
          Usuario.find({}, { Name: 1, Email: 1, createdAt: 1 })
            .sort({ createdAt: -1 }).limit(5).lean(),
          ReelComment.find({}, { Comentario: 1, IdUsuario: 1, IsActive: 1, createdAt: 1 })
            .sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        // Estadísticas adicionales
        const reelsHoy = await ReelPost.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        const usuariosHoy = await Usuario.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        });

        return {
          counts: { 
            usuarios, 
            reels, 
            comentarios, 
            likes, 
            codigosReset,
            reelsHoy,
            usuariosHoy
          },
          latest: { 
            reels: ultimosReels, 
            usuarios: ultimosUsuarios,
            comentarios: ultimosComentarios
          },
        };
      } catch (error) {
        console.error('Error en dashboard handler:', error);
        return {
          counts: { usuarios: 0, reels: 0, comentarios: 0, likes: 0, codigosReset: 0 },
          latest: { reels: [], usuarios: [], comentarios: [] },
        };
      }
    },
  },
  
  assets: { styles: ['/admin-assets/branding.css?v=11'] },

  branding: {
    companyName: 'Bow Beauty Admin',
    withMadeWithLove: false,
    logo: 'http://localhost:3001/logo/bow_logo_Mesa de trabajo 1 copia.png',
    favicon: 'http://localhost:3001/logo/bow_icono_Mesa de trabajo 1 copia.png',
    
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
    likeResource, 
    passwordResetResource
  ],
});

// --- EXPRESS APP ---
const app = express();

// Archivos estáticos
app.use('/logo', express.static(path.join(__dirname, 'logo')));
app.use('/admin-assets', express.static(path.join(__dirname, 'admin-assets')));

// Autenticación
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return { email, role: 'admin' };
    }
  },
  cookiePassword: process.env.COOKIE_SECRET,
});

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
  console.log(` Panel de administración ejecutándose en:`);
  console.log(` Local: http://localhost:${PORT}/admin`);
  console.log(` Credenciales: ${process.env.ADMIN_EMAIL}`);
  console.log(` Bow Beauty Admin Panel running at http://localhost:${PORT}/admin`);
});

export default adminJs;