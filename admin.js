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

import Usuario from './models/Usuario.js';
import ReelPost from './models/ReelPost.js';
import AdminUser from './models/AdminUser.js';
import apiRoutes from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- AdminJS base ---
AdminJS.registerAdapter(AdminJSMongoose);

// Conexión Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar:', err));

// Componentes personalizados
const componentLoader = new ComponentLoader();
const MediaPreview = componentLoader.add('MediaPreview', path.join(__dirname, 'components/MediaPreview.jsx'));
const WelcomeDashboard = componentLoader.add('WelcomeDashboard', path.join(__dirname, 'components/WelcomeDashboard.jsx'));

// --- Configuración de recursos ---
const usuarioResource = {
  resource: Usuario,
  options: {
    navigation: { name: 'Core', icon: 'User' },
    properties: {
      _id: { isTitle: true, position: 1 },
      AppleId: { position: 2 },
      Email: { position: 3 },
      Name: { position: 4 },
      Password: {
        isVisible: { list: false, filter: false, show: false, edit: false }, // oculto
      },
      createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
      updatedAt: { isVisible: { list: false, filter: true, show: true, edit: false } },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['_id', 'Name', 'Email', 'createdAt'],
    showProperties: ['_id', 'Name', 'Email', 'AppleId', 'createdAt', 'updatedAt'],
    filterProperties: ['_id', 'Name', 'Email', 'createdAt'],
  },
};

const reelResource = {
  resource: ReelPost,
  options: {
    navigation: { name: 'Core', icon: 'Video' },
    properties: {
      // Mostrar el nombre del usuario en lugar del id
      IdUsuario: {
        position: 1,
        isVisible: { list: true, filter: true, show: true, edit: true },
        components: {},
      },
      Titulo: { position: 2, isTitle: true },
      Descripcion: { type: 'textarea', position: 3 },
      TipoArchivo: { position: 4, availableValues: [
        { value: 'video', label: 'Video' },
        { value: 'imagen', label: 'Imagen' },
      ]},
      MediaUrl: {
        position: 5,
        components: { list: MediaPreview, show: MediaPreview },
      },
      Likes: { position: 6 },
      createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
      updatedAt: { isVisible: { list: false, filter: true, show: true, edit: false } },
    },
    sort: { sortBy: 'createdAt', direction: 'desc' },
    listProperties: ['MediaUrl', 'Titulo', 'TipoArchivo', 'IdUsuario', 'Likes', 'createdAt'],
    showProperties: ['MediaUrl', 'Titulo', 'Descripcion', 'TipoArchivo', 'IdUsuario', 'Likes', 'createdAt', 'updatedAt'],
    filterProperties: ['Titulo', 'TipoArchivo', 'IdUsuario', 'createdAt'],
    actions: {
      // Evitar ediciones accidentales en createdAt/updatedAt
      new: { before: async (req) => req },
      edit: { before: async (req) => req },
    },
  },
};

// --- AdminJS instancia ---
const adminJs = new AdminJS({
  componentLoader,
  rootPath: '/admin',
  dashboard: {
    component: WelcomeDashboard,
    handler: async (req, res, context) => {
      const [usuarios, reels] = await Promise.all([
        Usuario.countDocuments({}),
        ReelPost.countDocuments({}),
      ]);

      const ultimosReels = await ReelPost
        .find({}, { Titulo: 1, TipoArchivo: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const ultimosUsuarios = await Usuario
        .find({}, { _id: 1, Name: 1, Email: 1, createdAt: 1 })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      return {
        counts: { usuarios, reels },
        latest: { reels: ultimosReels, usuarios: ultimosUsuarios },
      };
    },
  },
assets: { styles: ['/admin-assets/branding.css?v=9'] },

  branding: {
    companyName: 'Bow Beauty',
    withMadeWithLove: false,
    logo: 'http://localhost:3001/logo/bow_logo_Mesa de trabajo 1 copia.png',
    favicon: 'http://localhost:3001/logo/bow_icono_Mesa de trabajo 1 copia.png',
    theme: {
      colors: {
        primary100: '#4C1E1E', primary80: '#6A2A2A', primary60: '#8E3B3B', primary40: '#B86262', primary20: '#E4B1B1',
        accent: '#E4BB8D',
        info: '#DED8F7',
        love: '#FBC8D9',
        white: '#FAEBDD',
        grey100: '#1C1C38',
        grey80: '#454655',
        grey60: '#898A9A',
        grey40: '#C0C0CA',
        grey20: '#F6F7FB',
        error: '#DE405D', errorLight: '#FFA5B5', errorDark: '#C82E49',
        success: '#6BBF8F', successLight: '#AEE5C8', successDark: '#3F8E67',
        warning: '#E4BB8D',
      },
      fonts: { base: "'Inter', Arial, sans-serif" },
    },
  },
  resources: [usuarioResource, reelResource],
});

// --- App Express ---
const app = express();

// Archivos estáticos (logos + css)
app.use('/logo', express.static(path.join(__dirname, 'logo')));
app.use('/admin-assets', express.static(path.join(__dirname, 'admin-assets')));


// Auth con MongoDB
const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    try {
      // Find active admin user by email
      const user = await AdminUser.findOne({ email, isActive: true });
      if (!user) {
        return null;
      }

      // Verify password using bcrypt
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return null;
      }

      // Return user data for session
      return { 
        email: user.email, 
        name: user.name, 
        role: user.role,
        id: user._id 
      };
    } catch (error) {
      console.error('AdminJS authentication error:', error);
      return null;
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
  console.log(`🚀 Bow Beauty Admin Panel running at http://localhost:${PORT}/admin`);
});
