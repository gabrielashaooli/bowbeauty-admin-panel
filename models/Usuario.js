import mongoose from 'mongoose'
const { Schema } = mongoose

const UsuarioSchema = new Schema({
  _id:       { type: String, required: true },              
  appleId:   { type: String, default: '', alias: 'AppleId' },
  email:     { type: String, required: true, lowercase: true, trim: true, alias: 'Email' },
  name:      { type: String, required: true, trim: true, alias: 'Name' },
  password:  { type: String, required: true, select: false, alias: 'Password' }
}, {
  collection: 'Users',
  _id: false,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true }
})

UsuarioSchema.index({ createdAt: -1 })

export default mongoose.model('Usuario', UsuarioSchema, 'Users')
