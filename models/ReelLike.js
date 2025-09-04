import mongoose from 'mongoose'
const ReelLikeSchema = new mongoose.Schema({
  reelId:    { type: String, required: true, index: true },
  idUsuario: { type: String, required: true, index: true }
}, {
  collection: 'reellikes',
  timestamps: true
})
ReelLikeSchema.index({ reelId: 1, idUsuario: 1 }, { unique: true })
export default mongoose.model('ReelLike', ReelLikeSchema, 'reellikes')