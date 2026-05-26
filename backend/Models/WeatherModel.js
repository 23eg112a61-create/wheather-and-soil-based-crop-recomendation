import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema({
  temperature: { 
    type: Number, 
    required: true 
  },
  humidity: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  rainfall: { 
    type: Number, 
    required: true,
    min: 0
  },
  windSpeed: { 
    type: Number, 
    required: true,
    min: 0
  },
  uvIndex: { 
    type: Number, 
    required: true,
    min: 0
  },
  pressure: { 
    type: Number, 
    required: true,
    min: 0
  },
  forecastDate: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const WeatherModel = mongoose.model('Weather', weatherSchema);
export default WeatherModel;
