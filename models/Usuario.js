import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  AppleId: { type: String, default: '' },
  Email: { type: String, required: true },
  Name: { type: String, required: true },
  Password: { type: String, required: true },
}, {
  collection: 'Users', 
  _id: false 
});

const Usuario = mongoose.model('Usuario', UsuarioSchema, 'Users');
export default Usuario;