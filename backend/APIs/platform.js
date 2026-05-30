import express from 'express';
import { authenticateToken, requireRole } from './auth.js';
import { MarketplaceItem, ConsultationBooking, LivestockRecord } from '../Models/PlatformModels.js';

const router = express.Router();

// ==========================================
// 1. AGRICULTURAL MARKETPLACE ENDPOINTS
// ==========================================

// GET /api/platform/marketplace - List items
router.get('/marketplace', authenticateToken, async (req, res) => {
  try {
    const items = await MarketplaceItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve marketplace catalog items.' });
  }
});

// POST /api/platform/marketplace - List new item for sale
router.post('/marketplace', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, price, quantity, sellerName } = req.body;

    if (!name || !description || !category || !price || !quantity || !sellerName) {
      return res.status(400).json({ error: 'All fields (name, description, category, price, quantity, sellerName) are required.' });
    }

    const newItem = new MarketplaceItem({
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      sellerName: sellerName.trim(),
      status: 'Available'
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post item to marketplace.' });
  }
});

// PUT /api/platform/marketplace/moderate/:id - Moderate/approve marketplace items (Admin role required)
router.put('/marketplace/moderate/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Available', 'Sold', 'Pending Moderation'].includes(status)) {
      return res.status(400).json({ error: 'Invalid moderation status.' });
    }

    const item = await MarketplaceItem.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Marketplace item not found.' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Moderation action failed.' });
  }
});

// ==========================================
// 2. EXPERT CONSULTATION ENDPOINTS
// ==========================================

// GET /api/platform/consultation - List consultation history/sessions
router.get('/consultation', authenticateToken, async (req, res) => {
  try {
    const bookings = await ConsultationBooking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query consultation sessions.' });
  }
});

// POST /api/platform/consultation/book - Book/post a new consultation booking
router.post('/consultation/book', authenticateToken, async (req, res) => {
  try {
    const { farmerName, expertName, date, time, queryText } = req.body;

    if (!farmerName || !expertName || !date || !time || !queryText) {
      return res.status(400).json({ error: 'All fields (farmerName, expertName, date, time, queryText) are required.' });
    }

    const newBooking = new ConsultationBooking({
      farmerName: farmerName.trim(),
      expertName: expertName.trim(),
      date,
      time,
      queryText: queryText.trim(),
      status: 'Scheduled'
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register appointment booking.' });
  }
});

// POST /api/platform/consultation/reply/:id - Reply/provide treatment recipes (Expert or Admin required)
router.post('/consultation/reply/:id', authenticateToken, requireRole(['expert', 'admin']), async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText) {
      return res.status(400).json({ error: 'Reply text is required.' });
    }

    const booking = await ConsultationBooking.findByIdAndUpdate(
      req.params.id,
      { replyText: replyText.trim(), status: 'Completed' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Consultation booking not found.' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record consultation reply.' });
  }
});

// ==========================================
// 3. LIVESTOCK MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/platform/livestock - List animal records
router.get('/livestock', authenticateToken, async (req, res) => {
  try {
    const records = await LivestockRecord.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve livestock registry.' });
  }
});

// POST /api/platform/livestock/add - Create a new livestock log
router.post('/livestock/add', authenticateToken, async (req, res) => {
  try {
    const { animalType, tagNumber, healthStatus, age, weight, feedSchedule, dailyProduction, lastVaccinationDate } = req.body;

    if (!animalType || !tagNumber || !healthStatus || age === undefined || weight === undefined || !feedSchedule || !lastVaccinationDate) {
      return res.status(400).json({ error: 'All fields (animalType, tagNumber, healthStatus, age, weight, feedSchedule, lastVaccinationDate) are required.' });
    }

    const existingRecord = await LivestockRecord.findOne({ tagNumber });
    if (existingRecord) {
      return res.status(400).json({ error: 'An animal with this unique tag number is already registered.' });
    }

    const newRecord = new LivestockRecord({
      animalType,
      tagNumber: tagNumber.trim(),
      healthStatus,
      age: parseInt(age),
      weight: parseFloat(weight),
      feedSchedule: feedSchedule.trim(),
      dailyProduction: parseFloat(dailyProduction) || 0,
      lastVaccinationDate
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register animal record.' });
  }
});

export default router;
