import mongoose from 'mongoose';

// 1. Farmer Locations Schema
const FarmerLocationsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentLocation: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  village: { type: String, required: true },
  gpsCoordinates: { type: String, required: true }, // e.g. "30.9009° N, 75.8573° E"
  boundaryCoordinates: [{ type: String }], // List of GPS points mapping the boundary
  farmArea: { type: String, required: true }, // e.g. "12 Hectares"
  soilZone: { type: String, required: true }, // e.g. "Clay Loam Zone Alpha"
  createdAt: { type: Date, default: Date.now }
});

// 2. Farmer Search History Schema
const FarmerSearchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  category: { type: String, enum: ['Soil', 'Crop', 'Disease', 'Weather', 'General'], required: true },
  responseGenerated: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 3. Farmer Weather Queries Schema
const FarmerWeatherQueriesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weatherLocation: { type: String, required: true },
  temperature: { type: Number, required: true },
  rainfall: { type: Number, required: true }, // in mm
  humidity: { type: Number, required: true }, // in %
  forecastReturned: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 4. Farmer AI Recommendations Schema
const FarmerRecommendationsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropRecommended: { type: String, required: true },
  confidenceScore: { type: Number, required: true, min: 0, max: 100 },
  reason: { type: String, required: true },
  expertApprovalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// 5. Farmer Disease Reports Schema
const FarmerDiseaseReportsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedLeafImage: { type: String, required: true }, // filename/URL
  diseaseDetected: { type: String, required: true },
  confidenceScore: { type: Number, required: true, min: 0, max: 100 },
  treatmentSuggested: { type: String, required: true },
  expertValidation: { type: String, enum: ['Pending Verification', 'Validated', 'Invalid Diagnosis'], default: 'Pending Verification' },
  createdAt: { type: Date, default: Date.now }
});

// 6. Farmer Consultations Schema
const FarmerConsultationsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expertName: { type: String, required: true },
  chatTranscript: [{
    sender: { type: String, required: true }, // "farmer" or "expert"
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  resolutionStatus: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  createdAt: { type: Date, default: Date.now }
});

// 7. Farmer Activity Logs Schema (IP Auditing)
const FarmerActivityLogsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  module: { type: String, required: true }, // e.g. "Authentication", "Crop Recommendation", "Disease Detection"
  status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  ipAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 8. Farmer Advisories Schema
const FarmerAdvisorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advisoryType: { type: String, enum: ['Frost Alert', 'Monsoon Advisory', 'Pest Outbreak', 'Fertilizer Cycle'], required: true },
  message: { type: String, required: true },
  acknowledgementStatus: { type: String, enum: ['Unread', 'Read', 'Acknowledged'], default: 'Unread' },
  createdAt: { type: Date, default: Date.now }
});

// 9. Farmer Fertilizer Recommendation Schema
const FarmerFertilizerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nValue: { type: Number, required: true },
  pValue: { type: Number, required: true },
  kValue: { type: Number, required: true },
  soilType: { type: String, required: true },
  recommendedFertilizer: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g. "250 kg/Hectare"
  applicationSchedule: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const FarmerLocations = mongoose.model('FarmerLocations', FarmerLocationsSchema);
export const FarmerSearchHistory = mongoose.model('FarmerSearchHistory', FarmerSearchHistorySchema);
export const FarmerWeatherQueries = mongoose.model('FarmerWeatherQueries', FarmerWeatherQueriesSchema);
export const FarmerRecommendations = mongoose.model('FarmerRecommendations', FarmerRecommendationsSchema);
export const FarmerDiseaseReports = mongoose.model('FarmerDiseaseReports', FarmerDiseaseReportsSchema);
export const FarmerConsultations = mongoose.model('FarmerConsultations', FarmerConsultationsSchema);
export const FarmerActivityLogs = mongoose.model('FarmerActivityLogs', FarmerActivityLogsSchema);
export const FarmerAdvisory = mongoose.model('FarmerAdvisory', FarmerAdvisorySchema);
export const FarmerFertilizer = mongoose.model('FarmerFertilizer', FarmerFertilizerSchema);
