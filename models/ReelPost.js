import mongoose from 'mongoose';

const ReelPostSchema = new mongoose.Schema({
  idUsuario:  { type: String, required: true, index: true },
  titulo:     { type: String, required: true, index: true },
  descripcion:{ type: String, required: true },
  mediaUrl:   { type: String, required: true },
  tipoArchivo:{ type: String, enum: ['video','imagen'], required: true, index: true },
  likes:      { type: Number, default: 0 },
}, {
  collection: 'Reels',
  timestamps: true,
});
ReelPostSchema.index({ createdAt: -1 });

export default mongoose.model('ReelPost', ReelPostSchema, 'Reels');
