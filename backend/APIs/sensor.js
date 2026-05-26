import express from 'express';
import SensorModel from '../Models/SensorModel.js';
import SoilModel from '../Models/SoilModel.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// POST /api/sensor/upload - IoT ESP32 payload upload endpoint
router.post('/upload', async (req, res) => {
  try {
    const { deviceId, sensorType, batteryLevel, status, soilData } = req.body;

    if (!deviceId || !sensorType || batteryLevel === undefined) {
      return res.status(400).json({ error: 'deviceId, sensorType, and batteryLevel are required parameters.' });
    }

    // 1. Update or create the Sensor registry
    let sensor = await SensorModel.findOne({ deviceId });
    if (!sensor) {
      sensor = new SensorModel({ deviceId, sensorType, batteryLevel, status: status || 'online' });
    } else {
      sensor.batteryLevel = parseInt(batteryLevel);
      sensor.status = status || 'online';
      sensor.lastActive = new Date();
    }
    await sensor.save();

    // 2. If soilData is provided (IoT telemetry upload), write directly to SoilModel
    let loggedSoil = null;
    if (soilData) {
      const { moisture, ph, nitrogen, phosphorus, potassium, temperature, ecValue } = soilData;
      
      if ([moisture, ph, nitrogen, phosphorus, potassium, temperature, ecValue].every(val => val !== undefined && val !== null)) {
        // Calculate dynamic fertility status
        const n = parseFloat(nitrogen);
        const p = parseFloat(phosphorus);
        const k = parseFloat(potassium);
        const fertility = (n < 50 || p < 20 || k < 100) ? 'Low' : (n > 150 && p > 80 && k > 250) ? 'High' : 'Optimal';

        loggedSoil = new SoilModel({
          moisture: parseFloat(moisture),
          ph: parseFloat(ph),
          nitrogen: n,
          phosphorus: p,
          potassium: k,
          temperature: parseFloat(temperature),
          ecValue: parseFloat(ecValue),
          fertilityStatus: fertility
        });
        await loggedSoil.save();
      }
    }

    res.status(200).json({
      message: 'IoT sensor telemetry logged successfully!',
      sensorStatus: sensor,
      soilRecord: loggedSoil
    });
  } catch (error) {
    console.error('IoT upload error:', error);
    res.status(500).json({ error: 'Failed to process incoming IoT sensor data.' });
  }
});

// GET /api/sensor/status - Retrieve overall status logs of IoT nodes
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const sensors = await SensorModel.find().sort({ lastActive: -1 });
    
    // Seed initial dummy sensors if empty to make the dashboard look beautiful immediately
    if (sensors.length === 0) {
      const dummySensors = [
        { deviceId: 'NODE-01-NPK', sensorType: 'Soil NPK Sensor', batteryLevel: 89, status: 'online' },
        { deviceId: 'NODE-02-PH', sensorType: 'Soil pH Probe', batteryLevel: 94, status: 'online' },
        { deviceId: 'NODE-03-MOIST', sensorType: 'Foliar Moisture Sensor', batteryLevel: 42, status: 'online' },
        { deviceId: 'NODE-04-VALVE', sensorType: 'Solenoid Irrigation Valve', batteryLevel: 75, status: 'maintenance' }
      ];
      const saved = await SensorModel.insertMany(dummySensors);
      return res.status(200).json(saved);
    }

    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query database for IoT sensor status inventory.' });
  }
});

export default router;
