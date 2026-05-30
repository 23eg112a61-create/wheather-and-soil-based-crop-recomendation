import express from 'express';
import SoilModel from '../Models/SoilModel.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Helper: Calculate soil fertility rating based on standard NPK guidelines
const determineFertility = (n, p, k) => {
  if (n < 50 || p < 20 || k < 100) return 'Low';
  if (n > 150 && p > 80 && k > 250) return 'High';
  return 'Optimal';
};

// POST /api/soil/add - Add a new soil log
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { moisture, ph, nitrogen, phosphorus, potassium, temperature, ecValue } = req.body;

    if ([moisture, ph, nitrogen, phosphorus, potassium, temperature, ecValue].some(val => val === undefined || val === null)) {
      return res.status(400).json({ error: 'All fields (moisture, ph, nitrogen, phosphorus, potassium, temperature, ecValue) are required.' });
    }

    const n = parseFloat(nitrogen);
    const p = parseFloat(phosphorus);
    const k = parseFloat(potassium);

    const calculatedFertility = determineFertility(n, p, k);

    const newSoil = new SoilModel({
      userId: req.user.id,
      moisture: parseFloat(moisture),
      ph: parseFloat(ph),
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      temperature: parseFloat(temperature),
      ecValue: parseFloat(ecValue),
      fertilityStatus: calculatedFertility
    });

    await newSoil.save();
    res.status(201).json({ message: 'Soil analysis data recorded successfully!', soil: newSoil });
  } catch (error) {
    console.error('Soil record error:', error);
    res.status(500).json({ error: 'An internal server error occurred while writing soil records.' });
  }
});

// GET /api/soil/all - Fetch all soil telemetry history
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const history = await SoilModel.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve soil data history logs.' });
  }
});

// GET /api/soil/:id - Fetch details of a single record
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const record = await SoilModel.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Soil record entry not found.' });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query database for specific soil record.' });
  }
});

export default router;
