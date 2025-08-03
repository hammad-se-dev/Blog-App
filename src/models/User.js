import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: false // Changed to false since Google users won't have passwords
  },
  name: { 
    type: String, 
    required: false // Add name field for Google users
  },
  googleId: { 
    type: String, 
    unique: true,
    sparse: true // Allows multiple null values for non-Google users
  },
  avatar: { 
    type: String, 
    default: null // Profile picture from Google
  },
  authProvider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  }
}, { timestamps: true });

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;