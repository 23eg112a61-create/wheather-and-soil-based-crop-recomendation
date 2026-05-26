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
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CropRecommendationModel = mongoose.model('CropRecommendation', cropRecommendationSchema);
export default CropRecommendationModel;
