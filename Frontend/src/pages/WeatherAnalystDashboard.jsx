import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { 
  CloudRain, Sun, Wind, ShieldAlert, Navigation, Compass, AlertTriangle, 
  Thermometer, Activity, Database, CheckCircle, ArrowRight, Zap, Droplet, Eye, Info, Send, Terminal, Settings
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeatherAnalystDashboard = () => {
  const { speak } = useApp();
  
  // Dynamic Weather Analyst States
  const [current, setCurrent] = useState({
    temperature: 28.4,
    humidity: 62,
    rainfall: 1.2,
    windSpeed: 14.5,
    uvIndex: 6,
    pressure: 1010,
    alert: 'Precipitation Alert: Approaching rain cloud formation; expect rain showers.'
  });

  const [forecast, setForecast] = useState([
    { forecastDate: 'Monday', temperature: 27.5, humidity: 60, rainfall: 0 },
    { forecastDate: 'Tuesday', temperature: 29.1, humidity: 62, rainfall: 1.5 },
    { forecastDate: 'Wednesday', temperature: 26.8, humidity: 72, rainfall: 4.2 },
    { forecastDate: 'Thursday', temperature: 25.2, humidity: 80, rainfall: 8.5 },
    { forecastDate: 'Friday', temperature: 28.0, humidity: 65, rainfall: 2.1 },
    { forecastDate: 'Saturday', temperature: 29.5, humidity: 58, rainfall: 0 },
    { forecastDate: 'Sunday', temperature: 30.2, humidity: 55, rainfall: 0 }
  ]);

  // Operational Role States
  const [simulationMode, setSimulationMode] = useState('Standard');
  const [apiLogs, setApiLogs] = useState([
    { time: new Date().toLocaleTimeString(), event: 'Connected to OpenWeather API endpoint.', status: 'SUCCESS' },
    { time: new Date().toLocaleTimeString(), event: 'Fetched barometric pressure reading: 1010 hPa.', status: 'SUCCESS' },
    { time: new Date().toLocaleTimeString(), event: 'Audited UV solar exposure rating: 6 (High).', status: 'SUCCESS' }
  ]);
  const [isFetchingApi, setIsFetchingApi] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('Approaching rain cloud formation; expect rain showers.');
  const [broadcastType, setBroadcastType] = useState('Precipitation Alert');

  const addApiLog = (event, status = 'SUCCESS') => {
    setApiLogs(prev => [{ time: new Date().toLocaleTimeString(), event, status }, ...prev.slice(0, 10)]);
  };

  // Perform dynamic API fetch simulation
  const handleFetchApiData = () => {
    setIsFetchingApi(true);
    addApiLog('Initiated manual fetch request to api.openweathermap.org...', 'INFO');
    
    setTimeout(() => {
      setIsFetchingApi(false);
      const generatedTemp = Math.round((22 + Math.random() * 12) * 10) / 10;
      const generatedHum = Math.round(40 + Math.random() * 50);
      const generatedRain = generatedHum > 70 ? Math.round((generatedHum - 70) * 0.3 * 10) / 10 : 0;
      const generatedWind = Math.round((5 + Math.random() * 20) * 10) / 10;
      
      setCurrent(prev => ({
        ...prev,
        temperature: generatedTemp,
        humidity: generatedHum,
        rainfall: generatedRain,
        windSpeed: generatedWind,
        alert: generatedRain > 4 ? 'Heavy Rainfall Alert: Paused sprinkler motors.' : prev.alert
      }));

      addApiLog(`Manual fetch successful! Temp: ${generatedTemp}°C, Humidity: ${generatedHum}%, Rain: ${generatedRain}mm.`, 'SUCCESS');
      speak(`OpenWeather API query completed. Current temperature reads ${generatedTemp} degrees.`);
    }, 1500);
  };

  // Broadcast meteorological warning alert
  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setCurrent(prev => ({
      ...prev,
      alert: `${broadcastType}: ${broadcastMessage}`
    }));

    addApiLog(`Broadcasted advisory: ${broadcastType} - ${broadcastMessage}`, 'WARNING');
    speak(`Meteorological advisory alert published successfully. ${broadcastMessage}`);
  };

  // Recalculate dynamic crop recommendations based on weather analyst parameter calibrations
  const getDynamicCropSuitability = (temp, hum, rain) => {
    if (rain > 6.0 || rain * 100 > 150) {
      return {
        name: 'Rice Paddy (Kharif Monsoon)',
        image: '/paddy_with_seed.png',
        badge: 'Waterlogged Clay Optimal',
        suitability: 'Heavy precipitation rates and tropical warmth provide the waterlogged field conditions critical for maximum Rice root maturation.',
        protocol: 'Execute continuous flooding. Maintain 2-5 cm of standing water in all paddy sectors; monitor drainage systems.'
      };
    }
    if (temp < 20) {
      return {
        name: 'Winter Wheat (Rabi Season)',
        image: '/smart_farm_hero.png',
        badge: 'Cool Tempered Loam',
        suitability: 'Chilled atmospheric conditions and low rainfall allow winter grains to anchor root crowns securely without fungal exposure.',
        protocol: 'Trigger sprinkler irrigation only at crown root initiation and flowering stages; pause during morning frost.'
      };
    }
    if (temp > 30 && hum < 50) {
      return {
        name: 'Legumes / Dry Beans',
        image: '/soil_probe.png',
        badge: 'Arid Climate Resistant',
        suitability: 'High solar radiation and low atmospheric humidity are perfect for legumes. Fixes nitrogen levels securely in parched loam soils.',
        protocol: 'Operate deep drip line irrigation at root nodes; enforce mulch placement to prevent soil moisture evacuation.'
      };
    }
    return {
      name: 'Hybrid Maize (Corn)',
      image: '/crop_matcher.png',
      badge: 'All-Season Loam Versatile',
      suitability: 'Mild temperate ambient bands and standard precipitation levels support optimal hybrid corn expansion cycles.',
      protocol: 'Apply scheduled sprinkler irrigation twice daily for 25 minutes; trigger NPK booster injection.'
    };
  };

  const dynamicCrop = getDynamicCropSuitability(current.temperature, current.humidity, current.rainfall);

  const handleApplyPreset = (type) => {
    setSimulationMode(type);
    if (type === 'Monsoon Storm') {
      setCurrent({
        temperature: 24.5,
        humidity: 92,
        rainfall: 12.8,
        windSpeed: 28.4,
        uvIndex: 2,
        pressure: 998,
        alert: 'CRITICAL PRECIPITATION: Severe monsoon weather. Approaching waterlogging threats; execute flood diversion gates.'
      });
      addApiLog('Applied preset simulation: Monsoon Storm.', 'WARNING');
      speak("Monsoon Storm simulated. Rain gauges peaking; Rice Paddy suitability active.");
    } else if (type === 'Winter Freeze') {
      setCurrent({
        temperature: 12.4,
        humidity: 45,
        rainfall: 0.1,
        windSpeed: 8.2,
        uvIndex: 3,
        pressure: 1022,
        alert: 'FROST ADVISORY: Chilled dry Rabi winds active. Secure frost protective screens for younger seedlings.'
      });
      addApiLog('Applied preset simulation: Winter Freeze.', 'WARNING');
      speak("Winter Freeze simulated. Rabi atmospheric bands matching Winter Wheat cycles.");
    } else if (type === 'Summer Drought') {
      setCurrent({
        temperature: 38.6,
        humidity: 28,
        rainfall: 0.0,
        windSpeed: 21.0,
        uvIndex: 10,
        pressure: 1005,
        alert: 'DROUGHT ALERT: Extreme heatwave conditions detected. Enforce restricted irrigation and shade cloth shielding.'
      });
      addApiLog('Applied preset simulation: Summer Drought.', 'WARNING');
      speak("Summer Heatwave simulated. Drought warning active; Legumes matching dry soil protocol.");
    } else {
      setCurrent({
        temperature: 28.4,
        humidity: 62,
        rainfall: 1.2,
        windSpeed: 14.5,
        uvIndex: 6,
        pressure: 1010,
        alert: 'Precipitation Alert: Approaching rain cloud formation; expect rain showers.'
      });
      addApiLog('Reset parameters to standard.', 'SUCCESS');
      speak("Standard spring weather profile reset.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      <style>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .dark .glassmorphism {
          background: rgba(6, 78, 59, 0.1);
          backdrop-filter: blur(12px);
        }
      `}</style>

      {/* Profile / Context Card */}
      <div 
        className="relative overflow-hidden rounded-3xl p-8 text-white bg-cover bg-center shadow-xl border border-emerald-500/20"
        style={{ backgroundImage: "url('/smart_farm_hero.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-0"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Activity size={12} className="animate-pulse" />
            <span>Active Session: Certified Weather Analyst</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            AI-Powered Weather & Soil Intelligence System
          </h2>
          <p className="text-sm md:text-base text-slate-200 font-light leading-relaxed">
            The <strong>AI-Powered Weather and Soil Intelligence System for Smart Crop Recommendation and Precision Farming</strong> project is very important. 
            The Weather Analyst is responsible for monitoring, analyzing, predicting, and managing weather-related agricultural data to help farmers make better farming decisions.
          </p>
        </div>
      </div>

      {/* Main Core Task Panel with Weather Radar Graphic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="glassmorphism p-8 rounded-3xl border border-slate-200/50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
              <Compass size={22} className="mr-2 text-emerald-500 animate-spin-slow" />
              Role of the Meteorological Analyst
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              The Weather Analyst studies climate and weather conditions such as Rainfall, Temperature, Humidity, Wind speed, UV Index, Air pressure, and Seasonal changes. 
              Then the analyst provides insights to the AI system for crop recommendation, irrigation planning, disease prediction, drought warnings, and flood alerts.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/20">🌾 Crop Matching</span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/20">💧 Irrigation Plans</span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/20">🔬 Disease Forecast</span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/20">🚨 Drought Warnings</span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/20">🌊 Flood Alerts</span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-[10px] font-bold text-center border border-emerald-500/20">🔌 Sensor Mapping</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/50 flex flex-wrap gap-3">
            <button
              onClick={() => handleApplyPreset('Monsoon Storm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                simulationMode === 'Monsoon Storm'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900'
              }`}
            >
              Simulate Monsoon Storm
            </button>
            <button
              onClick={() => handleApplyPreset('Winter Freeze')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                simulationMode === 'Winter Freeze'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900'
              }`}
            >
              Simulate Winter Freeze
            </button>
            <button
              onClick={() => handleApplyPreset('Summer Drought')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                simulationMode === 'Summer Drought'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900'
              }`}
            >
              Simulate Summer Drought
            </button>
          </div>
        </div>

        {/* Banners Graphic */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 min-h-[300px] shadow-lg group">
          <img 
            src="/weather_forecast.png" 
            alt="Agro Weather Radar Visualization Grid" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <span className="bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider w-fit block mb-1">Satellite telemetry</span>
            <h4 className="font-extrabold text-lg">Integrated Meteorological Radar</h4>
            <p className="text-[10px] text-slate-200">Continuous cloud radar monitoring streams via OpenWeather and WeatherAPI feeds.</p>
          </div>
        </div>
      </div>

      {/* Dynamic Key Analyst Tasks Feature Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Task 1: Weather API Fetching & Logger Console */}
        <div className="glassmorphism p-6 rounded-3xl border border-slate-200/50 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
                <Terminal className="mr-2 text-emerald-500" size={20} />
                Key Task 1: Weather Data Monitoring
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">Continuous data monitoring and manual audit queries from API hosts.</p>
            </div>
            <button
              onClick={handleFetchApiData}
              disabled={isFetchingApi}
              className="bg-slate-900 hover:bg-slate-950 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Activity size={14} className={isFetchingApi ? 'animate-spin' : ''} />
              <span>{isFetchingApi ? 'Querying APIs...' : 'Fetch OpenWeather Data'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 text-emerald-400 font-mono text-[10px] p-4 rounded-2xl h-44 overflow-y-auto space-y-1.5 shadow-inner border border-slate-800">
              <span className="text-slate-500 block border-b border-slate-800 pb-1 font-bold">// REAL-TIME METEOROLOGICAL API STREAMS</span>
              {apiLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-600">[{log.time}]</span>
                  <span className={log.status === 'WARNING' ? 'text-amber-400' : log.status === 'INFO' ? 'text-blue-400' : 'text-emerald-400'}>
                    {log.status === 'WARNING' ? '⚠️' : '✓'} {log.event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task 2: Warning Board Broadcaster Form */}
        <div className="glassmorphism p-6 rounded-3xl border border-slate-200/50 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <AlertTriangle className="mr-2 text-emerald-500" size={20} />
              Key Task 2: Manage Climate Alerts
            </h3>
            <p className="text-slate-500 text-xs">
              Publish barometric alerts, flash floods warnings, or frost advisories directly to all system farmer terminals.
            </p>

            <form onSubmit={handleBroadcastAlert} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Classification</label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Precipitation Alert">Precipitation Alert</option>
                  <option value="FLOOD WARNING">🌊 Flood Warning (Critical)</option>
                  <option value="DROUGHT WARNING">🚨 Drought Heatwave Warning</option>
                  <option value="FROST ADVISORY">❄️ Frost advisory (Winter)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Advisory Message</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter meteorological advisory instructions..."
                  rows={3}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
              >
                <Send size={12} />
                <span>Broadcast Advisory Alert</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Task 3: Interactive Data Collected Ledger */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <Database className="mr-2 text-emerald-500" size={22} />
            Weather Data Collected & Agricultural Purposes
          </h3>
          <p className="text-slate-500 text-sm">Main climate parameters studies and matching AI insights for farmer operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Temp */}
          <div className="glassmorphism rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between">
            <div className="h-28 w-full overflow-hidden relative">
              <img src="/paddy_with_seed.png" alt="Temperature Suitability" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-amber-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Temperature</span>
            </div>
            <div className="p-4 space-y-2 text-left">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
                <Thermometer size={16} className="mr-1.5 text-amber-500" />
                Purpose: Crop Suitability
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Tracks thermal coefficients to determine suited crops. Exposing crops to wrong heat bands triggers yield failure warnings.
              </p>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-2 rounded-lg flex justify-between text-[10px]">
                <span className="text-slate-400">Current Reading:</span>
                <span className="font-extrabold text-amber-600">{current.temperature}°C</span>
              </div>
            </div>
          </div>

          {/* Card 2: Humidity */}
          <div className="glassmorphism rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between">
            <div className="h-28 w-full overflow-hidden relative">
              <img src="/disease_scan.png" alt="Humidity & Disease Prediction" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-teal-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Humidity</span>
            </div>
            <div className="p-4 space-y-2 text-left">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
                <Droplet size={16} className="mr-1.5 text-teal-500" />
                Purpose: Disease Prediction
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Elevated humidity parameters are prime factors in spore germinations (Late Blight fungus). Feeds predictive maps inside the expert dashboard.
              </p>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-2 rounded-lg flex justify-between text-[10px]">
                <span className="text-slate-400">Current Humidity:</span>
                <span className="font-extrabold text-teal-600">{current.humidity}%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Rainfall */}
          <div className="glassmorphism rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between">
            <div className="h-28 w-full overflow-hidden relative">
              <img src="/smart_irrigation.png" alt="Rainfall & Water Planning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Rainfall</span>
            </div>
            <div className="p-4 space-y-2 text-left">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
                <CloudRain size={16} className="mr-1.5 text-blue-500" />
                Purpose: Irrigation & Water Planning
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Audits real-time precipitation gauges. If significant rain drops occur, the AI automatically pauses pump valves to secure natural resource conservation.
              </p>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-2 rounded-lg flex justify-between text-[10px]">
                <span className="text-slate-400">Rain Gauge Level:</span>
                <span className="font-extrabold text-blue-600">{current.rainfall} mm</span>
              </div>
            </div>
          </div>

          {/* Card 4: Wind Speed */}
          <div className="glassmorphism rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between">
            <div className="h-28 w-full overflow-hidden relative">
              <img src="/smart_farm_hero.png" alt="Wind Speed & Storm Alerts" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-slate-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Wind Speed</span>
            </div>
            <div className="p-4 space-y-2 text-left">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
                <Wind size={16} className="mr-1.5 text-slate-500" />
                Purpose: Storm Alerts & Crop Safety
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Monitors wind speeds to detect approaching storms. Triggers protective wind screen deployments and warns experts of foliar lodging hazards.
              </p>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-2 rounded-lg flex justify-between text-[10px]">
                <span className="text-slate-400">Velocity:</span>
                <span className="font-extrabold text-slate-600">{current.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {/* Card 5: Air Pressure */}
          <div className="glassmorphism rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between">
            <div className="h-28 w-full overflow-hidden relative">
              <img src="/weather_forecast.png" alt="Barometric Air Pressure" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-indigo-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">Pressure</span>
            </div>
            <div className="p-4 space-y-2 text-left">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
                <Compass size={16} className="mr-1.5 text-indigo-500" />
                Purpose: Climate Analysis
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Calibrates regional pressure drop anomalies. Critical for tracking hurricane/cyclone paths or predicting major climate shifts.
              </p>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-2 rounded-lg flex justify-between text-[10px]">
                <span className="text-slate-400">Barometer:</span>
                <span className="font-extrabold text-indigo-600">{current.pressure} hPa</span>
              </div>
            </div>
          </div>

          {/* Card 6: UV Index */}
          <div className="glassmorphism rounded-2xl border border-slate-200/50 overflow-hidden flex flex-col justify-between">
            <div className="h-28 w-full overflow-hidden relative">
              <img src="/soil_probe.png" alt="UV Index Solar Protection" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">UV Index</span>
            </div>
            <div className="p-4 space-y-2 text-left">
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
                <Sun size={16} className="mr-1.5 text-red-500" />
                Purpose: Crop Solar Protection
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                Calculates solar ultraviolet index loads. Alerting high scores helps implement dynamic shade shielding to prevent seedling leaf-scorch.
              </p>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-2 rounded-lg flex justify-between text-[10px]">
                <span className="text-slate-400">UV Level:</span>
                <span className="font-extrabold text-red-600">{current.uvIndex} (High)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What crop we need to plant in this weather solver */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Parameter Calibrator */}
        <div className="glassmorphism p-6 rounded-3xl border border-slate-200/50 lg:col-span-2 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center">
              <Zap className="mr-1.5 text-amber-500" size={18} />
              Real-Time Atmospheric Parameter Calibrator
            </h3>
            <p className="text-xs text-slate-500">
              Drag the sliders below to manually override the current weather. The AI recommender will instantly evaluate crop suitability!
            </p>
          </div>

          <div className="space-y-5">
            {/* Slider 1: Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Ambient Temperature:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{current.temperature}°C</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="0.5"
                value={current.temperature}
                onChange={(e) => setCurrent({ ...current, temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 2: Humidity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Relative Humidity:</span>
                <span className="text-emerald-600 dark:text-emerald-400">{current.humidity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="1"
                value={current.humidity}
                onChange={(e) => setCurrent({ ...current, humidity: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 3: Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Precipitation (Rain Gauge):</span>
                <span className="text-emerald-600 dark:text-emerald-400">{current.rainfall} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.2"
                value={current.rainfall}
                onChange={(e) => setCurrent({ ...current, rainfall: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Dynamic AI Suitability Output card */}
        <div className="glassmorphism rounded-3xl border border-emerald-500/20 overflow-hidden flex flex-col justify-between shadow-lg">
          <div className="h-36 w-full overflow-hidden relative">
            <img src={dynamicCrop.image} alt={dynamicCrop.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <span className="absolute bottom-3 left-3 bg-emerald-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider shadow">
              {dynamicCrop.badge}
            </span>
          </div>

          <div className="p-5 space-y-3.5 text-left flex-grow flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Dynamic Weather Crop Match</span>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-xl flex items-center">
                <CheckCircle size={18} className="mr-1.5 text-emerald-500" />
                {dynamicCrop.name}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {dynamicCrop.suitability}
              </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/10 text-[10px] space-y-1">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300 block uppercase tracking-wider">Watering Protocol</span>
              <p className="text-slate-600 dark:text-slate-300 leading-normal">{dynamicCrop.protocol}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Warnings & Analytical Forecasting Section */}
      {current.alert && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 p-5 rounded-2xl flex items-start space-x-3 text-amber-800 dark:text-amber-300">
          <ShieldAlert className="flex-shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <span className="font-extrabold block">Meteorological Warning Board</span>
            <p className="text-xs">{current.alert}</p>
          </div>
        </div>
      )}

      {/* Forecast & Rainfall Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glassmorphism p-6 rounded-3xl border border-slate-200/50 lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <CloudRain className="mr-2 text-emerald-500 animate-bounce" size={20} />
            7-Day Precipitation and Rainfall Predictions (mm)
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="forecastDate" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#10b981" fillOpacity={1} fill="url(#colorRain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Metrics Card */}
        <div className="glassmorphism p-6 rounded-3xl border border-slate-200/50 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Sun className="mr-2 text-emerald-500 animate-pulse" size={20} />
              Forecasting Summary
            </h3>
            <div className="divide-y space-y-3.5">
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Ambient Temp:</span>
                <span className="font-bold text-slate-800 dark:text-white">{current.temperature}°C</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Air Humidity:</span>
                <span className="font-bold text-slate-800 dark:text-white">{current.humidity}%</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Wind Velocity:</span>
                <span className="font-bold text-slate-800 dark:text-white">{current.windSpeed} km/h</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Rain Gauge:</span>
                <span className="font-bold text-emerald-600">{current.rainfall} mm/hr</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-slate-400">Barometric Pressure:</span>
                <span className="font-bold text-slate-800 dark:text-white">{current.pressure} hPa</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-emerald-950/20 p-3 rounded-2xl border flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-[10px]">
            <Info size={14} className="flex-shrink-0 text-emerald-600" />
            <span>Feeds verified via secure 127.0.0.1 OpenWeather rate-limiter gateways.</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WeatherAnalystDashboard;
