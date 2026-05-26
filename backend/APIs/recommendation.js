import express from 'express';
import CropRecommendationModel from '../Models/CropRecommendationModel.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Rich rule-based prediction heuristics mapping advanced ML crop parameters
const evaluateCropRecommendation = (n, p, k, ph, temp, hum, rain) => {
  // Crop profiles
  const profiles = [
    {
      crop: 'Rice',
      suitability: 'High water retention clay soil, heavy rainfall',
      season: 'Kharif (Monsoon)',
      waterReq: '1200 - 1500 mm / season',
      nRange: [80, 120], pRange: [40, 60], kRange: [30, 50],
      phRange: [5.5, 6.7], tempRange: [20, 30], humRange: [75, 90], rainRange: [150, 300]
    },
    {
      crop: 'Maize',
      suitability: 'Well-drained loamy soil, moderate conditions',
      season: 'Kharif & Summer',
      waterReq: '500 - 800 mm / season',
      nRange: [70, 100], pRange: [35, 55], kRange: [35, 60],
      phRange: [5.8, 7.2], tempRange: [18, 28], humRange: [55, 75], rainRange: [60, 150]
    },
    {
      crop: 'Wheat',
      suitability: 'Clayey loamy soils, cool climate',
      season: 'Rabi (Winter)',
      waterReq: '400 - 600 mm / season',
      nRange: [60, 90], pRange: [30, 50], kRange: [30, 45],
      phRange: [6.0, 7.5], tempRange: [10, 22], humRange: [50, 65], rainRange: [30, 80]
    },
    {
      crop: 'Cotton',
      suitability: 'Black soil with good drainage, warm weather',
      season: 'Kharif',
      waterReq: '700 - 1100 mm / season',
      nRange: [50, 80], pRange: [25, 45], kRange: [60, 95],
      phRange: [5.8, 7.8], tempRange: [22, 32], humRange: [60, 80], rainRange: [50, 120]
    },
    {
      crop: 'Coffee',
      suitability: 'Acidic hilly red soil, high rain, high shade',
      season: 'Perennial',
      waterReq: '1500 - 2000 mm / season',
      nRange: [90, 130], pRange: [20, 40], kRange: [110, 160],
      phRange: [4.8, 6.0], tempRange: [15, 25], humRange: [70, 85], rainRange: [180, 350]
    },
    {
      crop: 'Legumes (Beans)',
      suitability: 'Light sandy-loam soil, low nitrogen needs',
      season: 'Rabi & Summer',
      waterReq: '300 - 450 mm / season',
      nRange: [20, 45], pRange: [50, 70], kRange: [40, 60],
      phRange: [6.0, 7.0], tempRange: [16, 26], humRange: [45, 65], rainRange: [40, 90]
    }
  ];

  let bestCrop = null;
  let highestScore = -1;
  let finalConfidence = 50;

  profiles.forEach(pProfile => {
    let score = 0;
    
    // Evaluate conditions and calculate proximity score
    if (n >= pProfile.nRange[0] && n <= pProfile.nRange[1]) score += 15;
    else score += Math.max(0, 15 - Math.min(Math.abs(n - pProfile.nRange[0]), Math.abs(n - pProfile.nRange[1])) * 0.3);

    if (p >= pProfile.pRange[0] && p <= pProfile.pRange[1]) score += 15;
    else score += Math.max(0, 15 - Math.min(Math.abs(p - pProfile.pRange[0]), Math.abs(p - pProfile.pRange[1])) * 0.4);

    if (k >= pProfile.kRange[0] && k <= pProfile.kRange[1]) score += 15;
    else score += Math.max(0, 15 - Math.min(Math.abs(k - pProfile.kRange[0]), Math.abs(k - pProfile.kRange[1])) * 0.2);

    if (ph >= pProfile.phRange[0] && ph <= pProfile.phRange[1]) score += 20;
    else score += Math.max(0, 20 - Math.min(Math.abs(ph - pProfile.phRange[0]), Math.abs(ph - pProfile.phRange[1])) * 4);

    if (temp >= pProfile.tempRange[0] && temp <= pProfile.tempRange[1]) score += 15;
    else score += Math.max(0, 15 - Math.min(Math.abs(temp - pProfile.tempRange[0]), Math.abs(temp - pProfile.tempRange[1])) * 1.5);

    if (hum >= pProfile.humRange[0] && hum <= pProfile.humRange[1]) score += 10;
    else score += Math.max(0, 10 - Math.min(Math.abs(hum - pProfile.humRange[0]), Math.abs(hum - pProfile.humRange[1])) * 0.5);

    if (rain >= pProfile.rainRange[0] && rain <= pProfile.rainRange[1]) score += 10;
    else score += Math.max(0, 10 - Math.min(Math.abs(rain - pProfile.rainRange[0]), Math.abs(rain - pProfile.rainRange[1])) * 0.2);

    if (score > highestScore) {
      highestScore = score;
      bestCrop = pProfile;
      finalConfidence = Math.min(98, Math.round(score));
    }
  });

  // Optimize smart fertilizer recommendations
  let fertilizerRec = 'No major N-P-K nutrient deficits detected. Apply standard organic compost.';
  const deficits = [];
  if (n < bestCrop.nRange[0]) {
    deficits.push(`Nitrogen low: Apply Urea or Ammonium Sulfate to raise N level (Target: ${bestCrop.nRange[0]} mg/kg).`);
  }
  if (p < bestCrop.pRange[0]) {
    deficits.push(`Phosphorus low: Apply Single Superphosphate (SSP) or DAP (Target: ${bestCrop.pRange[0]} mg/kg).`);
  }
  if (k < bestCrop.kRange[0]) {
    deficits.push(`Potassium low: Apply Muriate of Potash (MOP) to boost potassium (Target: ${bestCrop.kRange[0]} mg/kg).`);
  }

  if (deficits.length > 0) {
    fertilizerRec = deficits.join(' ');
  }

  // Calculate irrigation strategy
  let irrigation = 'Standard moderate watering schedule recommended.';
  if (bestCrop.crop === 'Rice') {
    irrigation = 'Enforce continuous flooding. Maintain 2-5 cm of standing water in crop fields.';
  } else if (bestCrop.crop === 'Coffee') {
    irrigation = 'Enforce drip irrigation; maintain high moisture levels around roots.';
  } else if (bestCrop.crop === 'Wheat') {
    irrigation = 'Apply watering at crown root initiation and flowering stages.';
  } else if (rain > 150) {
    irrigation = 'Heavy rain detected; pause motor schedules and ensure efficient field drainage.';
  } else {
    irrigation = 'Apply scheduled sprinkler irrigation for 25 minutes twice daily.';
  }

  return {
    recommendedCrop: bestCrop.crop,
    confidenceScore: finalConfidence,
    fertilizerSuggestion: fertilizerRec,
    irrigationSuggestion: irrigation,
    season: bestCrop.season,
    soilSuitability: bestCrop.suitability
  };
};

// POST /api/recommendation/generate - Run crop recommendation classifier
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { moisture, ph, nitrogen, phosphorus, potassium, temperature, humidity, rainfall } = req.body;

    if ([moisture, ph, nitrogen, phosphorus, potassium, temperature, humidity, rainfall].some(val => val === undefined || val === null)) {
      return res.status(400).json({ error: 'All fields (moisture, ph, nitrogen, phosphorus, potassium, temperature, humidity, rainfall) are required.' });
    }

    const n = parseFloat(nitrogen);
    const p = parseFloat(phosphorus);
    const k = parseFloat(potassium);
    const phVal = parseFloat(ph);
    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const rain = parseFloat(rainfall);

    const recommendation = evaluateCropRecommendation(n, p, k, phVal, temp, hum, rain);

    const newRecommendation = new CropRecommendationModel({
      recommendedCrop: recommendation.recommendedCrop,
      confidenceScore: recommendation.confidenceScore,
      fertilizerSuggestion: recommendation.fertilizerSuggestion,
      irrigationSuggestion: recommendation.irrigationSuggestion,
      season: recommendation.season,
      soilSuitability: recommendation.soilSuitability
    });

    await newRecommendation.save();
    res.status(200).json(newRecommendation);
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({ error: 'Failed to generate smart crop recommendation.' });
  }
});

// GET /api/recommendation/history - Fetch historical recommendations
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const history = await CropRecommendationModel.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query recommendation history logs.' });
  }
});

export default router;
