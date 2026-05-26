import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  deviceId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  sensorType: { 
    type: String, 
    required: true,
    trim: true
  },
  batteryLevel: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['online', 'offline', 'maintenance'], 
    default: 'online' 
  }
});

const SensorModel = mongoose.model('Sensor', sensorSchema);
export default SensorModel;
