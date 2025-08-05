import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';

import Usuario from './models/Usuario.js';
import ReelPost from './models/ReelPost.js';

AdminJS.registerAdapter(AdminJSMongoose);
// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch((err) => {
  console.error('Error al conectar a MongoDB:', err);
});

// Configuración de AdminJS
const adminJs = new AdminJS({
  rootPath: '/admin',
  resources: [
    {
      resource: Usuario,
      options: {
        properties: {
          Password: { isVisible: false }, // Ocultamos el campo en la UI
        },
      },
    },
    {
      resource: ReelPost,
      options: {
        properties: {
          MediaUrl: {
            type: 'string',
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
            components: {
              //list: AdminJS.bundle('./components/MediaPreview.js'), 
              // show: AdminJS.bundle('./components/MediaPreview.js'), 
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

// Login básico
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
