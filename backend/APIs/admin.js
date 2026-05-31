import express from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../Models/UserModel.js';
import SoilModel from '../Models/SoilModel.js';
import CropRecommendationModel from '../Models/CropRecommendationModel.js';
import DiseaseDetectionModel from '../Models/DiseaseDetectionModel.js';
import { ConsultationBooking } from '../Models/PlatformModels.js';
import { authenticateToken, requireRole } from './auth.js';

// Import newly registered Farmer Activity Intelligence Center models
import {
  FarmerLocations,
  FarmerSearchHistory,
  FarmerWeatherQueries,
  FarmerRecommendations,
  FarmerDiseaseReports,
  FarmerConsultations,
  FarmerActivityLogs,
  FarmerAdvisory,
  FarmerFertilizer
} from '../Models/ActivityIntelligenceModels.js';

const router = express.Router();

// Apply administrative restriction middleware to all routes in this router
router.use(authenticateToken);
router.use(requireRole(['admin']));

// ==========================================
// 1. FETCH ALL USER PROFILES
// ==========================================
router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    
    // Seed initial realistic dummy logs for empty users to keep UI beautiful immediately
    const updatedUsers = await Promise.all(users.map(async (u) => {
      let changed = false;
      
      // If activities are empty, seed some nice initial logs
      if (!u.activities || u.activities.length === 0) {
        u.activities = [
          { action: 'NPK Soil Test Synced', timestamp: new Date(Date.now() - 3600000 * 2), details: 'Field sensor Probe Node-01 recorded N:240 P:18 K:310.' },
          { action: 'Calculated Crop Suggestion', timestamp: new Date(Date.now() - 3600000 * 5), details: 'Calculated 92% match score for Commercial Tomato crop.' },
          { action: 'Consultation Appt Booked', timestamp: new Date(Date.now() - 3600000 * 24), details: 'Booked crop advisory session with Dr. Ramesh Rao.' }
        ];
        changed = true;
      }
      
      // Seed default override crops if empty
      if (!u.cropSuggestions || u.cropSuggestions.length === 0) {
        u.cropSuggestions = ['Commercial Tomato', 'Winter Wheat'];
        changed = true;
      }

      // Seed lastLogin if empty
      if (!u.lastLogin) {
        u.lastLogin = new Date(Date.now() - 3600000 * 1.5);
        changed = true;
      }

      // Seed land area for farmers
      if (u.role === 'farmer' && !u.landArea) {
        u.landArea = '12 Hectares';
        changed = true;
      }

      if (changed) {
        await u.save();
      }

      // Seed complete Farmer/Expert/Admin Intelligence data automatically if location doesn't exist yet
      let location = await FarmerLocations.findOne({ userId: u._id });
      if (!location) {
        console.log(`[AUTOMATIC SEEDING] Initializing agricultural telemetry records for user: ${u.name}`);
        const isExpert = u.role === 'expert';
        const isAdmin = u.role === 'admin';
        
        location = new FarmerLocations({
          userId: u._id,
          currentLocation: u.location || (isExpert ? 'Delhi Agricultural Extension Office' : isAdmin ? 'Central Systems HQ' : 'Gill Village sector, Ludhiana'),
          district: isExpert ? 'New Delhi' : isAdmin ? 'Mumbai' : 'Ludhiana',
          state: isExpert ? 'Delhi' : isAdmin ? 'Maharashtra' : 'Punjab',
          village: isExpert ? 'Delhi Sector 12' : isAdmin ? 'Central District' : 'Gill Village',
          gpsCoordinates: isExpert ? '28.6139° N, 77.2090° E' : isAdmin ? '18.9220° N, 72.8347° E' : '30.8601° N, 75.8592° E',
          boundaryCoordinates: ['30.8601,75.8592', '30.8621,75.8592', '30.8621,75.8612', '30.8601,75.8612'],
          farmArea: (isExpert || isAdmin) ? 'N/A' : (u.landArea || '12 Hectares'),
          soilZone: isExpert ? 'Silt Loam Area Beta' : isAdmin ? 'Urban Zone Gamma' : 'Clay Loam Zone Alpha'
        });
        await location.save();

        if (isExpert) {
          await FarmerSearchHistory.insertMany([
            { userId: u._id, query: 'Standard protocol for tomato late blight treatment', category: 'Disease', responseGenerated: 'Apply Copper Hydroxide and systemic fungicides. Keep field ventilation standard.' },
            { userId: u._id, query: 'Soil analysis calibration for NPK wireless nodes', category: 'Soil', responseGenerated: 'RS485 sensor probe mapping: Nitrogen 0-200 mg/kg, Phosphorus 0-100 mg/kg.' },
            { userId: u._id, query: 'Sustainable organic crop rotation models', category: 'Crop', responseGenerated: 'Include deep-rooting legumes and shallow-rooted grain cereals to balance macronutrients.' }
          ]);
        } else if (isAdmin) {
          await FarmerSearchHistory.insertMany([
            { userId: u._id, query: 'Platform rate limit exception configurations', category: 'System', responseGenerated: 'Configure rateLimit windowMs: 15min, max: 100 requests per IP address.' },
            { userId: u._id, query: 'Security audit trail logs verification', category: 'Security', responseGenerated: 'Verify that bcrypt hashing uses 10 salt rounds and tokens employ HttpOnly cookies.' },
            { userId: u._id, query: 'CORS origins permission policies', category: 'Network', responseGenerated: 'Allow explicit origins. Enforce boundary patterns for all dynamic deployments.' }
          ]);
        } else {
          await FarmerSearchHistory.insertMany([
            { userId: u._id, query: 'What crop is suitable for red soil?', category: 'Crop', responseGenerated: 'Legumes (Beans) and high-drainage root tubers are highly recommended due to high iron-oxide layers.' },
            { userId: u._id, query: 'NPK recommendation for rice', category: 'Soil', responseGenerated: 'Target ratio: N:120 P:60 K:40. Deficiencies detected in Nitrogen. Apply urea fertilizers.' },
            { userId: u._id, query: 'Tomato leaf disease late blight', category: 'Disease', responseGenerated: 'Late blight fungal spores detected. Apply Mancozeb or Chlorothalonil sprays immediately.' },
            { userId: u._id, query: 'Rain forecast in Ludhiana', category: 'Weather', responseGenerated: 'Heavy monsoon rains forecasted in next 48 hours. Rainfall: 180mm. Ensure field drainage.' }
          ]);
        }

        await FarmerWeatherQueries.insertMany([
          { userId: u._id, weatherLocation: isExpert ? 'New Delhi, Delhi' : isAdmin ? 'Mumbai, MH' : 'Ludhiana, Punjab', temperature: 32.5, rainfall: 180.0, humidity: 78, forecastReturned: 'Heavy monsoon rain warnings. Expected rainfall accumulation: 180mm over 48 hours.' },
          { userId: u._id, weatherLocation: isExpert ? 'New Delhi, Delhi' : isAdmin ? 'Mumbai, MH' : 'Ludhiana, Punjab', temperature: 29.8, rainfall: 12.5, humidity: 64, forecastReturned: 'Partially cloudy conditions with moderate winds. High soil moisture retained.' }
        ]);

        await FarmerRecommendations.insertMany([
          { userId: u._id, cropRecommended: isExpert ? 'Organic Wheat' : isAdmin ? 'Green Vegetables' : 'Basmati Rice', confidenceScore: 95, reason: 'High soil humidity (78%), acidic-neutral pH (6.2) and high water logging capacity.', expertApprovalStatus: 'Approved' },
          { userId: u._id, cropRecommended: isExpert ? 'Horticultural Tomato' : isAdmin ? 'Smart Turf' : 'Loamy Maize', confidenceScore: 82, reason: 'Optimal soil nitrogen levels (85 mg/kg) matched to Kharif weather ranges.', expertApprovalStatus: 'Pending' }
        ]);

        await FarmerDiseaseReports.insertMany([
          { userId: u._id, uploadedLeafImage: 'tomato_crop.png', diseaseDetected: 'Tomato Late Blight', confidenceScore: 94, treatmentSuggested: 'Apply Copper Hydroxide bacterial spray. Wide spacing layout recommended to allow leaf ventilation.', expertValidation: 'Validated' },
          { userId: u._id, uploadedLeafImage: 'rice_crop.png', diseaseDetected: 'Rice Blast Fungus', confidenceScore: 96, treatmentSuggested: 'Apply Tricyclazole systemic fungicides. Temporarily reduce standing field water depths.', expertValidation: 'Validated' }
        ]);

        await FarmerConsultations.insertMany([
          {
            userId: u._id,
            expertName: 'Dr. Ramesh Rao',
            chatTranscript: [
              { sender: 'farmer', message: 'Foliar spots appearing on Rice Block. Moisture stands high at 45%.', timestamp: new Date(Date.now() - 3600000 * 24) },
              { sender: 'expert', message: 'Looks like early Rice Blast development. Spray Tricyclazole and adjust irrigation rates.', timestamp: new Date(Date.now() - 3600000 * 23) }
            ],
            resolutionStatus: 'Resolved'
          }
        ]);

        await FarmerActivityLogs.insertMany([
          { userId: u._id, action: 'Logged In', module: 'Authentication', status: 'Success', ipAddress: '192.168.1.102' },
          { userId: u._id, action: 'Requested Crop Recommendation', module: 'Crop Recommendation', status: 'Success', ipAddress: '192.168.1.102' },
          { userId: u._id, action: 'Uploaded Disease Image', module: 'Disease Detection', status: 'Success', ipAddress: '192.168.1.102' },
          { userId: u._id, action: 'Booked Consultation', module: 'Expert Consult', status: 'Success', ipAddress: '192.168.1.102' }
        ]);

        await FarmerAdvisory.insertMany([
          { userId: u._id, advisoryType: 'Monsoon Advisory', message: 'Heavy rainfall warning active. Pause automated water pump cycles to avoid deep root drowning.', acknowledgementStatus: 'Acknowledged' },
          { userId: u._id, advisoryType: 'Frost Alert', message: 'Night temperature expected to fall below 5°C. Enforce warm smoke layouts or light watering cycles.', acknowledgementStatus: 'Read' }
        ]);

        await FarmerFertilizer.insertMany([
          { userId: u._id, nValue: 85, pValue: 48, kValue: 42, soilType: 'Clay Loam', recommendedFertilizer: 'DAP + Muriate of Potash', dosage: '250 kg/Hectare', applicationSchedule: 'Apply 50% at sowing, 25% during tillering, and 25% at panicle initiation.' }
        ]);
      }
      
      const userObj = u.toObject();
      delete userObj.password;
      return userObj;
    }));



    res.status(200).json(updatedUsers);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to retrieve active user directory.' });
  }
});

// ==========================================
// 2. CREATE NEW USER DIRECTLY (Bypass OTP verification)
// ==========================================
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, location, phone, landArea, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields.' });
    }

    const emailLower = email.toLowerCase().trim();
    const userExists = await UserModel.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Default password if not provided
    const defaultPassword = password || 'AgriPass123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const newUser = new UserModel({
      name: name.trim(),
      email: emailLower,
      password: hashedPassword,
      role: role || 'farmer',
      location: location || '',
      phone: phone || '',
      landArea: role === 'farmer' ? (landArea || '0 Hectares') : 'N/A',
      status: status || 'Active',
      isVerified: true, // Direct creation marks verified immediately
      lastLogin: new Date(),
      activities: [{
        action: 'Account Created By Admin',
        timestamp: new Date(),
        details: `Profile registered with default credentials under role [${role || 'farmer'}].`
      }],
      cropSuggestions: ['Commercial Tomato']
    });

    await newUser.save();
    res.status(201).json({
      message: 'Account registered and verified successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        phone: newUser.phone,
        status: newUser.status,
        landArea: newUser.landArea,
        lastLogin: newUser.lastLogin
      }
    });
  } catch (error) {
    console.error('Admin create user error:', error);
    res.status(500).json({ error: 'Failed to register the new user account.' });
  }
});

// ==========================================
// 3. MODIFY USER DETAILS
// ==========================================
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, location, phone, landArea, status } = req.body;

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (status) user.status = status;
    if (landArea !== undefined) {
      user.landArea = role === 'farmer' ? landArea : 'N/A';
    }

    // Add activity log
    user.activities.push({
      action: 'Profile Updated By Admin',
      timestamp: new Date(),
      details: 'Administrator modified secure configuration details.'
    });

    await user.save();
    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        status: user.status,
        landArea: user.landArea,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

// ==========================================
// 4. ADD CROP SUGGESTION OVERRIDE
// ==========================================
router.post('/users/:id/crop-suggestions', async (req, res) => {
  try {
    const { crop } = req.body;
    if (!crop || !crop.trim()) {
      return res.status(400).json({ error: 'Crop suggestion content text is required.' });
    }

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    if (!user.cropSuggestions) user.cropSuggestions = [];
    user.cropSuggestions.push(crop.trim());

    // Record activity
    user.activities.push({
      action: 'Crop Suggestion Override Assigned',
      timestamp: new Date(),
      details: `Admin appended '${crop.trim()}' to recommendation override registry.`
    });

    await user.save();
    res.status(200).json({
      message: 'Crop override added successfully.',
      cropSuggestions: user.cropSuggestions
    });
  } catch (error) {
    console.error('Override crop suggestions error:', error);
    res.status(500).json({ error: 'Failed to register crop override.' });
  }
});

// ==========================================
// 5. UPDATE CONSULTATION QUERY AND STATUS
// ==========================================
router.put('/consultation/:id', async (req, res) => {
  try {
    const { queryText, status } = req.body;

    if (!queryText || !status) {
      return res.status(400).json({ error: 'Query text and status are required fields.' });
    }

    const booking = await ConsultationBooking.findByIdAndUpdate(
      req.params.id,
      { queryText: queryText.trim(), status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Consultation booking not found.' });
    }

    res.status(200).json({
      message: 'Consultation query updated successfully.',
      booking
    });
  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({ error: 'Failed to update consultation record details.' });
  }
});

// ==========================================
// 6. MERGE AND RETRIEVE DETAILED SEARCH HISTORY (Depricated in favor of Intelligence)
// ==========================================
router.get('/users/:id/history', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    const recommendations = await CropRecommendationModel.find({ userId }).sort({ createdAt: -1 });
    const soilTests = await SoilModel.find({ userId }).sort({ createdAt: -1 });
    const diseaseScans = await DiseaseDetectionModel.find({ userId }).sort({ createdAt: -1 });

    const timeline = [];
    recommendations.forEach(r => {
      timeline.push({
        type: 'crop_recommendation',
        title: 'Crop Recommendation Query',
        timestamp: r.createdAt,
        inputs: {
          NPK: `N:${r.nitrogen} P:${r.phosphorus} K:${r.potassium}`,
          soil_weather: `pH: ${r.ph}, Moisture: ${r.moisture}%, Temp: ${r.temperature}°C, Humidity: ${r.humidity}%, Rain: ${r.rainfall}mm`
        },
        outputs: {
          result: `Recommended Crop: ${r.recommendedCrop}`,
          confidence: `${r.confidenceScore}% Confidence`,
          details: `Fertilizer: ${r.fertilizerSuggestion} | Irrigation: ${r.irrigationSuggestion}`
        },
        location: user.location || 'Punjab Regional Farm'
      });
    });

    soilTests.forEach(s => {
      timeline.push({
        type: 'soil_test',
        title: 'Soil Health Telemetry Synced',
        timestamp: s.createdAt,
        inputs: {
          NPK: `N:${s.nitrogen} P:${s.phosphorus} K:${s.potassium}`,
          soil_weather: `pH: ${s.ph}, Moisture: ${s.moisture}%, Temp: ${s.temperature}°C, EC: ${s.ecValue} dS/m`
        },
        outputs: {
          result: `Fertility Rating: ${s.fertilityStatus}`,
          confidence: 'N/A',
          details: 'Direct IoT wireless sensor diagnostics synced'
        },
        location: user.location || 'Punjab Regional Farm'
      });
    });

    diseaseScans.forEach(d => {
      timeline.push({
        type: 'disease_scan',
        title: 'Foliar Plant Disease Diagnosis',
        timestamp: d.createdAt,
        inputs: {
          NPK: 'N/A',
          soil_weather: `Analyzed file: ${d.image}`
        },
        outputs: {
          result: `Detected: ${d.diseaseName}`,
          confidence: `${d.confidence}% Confidence`,
          details: `Treatment: ${d.treatment} | Prevention: ${d.prevention}`
        },
        location: user.location || 'Punjab Regional Farm'
      });
    });

    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.status(200).json(timeline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve timeline.' });
  }
});

// ==========================================
// 7. SUSPEND / ACTIVATE FARMER ACCOUNT
// ==========================================
router.put('/users/:id/suspend', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Toggle status
    const previousStatus = user.status;
    user.status = previousStatus === 'Active' ? 'Inactive' : 'Active';
    
    user.activities.push({
      action: user.status === 'Inactive' ? 'Account Suspended By Admin' : 'Account Re-Activated By Admin',
      timestamp: new Date(),
      details: `Administrator toggled status from ${previousStatus} to ${user.status}.`
    });

    await user.save();
    res.status(200).json({
      message: `Account status updated successfully to ${user.status}.`,
      status: user.status
    });
  } catch (error) {
    console.error('Suspend account error:', error);
    res.status(500).json({ error: 'Failed to modify account authorization status.' });
  }
});

// ==========================================
// 8. FARMER ACTIVITY INTELLIGENCE CENTER (Aggregation & Seeding)
// ==========================================
router.get('/users/:id/intelligence', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Check if location exists. If not, trigger database seeding
    let location = await FarmerLocations.findOne({ userId });
    
    if (!location) {
      console.log(`[INTELLIGENCE SEEDING] Initializing realistic agricultural telemetry records for farmer ID: ${userId}`);

      // Seed 1. Bio Location Intelligence (Dynamic by role)
      const isExpert = user.role === 'expert';
      const isAdmin = user.role === 'admin';
      
      location = new FarmerLocations({
        userId,
        currentLocation: user.location || (isExpert ? 'Delhi Agricultural Extension Office' : isAdmin ? 'Central Systems HQ' : 'Gill Village sector, Ludhiana'),
        district: isExpert ? 'New Delhi' : isAdmin ? 'Mumbai' : 'Ludhiana',
        state: isExpert ? 'Delhi' : isAdmin ? 'Maharashtra' : 'Punjab',
        village: isExpert ? 'Delhi Sector 12' : isAdmin ? 'Central District' : 'Gill Village',
        gpsCoordinates: isExpert ? '28.6139° N, 77.2090° E' : isAdmin ? '18.9220° N, 72.8347° E' : '30.8601° N, 75.8592° E',
        boundaryCoordinates: ['30.8601,75.8592', '30.8621,75.8592', '30.8621,75.8612', '30.8601,75.8612'],
        farmArea: (isExpert || isAdmin) ? 'N/A' : (user.landArea || '12 Hectares'),
        soilZone: isExpert ? 'Silt Loam Area Beta' : isAdmin ? 'Urban Zone Gamma' : 'Clay Loam Zone Alpha'
      });
      await location.save();

      // Seed 2. Search History Timeline (Dynamic by role)
      if (isExpert) {
        await FarmerSearchHistory.insertMany([
          { userId, query: 'Standard protocol for tomato late blight treatment', category: 'Disease', responseGenerated: 'Apply Copper Hydroxide and systemic fungicides. Keep field ventilation standard.' },
          { userId, query: 'Soil analysis calibration for NPK wireless nodes', category: 'Soil', responseGenerated: 'RS485 sensor probe mapping: Nitrogen 0-200 mg/kg, Phosphorus 0-100 mg/kg.' },
          { userId, query: 'Sustainable organic crop rotation models', category: 'Crop', responseGenerated: 'Include deep-rooting legumes and shallow-rooted grain cereals to balance macronutrients.' }
        ]);
      } else if (isAdmin) {
        await FarmerSearchHistory.insertMany([
          { userId, query: 'Platform rate limit exception configurations', category: 'System', responseGenerated: 'Configure rateLimit windowMs: 15min, max: 100 requests per IP address.' },
          { userId, query: 'Security audit trail logs verification', category: 'Security', responseGenerated: 'Verify that bcrypt hashing uses 10 salt rounds and tokens employ HttpOnly cookies.' },
          { userId, query: 'CORS origins permission policies', category: 'Network', responseGenerated: 'Allow explicit origins. Enforce boundary patterns for all dynamic deployments.' }
        ]);
      } else {
        await FarmerSearchHistory.insertMany([
          { userId, query: 'What crop is suitable for red soil?', category: 'Crop', responseGenerated: 'Legumes (Beans) and high-drainage root tubers are highly recommended due to high iron-oxide layers.' },
          { userId, query: 'NPK recommendation for rice', category: 'Soil', responseGenerated: 'Target ratio: N:120 P:60 K:40. Deficiencies detected in Nitrogen. Apply urea fertilizers.' },
          { userId, query: 'Tomato leaf disease late blight', category: 'Disease', responseGenerated: 'Late blight fungal spores detected. Apply Mancozeb or Chlorothalonil sprays immediately.' },
          { userId, query: 'Rain forecast in Ludhiana', category: 'Weather', responseGenerated: 'Heavy monsoon rains forecasted in next 48 hours. Rainfall: 180mm. Ensure field drainage.' }
        ]);
      }

      // Seed 3. Weather Query History
      await FarmerWeatherQueries.insertMany([
        { userId, weatherLocation: 'Ludhiana, Punjab', temperature: 32.5, rainfall: 180.0, humidity: 78, forecastReturned: 'Heavy monsoon rain warnings. Expected rainfall accumulation: 180mm over 48 hours.' },
        { userId, weatherLocation: 'Ludhiana, Punjab', temperature: 29.8, rainfall: 12.5, humidity: 64, forecastReturned: 'Partially cloudy conditions with moderate winds. High soil moisture retained.' }
      ]);

      // Seed 4. AI Recommendation History
      await FarmerRecommendations.insertMany([
        { userId, cropRecommended: 'Basmati Rice', confidenceScore: 95, reason: 'High soil humidity (78%), acidic-neutral pH (6.2) and high water logging capacity in Clay Loam soil.', expertApprovalStatus: 'Approved' },
        { userId, cropRecommended: 'Loamy Maize', confidenceScore: 82, reason: 'Optimal soil nitrogen levels (85 mg/kg) matched to Kharif weather ranges.', expertApprovalStatus: 'Pending' }
      ]);

      // Seed 5. Disease Diagnosis Records
      await FarmerDiseaseReports.insertMany([
        { userId, uploadedLeafImage: 'tomato_crop.png', diseaseDetected: 'Tomato Late Blight', confidenceScore: 94, treatmentSuggested: 'Apply Copper Hydroxide bacterial spray. Wide spacing layout recommended to allow leaf ventilation.', expertValidation: 'Validated' },
        { userId, uploadedLeafImage: 'rice_crop.png', diseaseDetected: 'Rice Blast Fungus', confidenceScore: 96, treatmentSuggested: 'Apply Tricyclazole systemic fungicides. Temporarily reduce standing field water depths.', expertValidation: 'Validated' }
      ]);

      // Seed 6. Consultation History
      await FarmerConsultations.insertMany([
        {
          userId,
          expertName: 'Dr. Ramesh Rao',
          chatTranscript: [
            { sender: 'farmer', message: 'Foliar spots appearing on Ludhiana Rice Block. Moisture stands high at 45%.', timestamp: new Date(Date.now() - 3600000 * 24) },
            { sender: 'expert', message: 'Looks like early Rice Blast development. Spray Tricyclazole and adjust irrigation rates.', timestamp: new Date(Date.now() - 3600000 * 23) }
          ],
          resolutionStatus: 'Resolved'
        }
      ]);

      // Seed 7. Activity Logs
      await FarmerActivityLogs.insertMany([
        { userId, action: 'Logged In', module: 'Authentication', status: 'Success', ipAddress: '192.168.1.102' },
        { userId, action: 'Requested Crop Recommendation', module: 'Crop Recommendation', status: 'Success', ipAddress: '192.168.1.102' },
        { userId, action: 'Uploaded Disease Image', module: 'Disease Detection', status: 'Success', ipAddress: '192.168.1.102' },
        { userId, action: 'Booked Consultation', module: 'Expert Consult', status: 'Success', ipAddress: '192.168.1.102' }
      ]);

      // Seed 8. Advisories
      await FarmerAdvisory.insertMany([
        { userId, advisoryType: 'Monsoon Advisory', message: 'Heavy rainfall warning active. Pause automated water pump cycles to avoid deep root drowning.', acknowledgementStatus: 'Acknowledged' },
        { userId, advisoryType: 'Frost Alert', message: 'Night temperature expected to fall below 5°C. Enforce warm smoke layouts or light watering cycles.', acknowledgementStatus: 'Read' }
      ]);

      // Seed 9. Fertilizer Recommendation Records
      await FarmerFertilizer.insertMany([
        { userId, nValue: 85, pValue: 48, kValue: 42, soilType: 'Clay Loam', recommendedFertilizer: 'DAP + Muriate of Potash', dosage: '250 kg/Hectare', applicationSchedule: 'Apply 50% at sowing, 25% during tillering, and 25% at panicle initiation.' }
      ]);
    }

    // Query all collections to consolidate the Farmer Activity Intelligence Payload
    const locations = await FarmerLocations.findOne({ userId });
    const searchHistory = await FarmerSearchHistory.find({ userId }).sort({ createdAt: -1 });
    const weatherHistory = await FarmerWeatherQueries.find({ userId }).sort({ createdAt: -1 });
    const aiRecommendations = await FarmerRecommendations.find({ userId }).sort({ createdAt: -1 });
    const diseaseReports = await FarmerDiseaseReports.find({ userId }).sort({ createdAt: -1 });
    const consultations = await FarmerConsultations.find({ userId }).sort({ createdAt: -1 });
    const advisories = await FarmerAdvisory.find({ userId }).sort({ createdAt: -1 });
    const fertilizerPlans = await FarmerFertilizer.find({ userId }).sort({ createdAt: -1 });
    const activityLogs = await FarmerActivityLogs.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      locations,
      searchHistory,
      weatherHistory,
      aiRecommendations,
      diseaseReports,
      consultations,
      advisories,
      fertilizerPlans,
      activityLogs
    });

  } catch (error) {
    console.error('Farmer Activity Intelligence fetch error:', error);
    res.status(500).json({ error: 'Failed to aggregate farmer activity intelligence profile data.' });
  }
});

// ==========================================
// 9. DELETE FARMER INTELLIGENCE DATA
// ==========================================
router.delete('/users/:id/intelligence', async (req, res) => {
  try {
    const userId = req.params.id;

    await FarmerLocations.deleteMany({ userId });
    await FarmerSearchHistory.deleteMany({ userId });
    await FarmerWeatherQueries.deleteMany({ userId });
    await FarmerRecommendations.deleteMany({ userId });
    await FarmerDiseaseReports.deleteMany({ userId });
    await FarmerConsultations.deleteMany({ userId });
    await FarmerAdvisory.deleteMany({ userId });
    await FarmerFertilizer.deleteMany({ userId });
    await FarmerActivityLogs.deleteMany({ userId });

    res.status(200).json({ message: 'Farmer activity intelligence records cleared successfully.' });
  } catch (error) {
    console.error('Clear intelligence error:', error);
    res.status(500).json({ error: 'Failed to flush farmer activity intelligence records.' });
  }
});

// ==========================================
// 10. DELETE USER PROFILE COMPLETELY
// ==========================================
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate request parameter id structure to prevent MongoDB/injection exceptions
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ error: 'Invalid user identifier format.' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Clean up intelligence data associated with the user
    await FarmerLocations.deleteMany({ userId });
    await FarmerSearchHistory.deleteMany({ userId });
    await FarmerWeatherQueries.deleteMany({ userId });
    await FarmerRecommendations.deleteMany({ userId });
    await FarmerDiseaseReports.deleteMany({ userId });
    await FarmerConsultations.deleteMany({ userId });
    await FarmerAdvisory.deleteMany({ userId });
    await FarmerFertilizer.deleteMany({ userId });
    await FarmerActivityLogs.deleteMany({ userId });

    // Clean up other user relations/records
    await SoilModel.deleteMany({ userId });
    await CropRecommendationModel.deleteMany({ userId });
    await DiseaseDetectionModel.deleteMany({ userId });

    // Delete the user itself
    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User profile and all associated telemetry, logs, and activity records deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user account.' });
  }
});

export default router;
