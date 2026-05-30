import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['farmer', 'admin', 'expert'], 
    default: 'farmer' 
  },
  location: { 
    type: String, 
    default: '' 
  },
  phone: { 
    type: String, 
    default: '' 
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  landArea: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date,
    default: null
  },
  activities: [{
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, default: '' }
  }],
  cropSuggestions: [{
    type: String
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    default: null
  },
  verificationCodeExpires: {
    type: Date,
    default: null
  }
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
