import mongoose from 'mongoose';

// 1. Marketplace Item Schema
const MarketplaceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Seeds', 'Fertilizers', 'Machinery', 'Crops'], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sellerName: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Sold', 'Pending Moderation'], default: 'Available' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Consultation Booking Schema
const ConsultationBookingSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  expertName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  queryText: { type: String, required: true },
  replyText: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 3. Livestock Record Schema
const LivestockRecordSchema = new mongoose.Schema({
  animalType: { type: String, required: true },
  tagNumber: { type: String, required: true, unique: true },
  healthStatus: { type: String, required: true },
  age: { type: Number, required: true }, // in months
  weight: { type: Number, required: true }, // in kg
  feedSchedule: { type: String, required: true },
  dailyProduction: { type: Number, default: 0 }, // e.g., milk in liters
  lastVaccinationDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const MarketplaceItem = mongoose.model('MarketplaceItem', MarketplaceItemSchema);
export const ConsultationBooking = mongoose.model('ConsultationBooking', ConsultationBookingSchema);
export const LivestockRecord = mongoose.model('LivestockRecord', LivestockRecordSchema);
