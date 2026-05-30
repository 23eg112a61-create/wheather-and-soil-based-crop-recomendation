import mongoose from 'mongoose';

const soilSchema = new mongoose.Schema({
  moisture: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  ph: { 
    type: Number, 
    required: true,
    min: 0,
    max: 14
  },
  nitrogen: { 
    type: Number, 
    required: true,
    min: 0
  },
  phosphorus: { 
    type: Number, 
    required: true,
    min: 0
  },
  potassium: { 
    type: Number, 
    required: true,
    min: 0
  },
  temperature: { 
    type: Number, 
    required: true 
  },
  ecValue: { 
    type: Number, 
    required: true,
    min: 0
  },
  fertilityStatus: { 
    type: String, 
    enum: ['High', 'Optimal', 'Low'],
    default: 'Optimal'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const SoilModel = mongoose.model('Soil', soilSchema);
export default SoilModel;
