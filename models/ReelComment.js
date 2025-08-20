import mongoose from 'mongoose';

const ReelCommentSchema = new mongoose.Schema({
  reelId:     { type: String, required: true, index: true },
  idUsuario:  { type: String, required: true, index: true },
  contenido:  { type: String, required: true },   
  isActive:   { type: Boolean, default: true, index: true },
}, {
  collection: 'ReelComments', 
  timestamps: true,
});
ReelCommentSchema.index({ createdAt: -1 });

export default mongoose.model('ReelComment', ReelCommentSchema, 'ReelComments');
