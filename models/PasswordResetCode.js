import mongoose from 'mongoose';

const PasswordResetCodeSchema = new mongoose.Schema({
  Email: { type: String, required: true },
  Code: { type: String, required: true },
  IsUsed: { type: Boolean, default: false },
  Expiration: { 
    type: Date,
    required: true,
    get: function(value) {
      if (!value) return null;
      if (value instanceof Date) return value;
      
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      } catch (error) {
        console.error('Error parsing date:', error);
        return null;
      }
    }
  }
}, {
  collection: 'PasswordResetCodes',
  timestamps: true, // Solo para NUEVOS registros
  toJSON: { getters: true, virtuals: true },
  toObject: { getters: true, virtuals: true }
});

// Virtual para mostrar si tiene timestamps reales
PasswordResetCodeSchema.virtual('hasRealTimestamps').get(function() {
  return !!(this.createdAt && this.updatedAt);
});

// Virtual para mostrar estado de expiración
PasswordResetCodeSchema.virtual('isExpired').get(function() {
  if (!this.Expiration) return true;
  return new Date() > this.Expiration;
});

// Virtual para mostrar tiempo restante
PasswordResetCodeSchema.virtual('timeLeft').get(function() {
  if (!this.Expiration) return 'Sin fecha';
  
  const now = new Date();
  const diff = this.Expiration - now;
  
  if (diff <= 0) return 'Expirado';
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
});

export default mongoose.model('PasswordResetCode', PasswordResetCodeSchema);