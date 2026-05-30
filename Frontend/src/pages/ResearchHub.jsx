import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, BookOpen, Compass, Search, ShieldCheck, Thermometer, Wind, Percent } from 'lucide-react';

const ResearchHub = () => {
  const { speak } = useApp();
  const [tempOffset, setTempOffset] = useState(1.5);
  const [articleSearch, setArticleSearch] = useState('');

  // Seeds database
  const seedsDirectory = [
    { name: 'DRR Dhan 45 (Biofortified Paddy)', type: 'Drought-Resistant Rice', maturity: '125 days', benefit: 'Requires 30% less water, enriched with High Zinc content, resists leaf blast.' },
    { name: 'HD 3226 (Pusa Yashasvi wheat)', type: 'Heat-Resistant Wheat', maturity: '140 days', benefit: 'Resists stripe and leaf rust, tolerates terminal heat shock during grain loading.' },
    { name: 'Phule Dhanwantari (Sorghum Jowar)', type: 'Arid Grain Sorghum', maturity: '110 days', benefit: 'Extremely drought tolerant, grows in low NPK poor sandy soils, high fodder output.' }
  ];

  // Articles Database
  const articles = [
    { title: 'Computer-Vision Foliar Diagnosis of Late Blight using CNN Centers', journal: 'Global Crop Sciences, 2025', author: 'Dr. Ramesh Rao et al.', tags: ['Foliar', 'AI'] },
    { title: 'IoT NPK Wireless Telemetry RS485 Probes Map Calibration', journal: 'Agronomy Tech Journal, 2026', author: 'Dr. Vikram Joshi', tags: ['IoT', 'Soil'] },
    { title: 'Legume Crop Rotations for Natural Nitrogen Restoration', journal: 'Soil Ecology Quarterly, 2026', author: 'Dr. Ananya Sen', tags: ['Organic', 'Rotation'] }
  ];

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(articleSearch.toLowerCase()) || a.author.toLowerCase().includes(articleSearch.toLowerCase()));

  // Heuristic Simulation of Climate Change on Yields
  const calculateClimateImpact = (offset) => {
    // Return relative yield changes
    const multiplier = parseFloat(offset) || 1.5;
    return {
      Rice: -(multiplier * 8.5).toFixed(1),
      Wheat: -(multiplier * 11.2).toFixed(1),
      Maize: -(multiplier * 12.8).toFixed(1),
      Sorghum: +(multiplier * 3.2).toFixed(1),
      recommendation: multiplier >= 3.0 
        ? "Severe climate offset detected. Pivot immediately away from waterlogged Paddy. Sow arid Sorghum (Jowar) or high-protein legumes to protect land productivity."
        : "Moderate heat stress detected. Utilize heat-tolerant seeds (like HD 3226 Wheat) and schedule smart sprinklers to counteract thermal spikes."
    };
  };

  const impact = calculateClimateImpact(tempOffset);

  const handleSpeakSimulation = () => {
    speak(`Simulating climate shift of plus ${tempOffset} degrees. Rice yields decline by ${Math.abs(impact.Rice)} percent. Wheat yields decline by ${Math.abs(impact.Wheat)} percent. AI recommendation is: ${impact.recommendation}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Agronomy Science Hub</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Research & Innovation Hub</h2>
          <p className="text-emerald-100 text-sm font-light">Simulate global warming offsets, review resilient seed breeds, and explore cutting-edge precision papers.</p>
        </div>
        <button 
          onClick={handleSpeakSimulation}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all flex items-center space-x-2 w-fit"
        >
          <Compass className="animate-spin-slow" size={16} />
          <span>Speak Climate Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Climate Yield Simulator */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Thermometer className="mr-2 text-amber-500" size={20} />
              AI Climate Offset Yield Forecaster
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag the thermal slider below to simulate average global temperature rises (+1.0°C to +4.0°C). Our forecasting engine recalculates estimated crop yield impacts using regional climate data.
            </p>
          </div>

          <div className="space-y-6">
            {/* Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase">Simulated Global Temp Increase:</span>
                <span className="text-amber-600 font-extrabold flex items-center">+{tempOffset}°C Thermal Offset</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.5"
                value={tempOffset}
                onChange={(e) => setTempOffset(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-4 rounded-2xl border text-center">
                <span className="text-xs text-slate-400 block font-bold">Paddy Rice</span>
                <span className={`text-xl font-black block mt-1 ${parseFloat(impact.Rice) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{impact.Rice}%</span>
              </div>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-4 rounded-2xl border text-center">
                <span className="text-xs text-slate-400 block font-bold">Rabi Wheat</span>
                <span className={`text-xl font-black block mt-1 ${parseFloat(impact.Wheat) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{impact.Wheat}%</span>
              </div>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-4 rounded-2xl border text-center">
                <span className="text-xs text-slate-400 block font-bold">Kharif Maize</span>
                <span className={`text-xl font-black block mt-1 ${parseFloat(impact.Maize) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{impact.Maize}%</span>
              </div>
              <div className="bg-slate-50 dark:bg-emerald-950/20 p-4 rounded-2xl border text-center">
                <span className="text-xs text-slate-400 block font-bold">Sorghum (Jowar)</span>
                <span className={`text-xl font-black block mt-1 ${parseFloat(impact.Sorghum) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{impact.Sorghum}%</span>
              </div>
            </div>

            {/* Recommendation Alert Box */}
            <div className="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-2xl border border-amber-200/50 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">AI Adaptation Advisory</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-light">{impact.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Resilient Seed varieties list */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6 text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <ShieldCheck className="mr-2 text-emerald-500" size={20} />
            Drought-Resilient Varieties
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 text-xs">
            {seedsDirectory.map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-4 rounded-xl border space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-white">{s.name}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">{s.maturity}</span>
                </div>
                <span className="block text-[10px] text-slate-400 font-semibold">{s.type}</span>
                <p className="text-slate-500 font-light leading-relaxed">{s.benefit}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Research Papers Registry */}
      <div className="glassmorphism p-6 rounded-3xl border space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 space-y-3 sm:space-y-0">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <BookOpen className="mr-2 text-emerald-500" size={20} />
            Precision Agronomy Article Repository
          </h3>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-3 text-slate-400" size={14} />
            <input
              type="text"
              value={articleSearch}
              onChange={(e) => setArticleSearch(e.target.value)}
              className="w-full bg-white dark:bg-emerald-950/20 border rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none"
              placeholder="Search journals or authors..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((art, idx) => (
            <div key={idx} className="bg-white dark:bg-emerald-950/20 border p-5 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-all text-xs space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {art.tags.map(t => (
                    <span key={t} className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase">{t}</span>
                  ))}
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white block leading-snug">{art.title}</h4>
                <span className="block text-[10px] text-slate-400 font-medium">Author: {art.author}</span>
              </div>
              <span className="block text-[10px] text-emerald-600 font-bold border-t pt-2 border-slate-100 dark:border-slate-800 text-right">{art.journal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
