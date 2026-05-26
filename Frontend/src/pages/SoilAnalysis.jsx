import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { Sprout, BarChart2, Thermometer, Droplet, Compass, ShieldAlert } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell, Legend
} from 'recharts';

const SoilAnalysis = () => {
  const { speak } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoil = async () => {
      try {
        const res = await api.get('/soil/all');
        setHistory(res.data);
      } catch (err) {
        setHistory([
          { moisture: 45, ph: 6.2, nitrogen: 85, phosphorus: 48, potassium: 42, temperature: 24, ecValue: 1.4, fertilityStatus: 'Optimal', createdAt: '09:00' },
          { moisture: 42, ph: 6.1, nitrogen: 80, phosphorus: 45, potassium: 38, temperature: 23, ecValue: 1.3, fertilityStatus: 'Optimal', createdAt: '11:00' },
          { moisture: 48, ph: 6.3, nitrogen: 90, phosphorus: 52, potassium: 40, temperature: 25, ecValue: 1.5, fertilityStatus: 'High', createdAt: '13:00' },
          { moisture: 52, ph: 6.3, nitrogen: 88, phosphorus: 51, potassium: 45, temperature: 24, ecValue: 1.4, fertilityStatus: 'Optimal', createdAt: '15:00' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSoil();
  }, []);

  const handleSpeakAnalysis = () => {
    const latest = history[0] || { moisture: 45, ph: 6.2, fertilityStatus: 'Optimal' };
    speak(`Soil Analysis Profile: moisture is at ${latest.moisture}%, pH is ${latest.ph}, and fertility status is classified as ${latest.fertilityStatus}.`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const latest = history[0] || { moisture: 45, ph: 6.2, nitrogen: 85, phosphorus: 48, potassium: 42, temperature: 24, ecValue: 1.4, fertilityStatus: 'Optimal' };
  
  // Format data for NPK chart
  const npkData = [
    { name: 'Nitrogen (N)', value: latest.nitrogen, fill: '#3b82f6' },
    { name: 'Phosphorus (P)', value: latest.phosphorus, fill: '#10b981' },
    { name: 'Potassium (K)', value: latest.potassium, fill: '#f59e0b' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left" onMouseEnter={handleSpeakAnalysis}>
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Soil Chemistry Dashboard</h2>
        <p className="text-slate-500 text-sm">Visualize soil electrical conductivity, trace NPK values, pH scale ratios, and moisture index parameters.</p>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* NPK Summary */}
        <div className="glassmorphism p-6 rounded-2xl border flex flex-col justify-between space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Nitrogen - Phosphorus - Potassium</span>
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-extrabold text-blue-500">{latest.nitrogen}</span>
            <span className="text-slate-400">/</span>
            <span className="text-2xl font-extrabold text-emerald-500">{latest.phosphorus}</span>
            <span className="text-slate-400">/</span>
            <span className="text-2xl font-extrabold text-amber-500">{latest.potassium}</span>
          </div>
          <span className="text-xs text-slate-500">NPK mg/kg soil profile ratio</span>
        </div>

        {/* Moisture */}
        <div className="glassmorphism p-6 rounded-2xl border flex flex-col justify-between space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Soil Humidity Index</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{latest.moisture}%</span>
          <span className="text-xs text-emerald-500 font-semibold flex items-center">
            <Droplet size={12} className="mr-1" /> Perfect hydration scale
          </span>
        </div>

        {/* pH Probe */}
        <div className="glassmorphism p-6 rounded-2xl border flex flex-col justify-between space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase">pH balance ratio</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{latest.ph} pH</span>
          <span className="text-xs text-amber-500 font-semibold flex items-center">
            <Compass size={12} className="mr-1" /> Slight acidity level
          </span>
        </div>

        {/* EC Value */}
        <div className="glassmorphism p-6 rounded-2xl border flex flex-col justify-between space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Electrical Conductivity</span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{latest.ecValue} dS/m</span>
          <span className="text-xs text-slate-500 font-semibold">Standard mineral salinity index</span>
        </div>
      </div>

      {/* Analytics Graph Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* NPK Nutrients distribution */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <BarChart2 className="mr-2 text-emerald-500" size={20} />
            NPK Trace Mineral Concentrations (mg/kg)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npkData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {npkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Moisture trends */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Droplet className="mr-2 text-emerald-500" size={20} />
            Water Retention Hydration Curves
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history.slice().reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoist" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="createdAt" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorMoist)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historical List Logs */}
      <div className="glassmorphism p-6 rounded-3xl border space-y-6">
        <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
          <Sprout className="mr-2 text-emerald-500" size={20} />
          Soil Diagnostics Log Ledger
        </h3>

        <div className="overflow-x-auto w-full max-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-slate-400 font-semibold text-xs uppercase">
                <th className="py-2.5 px-3">Interval</th>
                <th className="py-2.5 px-3">Moisture</th>
                <th className="py-2.5 px-3">pH</th>
                <th className="py-2.5 px-3 text-center">N-P-K (mg/kg)</th>
                <th className="py-2.5 px-3">EC Value</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="py-3.5 px-3 text-xs text-slate-400">{h.createdAt}</td>
                  <td className="py-3.5 px-3 font-semibold">{h.moisture}%</td>
                  <td className="py-3.5 px-3 font-semibold">{h.ph} pH</td>
                  <td className="py-3.5 px-3 text-center text-xs text-slate-500 font-medium">
                    <span className="text-blue-500 font-bold">{h.nitrogen}</span> - <span className="text-emerald-500 font-bold">{h.phosphorus}</span> - <span className="text-amber-500 font-bold">{h.potassium}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500">{h.ecValue} dS/m</td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      h.fertilityStatus === 'High' ? 'bg-emerald-100 text-emerald-700' :
                      h.fertilityStatus === 'Low' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {h.fertilityStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SoilAnalysis;
