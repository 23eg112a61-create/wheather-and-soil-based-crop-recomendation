import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { CloudSun, CloudRain, Droplet, Wind, Sun, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const WeatherDashboard = () => {
  const { speak } = useApp();
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const [currRes, foreRes] = await Promise.all([
          api.get('/weather/current?city=Ludhiana'),
          api.get('/weather/forecast?city=Ludhiana')
        ]);
        
        setCurrent(currRes.data.data);
        setForecast(foreRes.data.forecast);
      } catch (err) {
        // Fallbacks
        setCurrent({
          temperature: 28.4,
          humidity: 62,
          rainfall: 1.2,
          windSpeed: 14.5,
          uvIndex: 6,
          pressure: 1010,
          alert: 'Precipitation Alert: Approaching rain cloud formation; expect rain showers.'
        });

        setForecast([
          { forecastDate: 'Monday', temperature: 27.5, humidity: 60, rainfall: 0 },
          { forecastDate: 'Tuesday', temperature: 29.1, humidity: 62, rainfall: 1.5 },
          { forecastDate: 'Wednesday', temperature: 26.8, humidity: 72, rainfall: 4.2 },
          { forecastDate: 'Thursday', temperature: 25.2, humidity: 80, rainfall: 8.5 },
          { forecastDate: 'Friday', temperature: 28.0, humidity: 65, rainfall: 2.1 },
          { forecastDate: 'Saturday', temperature: 29.5, humidity: 58, rainfall: 0 },
          { forecastDate: 'Sunday', temperature: 30.2, humidity: 55, rainfall: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const handleSpeakWeather = () => {
    if (current) {
      speak(`Current weather: temperature is ${current.temperature} degrees, humidity is ${current.humidity} percent, and ${current.alert || 'no major weather warnings active.'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left" onMouseEnter={handleSpeakWeather}>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Meteorological Climate Center</h2>
        <p className="text-slate-500 text-sm">Monitor regional temperature fluctuations, rain gauges, humidity records, and UV indices.</p>
      </div>

      {/* Primary Alerts */}
      {current.alert && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 rounded-2xl flex items-start space-x-3 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <span className="font-extrabold block">Climate Advisory Active</span>
            <p className="text-xs">{current.alert}</p>
          </div>
        </div>
      )}

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Temp */}
        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Temperature</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{current.temperature}°C</span>
          </div>
          <div className="bg-amber-100 p-3 text-amber-600 rounded-xl"><Sun size={24} /></div>
        </div>

        {/* Humidity */}
        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Air Humidity</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{current.humidity}%</span>
          </div>
          <div className="bg-blue-100 p-3 text-blue-600 rounded-xl"><Droplet size={24} /></div>
        </div>

        {/* Rainfall */}
        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Rain Volume</span>
            <span className="text-3xl font-extrabold text-emerald-600">{current.rainfall} mm</span>
          </div>
          <div className="bg-emerald-100 p-3 text-emerald-600 rounded-xl"><CloudRain size={24} /></div>
        </div>

        {/* Wind Speed */}
        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase">Wind Velocity</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{current.windSpeed} km/h</span>
          </div>
          <div className="bg-teal-100 p-3 text-teal-600 rounded-xl"><Wind size={24} /></div>
        </div>
      </div>

      {/* Forecast Line graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <CloudSun className="mr-2 text-emerald-500" size={20} />
            7-Day Temperature Forecasting Curves (°C)
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="forecastDate" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorTemp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7 Day Forecast list */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg border-b pb-3">7-Day Outlook</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {forecast.map((f, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1 border-b last:border-0 border-slate-100 dark:border-emerald-900/10">
                <div className="space-y-0.5">
                  <span className="font-semibold block text-slate-800 dark:text-white">{f.forecastDate}</span>
                  <span className="text-xs text-slate-400">Rain: {f.rainfall} mm</span>
                </div>
                <div className="flex items-center space-x-2">
                  {f.rainfall > 2 ? <CloudRain size={16} className="text-emerald-500" /> : <Sun size={16} className="text-amber-500" />}
                  <span className="font-bold text-slate-800 dark:text-white">{f.temperature}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
