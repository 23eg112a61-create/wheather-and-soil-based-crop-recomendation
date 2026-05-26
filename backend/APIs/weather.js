import express from 'express';
import axios from 'axios';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Local dynamic simulated weather data helper for sandbox/fallback operations
const getSimulatedWeatherData = (lat, lon) => {
  const currentTemp = 24 + Math.sin(Date.now() / 3600000) * 4; // Cyclic temp fluctuation
  const humidity = 65 + Math.cos(Date.now() / 3600000) * 15;
  const windSpeed = 12 + Math.sin(Date.now() / 7200000) * 5;
  const uvIndex = Math.max(1, 6 + Math.cos(Date.now() / 3600000) * 4);
  const pressure = 1012 + Math.sin(Date.now() / 7200000) * 4;
  const rainfall = humidity > 75 ? (humidity - 75) * 0.4 : 0;

  // Formulate dynamic alerts
  let alert = null;
  if (rainfall > 3.0) {
    alert = 'Flood Warning: Extreme precipitation detected inside regional zones.';
  } else if (humidity > 70) {
    alert = 'Precipitation Alert: Approaching rain cloud formation; expect rain showers.';
  } else if (currentTemp > 35) {
    alert = 'Drought Alert: High environmental temperatures detected; monitor crop watering.';
  }

  // Create 7-day forecast
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() + i);
    const dayTemp = 22 + Math.sin(i * 1.5) * 5 + (i % 2 === 0 ? 1.5 : -1);
    const dayHum = 60 + Math.cos(i) * 10;
    const dayRain = dayHum > 68 ? (dayHum - 68) * 0.8 : 0;
    
    return {
      forecastDate: dayDate.toISOString().split('T')[0],
      temperature: Math.round(dayTemp * 10) / 10,
      humidity: Math.round(dayHum),
      rainfall: Math.round(dayRain * 10) / 10,
      windSpeed: Math.round((10 + Math.cos(i) * 3) * 10) / 10,
      uvIndex: Math.round(Math.max(1, 5 + Math.sin(i) * 3)),
      pressure: Math.round(1010 + Math.sin(i) * 5)
    };
  });

  return {
    current: {
      temperature: Math.round(currentTemp * 10) / 10,
      humidity: Math.round(humidity),
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10,
      uvIndex: Math.round(uvIndex),
      pressure: Math.round(pressure),
      alert: alert
    },
    forecast: forecast
  };
};

// GET /api/weather/current - Query current climate parameters
router.get('/current', authenticateToken, async (req, res) => {
  const { lat, lon, city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    // Return high-fidelity mock data if api key is missing
    const simulated = getSimulatedWeatherData(lat || 0, lon || 0);
    return res.status(200).json({
      source: 'simulator',
      location: city || 'SmartFarm Base Station Alpha',
      data: simulated.current
    });
  }

  try {
    const queryLocation = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;
    const url = `https://api.openweathermap.org/data/2.5/weather?${queryLocation}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const apiData = response.data;
    
    const rainfall = apiData.rain ? (apiData.rain['1h'] || apiData.rain['3h'] || 0) : 0;
    let alert = null;
    if (apiData.main.temp > 35) {
      alert = 'Drought Warning: Critical high heat conditions recorded.';
    } else if (rainfall > 3) {
      alert = 'Heavy Rain Alert: High precipitation rates; verify drainage systems.';
    }

    res.status(200).json({
      source: 'OpenWeather API',
      location: apiData.name,
      data: {
        temperature: apiData.main.temp,
        humidity: apiData.main.humidity,
        rainfall: rainfall,
        windSpeed: apiData.wind.speed * 3.6, // Convert to km/h
        uvIndex: 5, // OpenWeather needs extra query for UV, defaulting
        pressure: apiData.main.pressure,
        alert: alert
      }
    });
  } catch (error) {
    console.warn('Weather API failed, serving dynamic simulator instead.');
    const simulated = getSimulatedWeatherData(lat || 0, lon || 0);
    res.status(200).json({
      source: 'simulator_fallback',
      location: city || 'SmartFarm Base Station Alpha',
      data: simulated.current
    });
  }
});

// GET /api/weather/forecast - Query 7-day meteorological forecasts
router.get('/forecast', authenticateToken, async (req, res) => {
  const { lat, lon, city } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    const simulated = getSimulatedWeatherData(lat || 0, lon || 0);
    return res.status(200).json({
      source: 'simulator',
      location: city || 'SmartFarm Base Station Alpha',
      forecast: simulated.forecast
    });
  }

  try {
    const queryLocation = city ? `q=${encodeURIComponent(city)}` : `lat=${lat}&lon=${lon}`;
    const url = `https://api.openweathermap.org/data/2.5/forecast?${queryLocation}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const apiData = response.data;

    // Filter to capture 1 reading per day (e.g. 12:00:00 every day)
    const list = apiData.list || [];
    const dailyForecasts = list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 7);

    const forecast = dailyForecasts.map(item => {
      return {
        forecastDate: item.dt_txt.split(' ')[0],
        temperature: item.main.temp,
        humidity: item.main.humidity,
        rainfall: item.rain ? (item.rain['3h'] || 0) : 0,
        windSpeed: item.wind.speed * 3.6,
        uvIndex: 5,
        pressure: item.main.pressure
      };
    });

    res.status(200).json({
      source: 'OpenWeather API',
      location: apiData.city.name,
      forecast: forecast
    });
  } catch (error) {
    console.warn('Weather API failed, serving dynamic simulator forecast.');
    const simulated = getSimulatedWeatherData(lat || 0, lon || 0);
    res.status(200).json({
      source: 'simulator_fallback',
      location: city || 'SmartFarm Base Station Alpha',
      forecast: simulated.forecast
    });
  }
});

export default router;
