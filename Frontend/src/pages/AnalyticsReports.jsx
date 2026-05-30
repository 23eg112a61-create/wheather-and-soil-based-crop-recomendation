import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { Activity, FileText, CheckCircle, Sprout, ArrowRight, BarChart3, HelpCircle } from 'lucide-react';

const AnalyticsReports = () => {
  const { speak } = useApp();
  const [seasonFilter, setSeasonFilter] = useState('Kharif');
  const [showReport, setShowReport] = useState(false);

  // Stats Database by Season
  const database = {
    Kharif: {
      yields: [
        { name: 'Rice Zone A', yield: 4.8 },
        { name: 'Rice Zone B', yield: 5.2 },
        { name: 'Maize Zone C', yield: 6.1 },
        { name: 'Cotton Zone D', yield: 3.2 }
      ],
      finances: [
        { month: 'Jun', investment: 12000, revenue: 18000 },
        { month: 'Jul', investment: 14000, revenue: 22000 },
        { month: 'Aug', investment: 15000, revenue: 29000 },
        { month: 'Sep', investment: 10000, revenue: 38000 }
      ],
      water: [
        { week: 'W1', consumed: 120 },
        { week: 'W2', consumed: 140 },
        { week: 'W3', consumed: 95 },
        { week: 'W4', consumed: 130 }
      ],
      pests: [
        { name: 'Late Blight', count: 18 },
        { name: 'Rice Blast', count: 24 },
        { name: 'Rust Spores', count: 8 }
      ]
    },
    Rabi: {
      yields: [
        { name: 'Wheat Zone A', yield: 5.8 },
        { name: 'Wheat Zone B', yield: 6.4 },
        { name: 'Mustard Zone C', yield: 2.8 },
        { name: 'Chickpea Zone D', yield: 3.5 }
      ],
      finances: [
        { month: 'Nov', investment: 15000, revenue: 20000 },
        { month: 'Dec', investment: 18000, revenue: 24000 },
        { month: 'Jan', investment: 12000, revenue: 32000 },
        { month: 'Feb', investment: 11000, revenue: 41000 }
      ],
      water: [
        { week: 'W1', consumed: 85 },
        { week: 'W2', consumed: 72 },
        { week: 'W3', consumed: 90 },
        { week: 'W4', consumed: 64 }
      ],
      pests: [
        { name: 'Rust Fungus', count: 12 },
        { name: 'Aphids outbreak', count: 28 },
        { name: 'Root Rot', count: 4 }
      ]
    }
  };

  const currentStats = database[seasonFilter] || database['Kharif'];

  const handleExportPDF = () => {
    setShowReport(true);
    speak(`Exporting full agricultural performance report for season ${seasonFilter}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Interactive Analytics dashboard</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Agricultural Analytics & Crop Reports</h2>
          <p className="text-emerald-100 text-sm font-light">Audit NPK soil telemetry logs, review water conservation efficiency indicators, and generate PDF productivity reports.</p>
        </div>

        <div className="flex bg-slate-100 dark:bg-emerald-950/40 p-1.5 rounded-2xl border text-xs font-bold w-fit text-slate-800">
          <button 
            onClick={() => setSeasonFilter('Kharif')}
            className={`px-4 py-2 rounded-xl transition-all ${seasonFilter === 'Kharif' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
          >
            Kharif (Monsoon)
          </button>
          <button 
            onClick={() => setSeasonFilter('Rabi')}
            className={`px-4 py-2 rounded-xl transition-all ${seasonFilter === 'Rabi' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
          >
            Rabi (Winter)
          </button>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        
        {/* Chart 1: Crop Yields (Tons / Acre) */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Crop Yield Analytics (Tons / Acre)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentStats.yields}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="yield" fill="#10b981" name="Harvest Yield" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Profit / Loss Revenue Analysis */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Capital Investment vs Market Revenue (Rs.)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentStats.finances}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="investment" name="Sowing Costs" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" name="Harvest Income" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Irrigation water consumption */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Irrigation Water Consumption (Liters / sqm)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentStats.water}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="week" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="consumed" name="Water Spent" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pest Outbreak frequencies */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-4">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Visual Disease & Pest Occurrence Trends</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentStats.pests}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" name="Logged Infections" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Export Printable Report Action */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleExportPDF}
          className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3.5 px-8 rounded-2xl text-sm transition-all shadow-md flex items-center space-x-2"
        >
          <FileText size={18} />
          <span>Export Analytics PDF Report</span>
        </button>
      </div>

      {/* Printable Report Simulator Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur z-50 flex items-center justify-center p-6">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl overflow-y-auto max-h-[85vh] p-8 space-y-6 shadow-2xl relative border">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-left flex justify-between items-start">
              <div>
                <span className="text-xl font-black uppercase tracking-tight text-emerald-800">CropWeather AI Intelligence</span>
                <span className="block text-xs text-slate-400 mt-1">Official Base Station Telemetry Audit Report</span>
              </div>
              <div className="text-right text-[10px] text-slate-400 uppercase font-mono">
                <span>Date: May 28, 2026</span>
                <span className="block">Season: {seasonFilter}</span>
              </div>
            </div>

            {/* Content summary */}
            <div className="space-y-4 text-xs text-left leading-relaxed">
              <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-emerald-600 pl-2">1. Yield Security Summaries</h3>
              <p>
                Integrated NPK soil sensors and CNN foliar leaf cameras successfully validated grid productivity. Weekly averages confirm stable nitrogen and phosphorus parameters, yielding an estimated average productivity of **{seasonFilter === 'Kharif' ? '4.83' : '4.63'} Tons per Acre**.
              </p>

              <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-emerald-600 pl-2">2. Water Conservation Audits</h3>
              <p>
                Automated solenoid valve relays utilized localized meteorological radar models. By holding valve schedules during approaching cloud rainfall cells, smart water savings accounted for approximately **18,500 Liters** of conserved water per farm block.
              </p>

              <h3 className="text-base font-extrabold text-slate-900 border-l-4 border-emerald-600 pl-2">3. Pest Control Audits</h3>
              <p>
                Infection registries logged moderate blast fungal pressure. Organic Neem-Oil sprays and preventative biological applications successfully controlled outbreak zones within 72 hours, maintaining a crop survival margin of **98.4%**.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-dashed pt-6 flex justify-between items-center text-xs">
              <span className="text-emerald-700 font-bold flex items-center"><CheckCircle size={14} className="mr-1" /> Verified by CropWeather AI Core Systems</span>
              <button 
                onClick={() => setShowReport(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-5 rounded-xl"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsReports;
