import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { ComponentLoader } from 'adminjs'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Usuario from './models/Usuario.js';
import ReelPost from './models/ReelPost.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const componentLoader = new ComponentLoader();
const MediaPreview = componentLoader.add('MediaPreview', path.join(__dirname, 'components/MediaPreview.jsx'));

AdminJS.registerAdapter(AdminJSMongoose);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar:', err));

const adminJs = new AdminJS({
  rootPath: '/admin',
  componentLoader,
  resources: [
    {
      resource: Usuario,
      options: {
        properties: {
          Password: { isVisible: false },
        },
      },
    },
    {
      resource: ReelPost,
      options: {
        properties: {
          MediaUrl: {
            components: {
              show: MediaPreview,
              list: MediaPreview,
            },
          },
        },
      },
    },
  ],
  branding: {
    companyName: 'Bow Beauty Admin',
    softwareBrothers: false,
  },
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
  authenticate: async (email, password) => {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return { email };
    }
    return null;
  },
  cookiePassword: process.env.COOKIE_SECRET,
});

const app = express();
app.use(adminJs.options.rootPath, adminRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Panel corriendo en http://localhost:${PORT}/admin`);
});