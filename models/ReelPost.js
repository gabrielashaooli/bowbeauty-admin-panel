import mongoose from 'mongoose';

const ReelPostSchema = new mongoose.Schema({
  Titulo: { type: String, required: true },
  Descripcion: { type: String, required: true },
  MediaUrl: { type: String, required: true },
  TipoArchivo: { type: String, enum: ['video', 'imagen'], required: true },
  CreatedAt: { type: Date, default: Date.now },
});

const ReelPost = mongoose.model('ReelPost', ReelPostSchema);
export default ReelPost;
