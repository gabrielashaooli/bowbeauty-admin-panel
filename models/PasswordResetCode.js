import mongoose from 'mongoose';

const PasswordResetCodeSchema = new mongoose.Schema({
  Email: { type: String, required: true },
  Code: { type: String, required: true },
  IsUsed: { type: Boolean, default: false },
  ExpiresAt: { type: Date, required: true },
}, {
  collection: 'PasswordResetCodes',
  timestamps: true,
});

export default mongoose.model('PasswordResetCode', PasswordResetCodeSchema);