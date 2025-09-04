import mongoose from 'mongoose';

const ReelCommentSchema = new mongoose.Schema({
  // Campos que existen en MongoDB
  ReelId: { type: String, required: true, index: true },
  IdUsuario: { type: String, required: true, index: true },
  Contenido: { type: String, required: true },
  Fecha: { type: Date, default: Date.now },
  FechaEdicion: { type: Date, default: null },
  Eliminado: { type: Boolean, default: false, index: true },
}, {
  collection: 'ReelComments', 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor rendimiento
ReelCommentSchema.index({ createdAt: -1 });
ReelCommentSchema.index({ Fecha: -1 });
ReelCommentSchema.index({ Eliminado: 1 });

export default mongoose.model('ReelComment', ReelCommentSchema, 'ReelComments');
