import mongoose from 'mongoose';

const ReelPostSchema = new mongoose.Schema({
  IdUsuario: { type: String, required: false },
  Titulo: { type: String, required: true },
  Descripcion: { type: String, required: true },
  MediaUrl: { type: String, required: true },
  TipoArchivo: { type: String, enum: ['video', 'imagen'], required: true },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  Likes: { type: Number, default: 0 }
}, {
  collection: 'Reels'
});

const ReelPost = mongoose.model('ReelPost', ReelPostSchema, 'Reels'); 
export default ReelPost;