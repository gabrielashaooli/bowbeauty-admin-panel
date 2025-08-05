import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  AppleId: { type: String, required: true },
  Email: { type: String, required: true },
  Name: { type: String, required: true },
  Password: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
export default Usuario;
