import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { 
  Sprout, Droplet, Wind, CloudRain, Sun, Calendar, Clock,
  Brain, Leaf, AlertTriangle, ShieldCheck, Activity, Send,
  ChevronRight, Globe, Sparkles, Thermometer, Radio, CheckCircle,
  Database, Bell, LayoutDashboard, Bug, LineChart, MessageSquare,
  User, ShieldAlert, Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip
} from 'recharts';

const ExpertDashboard = () => {
  const { speak } = useApp();
  const [activeTab, setActiveTab] = useState('Consultations');
  const [activeRegion, setActiveRegion] = useState('Ludhiana');
  const [successMsg, setSuccessMsg] = useState('');
  const [liveTime, setLiveTime] = useState('');

  // Real consultation bookings database states
  const [cloudBookings, setCloudBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [replyInputs, setReplyInputs] = useState({});

  // Dynamic soil NPK overrides
  const [simN, setSimN] = useState(240);
  const [simP, setSimP] = useState(18.5);
  const [simK, setSimK] = useState(310);
  const [simPH, setSimPH] = useState(6.8);
  const [simMoisture, setSimMoisture] = useState(65);

  // Spore leaf scanner states
  const [diagnoseTargetCrop, setDiagnoseTargetCrop] = useState('Tomato');
  const [cropScanPercent, setCropScanPercent] = useState(0);
  const [cropScanStatus, setCropScanStatus] = useState('Ready to Scan');
  const [diagnosedDisease, setDiagnosedDisease] = useState(null);

  // Global advisory alert broadcast states
  const [targetFarm, setTargetFarm] = useState('Farm #1 (Wheat)');
  const [advisoryCrop, setAdvisoryCrop] = useState('Wheat');
  const [advisoryText, setAdvisoryText] = useState('');
  const [advisoryLogs, setAdvisoryLogs] = useState([]);

  // Fetch consultation appointments from server
  const fetchCloudBookings = async () => {
    setBookingsLoading(true);
    try {
      const res = await api.get('/platform/consultation');
      setCloudBookings(res.data);
    } catch (e) {
      console.warn("Failed to retrieve consultation bookings, running local fallback simulation.");
      setCloudBookings([
        { _id: '1', farmerName: 'Shiva Kumar', expertName: 'Dr. Arjun Patel', date: '2026-06-01', time: '10:00', queryText: 'Yellow spots with dark concentric rings appearing on lower leaves of tomato plants in Ludhiana.', status: 'Scheduled' },
        { _id: '2', farmerName: 'Gurdev Singh', expertName: 'Dr. Arjun Patel', date: '2026-05-29', time: '14:30', queryText: 'Soil NPK test indicates severe Nitrogen deficiency (N is under 40kg/ha). What urea top-dressing dosage is safe?', status: 'Completed', replyText: 'Apply Urea at 120 kg/ha in split doses during early morning watering schedules to secure nitrogen saturation.' }
      ]);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudBookings();
  }, []);

  // Submit expert consultation reply
  const handleSendReply = async (bookingId) => {
    const text = replyInputs[bookingId];
    if (!text?.trim()) return;
    try {
      await api.post(`/platform/consultation/reply/${bookingId}`, { replyText: text });
      setSuccessMsg("Dispatched customized prescription advice to farmer!");
      speak("Dispatched customized prescription advice to farmer.");
      setReplyInputs(prev => ({ ...prev, [bookingId]: '' }));
      fetchCloudBookings();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setCloudBookings(prev => prev.map(b => b._id === bookingId ? { ...b, replyText: text, status: 'Completed' } : b));
      setSuccessMsg("Prescription advice dispatched (Offline Standby Mode)!");
      speak("Prescription advice dispatched.");
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Broadcast block-wide agricultural alerts
  const handleBroadcastAdvisory = (e) => {
    if (e) e.preventDefault();
    if (!advisoryText.trim()) return;

    const newAdvisory = {
      farm: targetFarm,
      crop: advisoryCrop,
      message: advisoryText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setAdvisoryLogs(prev => [newAdvisory, ...prev]);
    setSuccessMsg(`Advisory broadcast successfully dispatched to ${targetFarm}.`);
    speak(`Agronomy advisory dispatched. Destination: ${targetFarm}.`);
    setAdvisoryText('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleDateString('en-US', { 
        day: 'numeric', month: 'short', year: 'numeric', weekday: 'short'
      }) + ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Regional information constants
  const regions = {
    Ludhiana: { label: 'Punjab Sector', temp: '25.6°C', hum: '65%', wind: '12.4 km/h', rain: '1.8 mm', farms: 12, hectares: 1245 },
    Guntur: { label: 'Andhra Sector', temp: '33.8°C', hum: '48%', wind: '9.8 km/h', rain: '0.0 mm', farms: 8, hectares: 980 },
    Nashik: { label: 'Maharashtra Sector', temp: '29.2°C', hum: '52%', wind: '10.5 km/h', rain: '0.2 mm', farms: 14, hectares: 1560 }
  };
  const activeProfile = regions[activeRegion];

  // Soil suitablity equation
  const solveSoilMetrics = (n, p, k, hum, ph) => {
    const score = Math.round((n / 250 * 100 + p / 25 * 100 + k / 350 * 100 + hum) / 4);
    let recommendation = 'Apply 120 kg Urea, 60 kg DAP, and 40 kg MOP per hectare for balanced field nutrients.';
    let rotation = 'Rotate wheat with legume crops to improve soil biological structures.';
    if (score > 80) {
      recommendation = 'Soil parameters are excellent. Apply standard maintenance organic compost.';
    } else if (score < 60) {
      recommendation = 'Deploy double sulfur minerals and micro-irrigate daily. Apply organic manure.';
      rotation = 'Urgent cover crops are required to recover active humus layers.';
    }
    return { score, recommendation, rotation };
  };
  const currentSoilAI = solveSoilMetrics(simN, simP, simK, simMoisture, simPH);

  // Pathogen scan simulation
  const handleStartCropScan = () => {
    if (cropScanPercent > 0) return;
    setCropScanStatus('Scanning...');
    setCropScanPercent(10);
    speak(`Scanning foliar structures for ${diagnoseTargetCrop}.`);
  };

  useEffect(() => {
    if (cropScanPercent > 0 && cropScanPercent < 100) {
      const timer = setTimeout(() => {
        setCropScanPercent(prev => prev + 30);
      }, 300);
      return () => clearTimeout(timer);
    } else if (cropScanPercent >= 100) {
      setCropScanPercent(0);
      setCropScanStatus('Completed');
      if (diagnoseTargetCrop === 'Tomato') {
        setDiagnosedDisease({
          pathogen: 'Tomato Late Blight (Alternaria solani)',
          confidence: '95%',
          severity: 'HIGH RISK',
          remedy: 'Apply Mancozeb 75% WP spray; activate targeted drip lines.'
        });
        speak("Tomato Late Blight detected with 95 percent confidence.");
      } else {
        setDiagnosedDisease({
          pathogen: 'No active pathogens detected.',
          confidence: '99%',
          severity: 'HEALTHY',
          remedy: 'Maintain present precision watering calendars.'
        });
        speak("Foliage structures appear healthy.");
      }
    }
  }, [cropScanPercent, diagnoseTargetCrop]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex font-sans antialiased text-left selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-950/80 border-r border-slate-900/60 p-6 flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-8">
          
          {/* Brand header */}
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-900/60">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-emerald-400">
              <Sprout size={20} className="animate-pulse" />
            </div>
            <div className="text-left leading-tight">
              <span className="block font-black text-sm tracking-tight text-white font-mono">AgriExpert AI</span>
              <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-bold">Workspace Portal</span>
            </div>
          </div>

          {/* Tab switches */}
          <div className="space-y-1.5">
            <span className="block text-[8.5px] font-black uppercase text-slate-500 tracking-wider mb-2">Expert Workspaces</span>
            {[
              { id: 'Consultations', label: 'Consultations Hub', icon: MessageSquare },
              { id: 'Soil', label: 'Soil Health Calibrator', icon: Leaf },
              { id: 'Pathology', label: 'Foliar Leaf Scanner', icon: Bug }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); speak(`Navigated to ${tab.label}.`); }}
                className={`w-full flex items-center space-x-3 border px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg' 
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Info card */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl text-[9px] text-slate-400 space-y-2 mt-6">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Brain size={12} className="text-emerald-400" />
            <span>Workspace Assistant</span>
          </div>
          <p className="leading-relaxed">Verify farmer consultations and run patholology validations to push customized advice logs.</p>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-grow p-8 space-y-8 overflow-y-auto max-w-7xl">
        
        {/* TOP COMMAND HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-900/60">
          <div className="space-y-1 text-left">
            <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">Operations Center</span>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1.5">Agriculture Expert Workspace</h1>
            <p className="text-xs text-slate-400 font-light">Welcome back, <strong className="text-white font-semibold">Dr. Arjun Patel</strong> • Smart Farming Advisory Panel</p>
          </div>

          {/* Indicators bar */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 border border-slate-900 p-3.5 rounded-3xl">
            <div className="text-left">
              <span className="block text-[7px] uppercase font-bold text-slate-500">Region Zone</span>
              <select
                value={activeRegion}
                onChange={(e) => { setActiveRegion(e.target.value); speak(`Loading active records for ${e.target.value}.`); }}
                className="bg-transparent text-white font-black text-xs focus:outline-none cursor-pointer border-none p-0 mt-0.5"
              >
                <option value="Ludhiana" className="text-slate-800 font-semibold bg-white text-xs">Punjab (Ludhiana)</option>
                <option value="Guntur" className="text-slate-800 font-semibold bg-white text-xs">Andhra (Guntur)</option>
                <option value="Nashik" className="text-slate-800 font-semibold bg-white text-xs">Maharashtra (Nashik)</option>
              </select>
            </div>

            <div className="h-5 w-px bg-slate-800/80" />

            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center space-x-1.5">
                <Thermometer size={13} className="text-amber-500" />
                <span className="text-xs font-black text-white">{activeProfile.temp}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Droplet size={13} className="text-blue-400" />
                <span className="text-xs font-black text-white">{activeProfile.hum}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CloudRain size={13} className="text-indigo-400" />
                <span className="text-xs font-black text-white">{activeProfile.rain}</span>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-800/80" />

            <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[9px]">
              <Clock size={11} className="text-emerald-400" />
              <span>{liveTime}</span>
            </div>
          </div>
        </header>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
            <CheckCircle size={14} className="animate-pulse" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* METRIC BADGES */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Soil Health Score', value: `${currentSoilAI.score}/100`, desc: 'Calibrated AI Index', icon: Activity, color: 'text-emerald-400' },
            { label: 'Active Farms', value: activeProfile.farms, desc: 'Managed fields', icon: Globe, color: 'text-blue-400' },
            { label: 'Managed Area', value: `${activeProfile.hectares} Ha`, desc: 'Tilled Hectares', icon: Sprout, color: 'text-indigo-400' },
            { label: 'Consultation Sessions', value: cloudBookings.length, desc: 'Total Booking Queries', icon: MessageSquare, color: 'text-amber-400' }
          ].map((badge, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800/60 p-4.5 rounded-3xl text-left flex flex-col justify-between space-y-2 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{badge.label}</span>
                <badge.icon size={16} className={badge.color} />
              </div>
              <div>
                <span className="text-xl font-black text-white">{badge.value}</span>
                <span className="block text-[8px] text-slate-500 font-bold uppercase mt-0.5">{badge.desc}</span>
              </div>
            </div>
          ))}
        </section>

        {/* CORE WORKSPACE CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* TAB AREA (2/3 col) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* WORKSPACE 1: CONSULTATIONS */}
            {activeTab === 'Consultations' && (
              <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={16} className="text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Farmer Consultations Manager</h3>
                  </div>
                  <button 
                    onClick={fetchCloudBookings}
                    className="bg-slate-800 hover:bg-slate-700 text-[9px] text-slate-350 font-bold border border-slate-700 px-2 py-1 rounded uppercase tracking-wider"
                  >
                    Sync Requests
                  </button>
                </div>

                {bookingsLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-2">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Refreshing Bookings...</span>
                  </div>
                ) : cloudBookings.length === 0 ? (
                  <p className="py-12 text-center text-xs text-slate-500 font-light">No consultation bookings registered.</p>
                ) : (
                  <div className="space-y-4">
                    {cloudBookings.map((b) => (
                      <div key={b._id} className="bg-slate-950/65 border border-slate-900 rounded-2xl p-4.5 space-y-3.5 hover:border-slate-850 transition-all">
                        <div className="flex justify-between items-start border-b border-slate-900 pb-2.5">
                          <div>
                            <span className="text-xs font-black text-white">{b.farmerName}</span>
                            <span className="block text-[8px] text-slate-500 font-bold font-mono uppercase mt-0.5">Booking Slot: {b.date} • {b.time}</span>
                          </div>
                          <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border ${
                            b.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                          }`}>{b.status}</span>
                        </div>

                        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-900/60">
                          <span className="text-[8px] text-slate-500 font-bold uppercase block tracking-wider mb-1">Farmer Query Detail</span>
                          <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">{b.queryText}</p>
                        </div>

                        {b.status === 'Completed' ? (
                          <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 space-y-1">
                            <span className="text-[8px] text-emerald-400 font-bold uppercase block">Expert Recommendation Reply</span>
                            <p className="text-[10.5px] text-slate-300 italic">"{b.replyText || 'Advice logged successfully.'}"</p>
                          </div>
                        ) : (
                          <div className="space-y-2 text-left pt-1">
                            <span className="text-[8px] text-slate-500 font-bold uppercase block tracking-wider">Type Agronomist Prescription Reply</span>
                            <textarea 
                              rows={2.5}
                              value={replyInputs[b._id] || ''}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [b._id]: e.target.value }))}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-medium"
                              placeholder="Type exact fertilizer dosages, organic alternatives, or water volumes..."
                            />
                            <button
                              type="button"
                              onClick={() => handleSendReply(b._id)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-1.5 px-4 rounded-xl text-[9px] uppercase tracking-wider transition-all shadow-md self-end"
                            >
                              Dispatch Advice
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* WORKSPACE 2: SOIL HEALTH CALIBRATOR */}
            {activeTab === 'Soil' && (
              <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Leaf size={16} className="text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">NPK Soil Health Calibrator</h3>
                  </div>
                  <Database size={14} className="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calibration range knobs */}
                  <div className="space-y-4 font-semibold text-[10px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400 uppercase">
                        <span>Nitrogen (N):</span>
                        <span className="font-extrabold text-blue-400">{simN} kg/ha</span>
                      </div>
                      <input type="range" min="50" max="300" value={simN} onChange={(e) => setSimN(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400 uppercase">
                        <span>Phosphorus (P):</span>
                        <span className="font-extrabold text-emerald-400">{simP} kg/ha</span>
                      </div>
                      <input type="range" min="5" max="50" step="0.5" value={simP} onChange={(e) => setSimP(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400 uppercase">
                        <span>Potassium (K):</span>
                        <span className="font-extrabold text-amber-400">{simK} kg/ha</span>
                      </div>
                      <input type="range" min="100" max="450" value={simK} onChange={(e) => setSimK(parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-500" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400 uppercase">
                        <span>Acidity (pH):</span>
                        <span className="font-extrabold text-indigo-400">{simPH} pH</span>
                      </div>
                      <input type="range" min="4.5" max="9.0" step="0.1" value={simPH} onChange={(e) => setSimPH(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                  </div>

                  {/* AI Recipe Outcomes */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-4">
                    <div className="border-b border-slate-900 pb-2">
                      <span className="block text-[8px] text-slate-500 font-black uppercase tracking-wider">AI Soil Quality Index</span>
                      <div className="flex items-baseline space-x-1.5 mt-1">
                        <span className="text-2xl font-black text-white">{currentSoilAI.score}</span>
                        <span className="text-[10px] text-slate-500 font-bold">/100</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase font-black block">Recommended Compost Recipe</span>
                        <p className="text-xs font-bold text-white leading-normal mt-1">{currentSoilAI.recommendation}</p>
                      </div>
                      <div className="border-t border-slate-900 pt-2.5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block">Crop Rotation Advisory</span>
                        <p className="text-[10.5px] text-slate-400 leading-normal mt-1">{currentSoilAI.rotation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => speak(`Calibrated soil health score stands at ${currentSoilAI.score} percent. Compost recommendation: ${currentSoilAI.recommendation}`)}
                  className="w-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white font-bold py-2 rounded-xl text-xs transition-all uppercase tracking-wide text-center"
                >
                  Broadcast Soil Advisory Warning
                </button>
              </div>
            )}

            {/* WORKSPACE 3: FOLIAR LEAF SCANNER */}
            {activeTab === 'Pathology' && (
              <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Bug size={16} className="text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">AI Foliar Pathogen Leaf Scanner</h3>
                  </div>
                  <span className="text-[8px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase">AI Pathology</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500">Target Crop Type</label>
                      <select
                        value={diagnoseTargetCrop}
                        onChange={(e) => { setDiagnoseTargetCrop(e.target.value); setDiagnosedDisease(null); }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Tomato">Tomato</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Wheat">Wheat</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="block text-[9px] uppercase text-slate-500 font-black">Scanner Status</span>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 text-white font-mono text-[10px]">
                        {cropScanPercent > 0 ? `SCANNING FOLIAGE: ${cropScanPercent}%` : cropScanStatus}
                      </div>
                    </div>

                    <button 
                      onClick={handleStartCropScan}
                      disabled={cropScanPercent > 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider"
                    >
                      {cropScanPercent > 0 ? 'Analyzing foliage...' : 'Run Pathology Scan'}
                    </button>
                  </div>

                  {/* Leaf viewfinder box */}
                  <div className="relative h-44 rounded-2xl bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=400&q=80" 
                      alt="Crop foliage" 
                      className="w-full h-full object-cover opacity-60" 
                    />
                    {cropScanPercent > 0 && (
                      <>
                        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981] animate-bounce pointer-events-none" />
                      </>
                    )}
                    <span className="absolute top-2 left-2 text-[8px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded uppercase font-bold">Pathology camera active</span>
                  </div>
                </div>

                {diagnosedDisease && (
                  <div className="bg-slate-950/90 border border-slate-900 p-4.5 rounded-2xl mt-4 space-y-2 text-left">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <span className="text-white font-black text-xs uppercase">{diagnosedDisease.pathogen}</span>
                      <span className="text-red-400 text-[8px] font-mono font-black uppercase tracking-wider">{diagnosedDisease.severity}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400 font-semibold">
                      <div>
                        <span className="block text-[8px] text-slate-600 uppercase font-black">Match Confidence</span>
                        <span className="text-white font-bold">{diagnosedDisease.confidence}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-600 uppercase font-black">Treatment Remedy</span>
                        <span className="text-white font-bold">{diagnosedDisease.remedy}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* SIDEBAR ALERTS PANEL (1/3 col) */}
          <div className="space-y-6">
            
            {/* Global Broadcast Form */}
            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Radio size={16} className="text-emerald-400 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Push Regional Warning</h3>
                </div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-mono">Broadcast</span>
              </div>

              <form onSubmit={handleBroadcastAdvisory} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-wider text-slate-500">Destination Block</label>
                    <select
                      value={targetFarm}
                      onChange={(e) => setTargetFarm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Farm #1 (Wheat)">Farm #1</option>
                      <option value="Farm #2 (Maize)">Farm #2</option>
                      <option value="Farm #3 (Tomato)">Farm #3</option>
                      <option value="Farm #4 (Cotton)">Farm #4</option>
                      <option value="Farm #5 (Rice)">Farm #5</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-wider text-slate-500">Crop Group</label>
                    <select
                      value={advisoryCrop}
                      onChange={(e) => setAdvisoryCrop(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Maize">Maize</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Rice">Rice</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[8px] font-black uppercase tracking-wider text-slate-500">Broadcast Alert Message</label>
                  <textarea
                    rows={3}
                    value={advisoryText}
                    onChange={(e) => setAdvisoryText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    placeholder="Type advisory or weather warnings..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow flex items-center justify-center space-x-1.5"
                >
                  <Send size={12} className="animate-pulse" />
                  <span>Broadcast Warning</span>
                </button>
              </form>

              {/* Logs */}
              {advisoryLogs.length > 0 && (
                <div className="bg-black/35 border border-slate-900 p-3 rounded-xl text-[7.5px] font-mono text-emerald-400 space-y-1 max-h-24 overflow-y-auto">
                  <span className="block font-bold">&gt; Recent Dispatched Alerts:</span>
                  {advisoryLogs.map((log, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate max-w-[120px]">• [{log.farm}] {log.message}</span>
                      <span className="opacity-60">{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wholesale APEDA crop market indices */}
            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl text-left space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="block font-black text-sm text-white uppercase tracking-wider">APEDA Price Intelligence</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Wheat', rate: '₹ 2,125 / ql', percent: '+2.4%' },
                  { name: 'Maize', rate: '₹ 1,870 / ql', percent: '+1.1%' },
                  { name: 'Cotton', rate: '₹ 6,420 / ql', percent: '-0.8%' },
                  { name: 'Rice', rate: '₹ 2,980 / ql', percent: '+0.9%' }
                ].map((crop, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => {
                      speak(`APEDA wholesale rate for ${crop.name} is ${crop.rate}.`);
                      setSuccessMsg(`Fetched wholesale trade bounds for ${crop.name}.`);
                      setTimeout(() => setSuccessMsg(''), 2500);
                    }}
                    className="flex items-center justify-between bg-slate-950/40 border border-slate-900 p-2.5 rounded-xl w-full focus:outline-none hover:border-slate-850 text-left font-semibold"
                  >
                    <span className="font-bold text-white text-[11px]">{crop.name}</span>
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-300 font-extrabold">{crop.rate}</span>
                      <span className={`text-[8px] font-black uppercase font-mono mt-0.5 inline-block ${crop.percent.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {crop.percent}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ExpertDashboard;
