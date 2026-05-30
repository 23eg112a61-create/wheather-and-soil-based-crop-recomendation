import mongoose from 'mongoose';

const diseaseDetectionSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: true 
  },
  diseaseName: { 
    type: String, 
    required: true,
    trim: true
  },
  confidence: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  treatment: { 
    type: String, 
    required: true 
  },
  prevention: { 
    type: String, 
    required: true 
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

const DiseaseDetectionModel = mongoose.model('DiseaseDetection', diseaseDetectionSchema);
export default DiseaseDetectionModel;
