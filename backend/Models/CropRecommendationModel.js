import mongoose from 'mongoose';

const cropRecommendationSchema = new mongoose.Schema({
  recommendedCrop: { 
    type: String, 
    required: true,
    trim: true
  },
  confidenceScore: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  fertilizerSuggestion: { 
    type: String, 
    required: true 
  },
  irrigationSuggestion: { 
    type: String, 
    required: true 
  },
  season: { 
    type: String, 
    required: true,
    trim: true
  },
  soilSuitability: { 
    type: String, 
    required: true 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  moisture: { type: Number, default: 0 },
  ph: { type: Number, default: 0 },
  nitrogen: { type: Number, default: 0 },
  phosphorus: { type: Number, default: 0 },
  potassium: { type: Number, default: 0 },
  temperature: { type: Number, default: 0 },
  humidity: { type: Number, default: 0 },
  rainfall: { type: Number, default: 0 },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CropRecommendationModel = mongoose.model('CropRecommendation', cropRecommendationSchema);
export default CropRecommendationModel;
