import mongoose from 'mongoose';

const ReelPostSchema = new mongoose.Schema({
  // Campos originales (mantener compatibilidad)
  IdUsuario: { type: String, required: false },
  Titulo: { type: String, required: true },
  Descripcion: { type: String, required: true },
  MediaUrl: { type: String, required: true },
  TipoArchivo: { type: String, enum: ['video', 'imagen'], required: true },
  Likes: { type: Number, default: 0 },
  CreatedAt: { type: Date },
  UpdatedAt: { type: Date },
  
  // Campos con alias para AdminJS (nombres en minúsculas)
  idUsuario: { 
    type: String,
    get: function() { return this.IdUsuario; },
    set: function(v) { this.IdUsuario = v; }
  },
  titulo: { 
    type: String,
    get: function() { return this.Titulo; },
    set: function(v) { this.Titulo = v; }
  },
  descripcion: { 
    type: String,
    get: function() { return this.Descripcion; },
    set: function(v) { this.Descripcion = v; }
  },
  mediaUrl: { 
    type: String,
    get: function() { return this.MediaUrl; },
    set: function(v) { this.MediaUrl = v; }
  },
  tipoArchivo: { 
    type: String,
    get: function() { return this.TipoArchivo; },
    set: function(v) { this.TipoArchivo = v; }
  },
  likes: { 
    type: Number,
    get: function() { return this.Likes || 0; },
    set: function(v) { this.Likes = v; }
  }
}, {
  collection: 'Reels',
  timestamps: true,
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true }
});

// Índices para mejor rendimiento
ReelPostSchema.index({ createdAt: -1 });
ReelPostSchema.index({ IdUsuario: 1 });
ReelPostSchema.index({ TipoArchivo: 1 });

export default mongoose.model('ReelPost', ReelPostSchema, 'Reels');