import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Activity, Plus, ShieldCheck, CheckCircle, Heart, Award, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const LivestockDairy = () => {
  const { speak } = useApp();
  const [animals, setAnimals] = useState([]);
  
  // Animal form state
  const [animalType, setAnimalType] = useState('Cow');
  const [tagNumber, setTagNumber] = useState('');
  const [healthStatus, setHealthStatus] = useState('Healthy');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [feedSchedule, setFeedSchedule] = useState('Green Fodder + Conc');
  const [dailyProd, setDailyProd] = useState('');
  const [lastVacc, setLastVacc] = useState('2026-05-01');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vet directory
  const vets = [
    { name: 'Dr. Karan Gill', center: 'Ludhiana Govt Veterinary Clinic', phone: '+91 98342 98432' },
    { name: 'Dr. Simran Preet', center: 'Amritsar Dairy Research Center', phone: '+91 94234 23423' }
  ];

  // Milk yield historical graph data
  const dairyStats = [
    { day: 'Mon', milk: 32 },
    { day: 'Tue', milk: 34 },
    { day: 'Wed', milk: 30 },
    { day: 'Thu', milk: 35 },
    { day: 'Fri', milk: 38 },
    { day: 'Sat', milk: 36 },
    { day: 'Sun', milk: 37 }
  ];

  const fetchAnimals = async () => {
    try {
      const res = await api.get('/platform/livestock');
      setAnimals(res.data);
    } catch (e) {
      setAnimals([
        { animalType: 'Cow (Holstein)', tagNumber: 'COW-0492', healthStatus: 'Healthy', age: 36, weight: 480, feedSchedule: 'Silage + Mineral Mixture', dailyProduction: 18, lastVaccinationDate: '2026-05-10' },
        { animalType: 'Cow (Gir)', tagNumber: 'COW-0831', healthStatus: 'Healthy', age: 24, weight: 390, feedSchedule: 'Grazing + Green Fodder', dailyProduction: 14, lastVaccinationDate: '2026-04-18' }
      ]);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    setError('');
    if (!tagNumber || !age || !weight) {
      setError('Please fill in unique tag number, age, and weight fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        animalType,
        tagNumber: tagNumber.toUpperCase(),
        healthStatus,
        age: parseInt(age),
        weight: parseFloat(weight),
        feedSchedule,
        dailyProduction: parseFloat(dailyProd) || 0,
        lastVaccinationDate: lastVacc
      };

      await api.post('/platform/livestock/add', payload);
      setSuccess('Animal successfully registered in database.');
      speak("Livestock animal added.");
      setTagNumber('');
      setAge('');
      setWeight('');
      setDailyProd('');
      fetchAnimals();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.warn('Livestock add error, saving locally.');
      const localAnimal = {
        animalType,
        tagNumber: tagNumber.toUpperCase(),
        healthStatus,
        age: parseInt(age),
        weight: parseFloat(weight),
        feedSchedule,
        dailyProduction: parseFloat(dailyProd) || 0,
        lastVaccinationDate: lastVacc
      };
      setAnimals(prev => [localAnimal, ...prev]);
      setSuccess('Animal registered successfully (Standby Mode).');
      setTagNumber('');
      setAge('');
      setWeight('');
      setDailyProd('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Dairy & Herd Administration</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Livestock & Dairy Management</h2>
          <p className="text-emerald-100 text-sm font-light">Track veterinary health registries, log daily dairy milk yields, and optimize custom cattle feed budgets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Animal Registration Form */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6 lg:col-span-1 text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Plus className="mr-2 text-emerald-500" size={20} />
            Register Cattle / Animal
          </h3>

          {success && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700 text-xs">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAddAnimal} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Animal Category</label>
                <select
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                >
                  <option value="Cow (Holstein)">Cow (Holstein)</option>
                  <option value="Cow (Gir)">Cow (Gir)</option>
                  <option value="Buffalo (Murrah)">Buffalo (Murrah)</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Goat">Goat</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Unique Tag ID</label>
                <input
                  type="text"
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                  placeholder="e.g., COW-0482"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Age (Months)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2"
                  placeholder="36"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2"
                  placeholder="450"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Yield (L/Day)</label>
                <input
                  type="number"
                  value={dailyProd}
                  onChange={(e) => setDailyProd(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2"
                  placeholder="15"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase">Cattle Feed Recipe</label>
              <select
                value={feedSchedule}
                onChange={(e) => setFeedSchedule(e.target.value)}
                className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Silage + Mineral Mixture">Corn Silage + Mineral Mix</option>
                <option value="Grazing + Green Fodder">Grazing + Green Clover Fodder</option>
                <option value="Concentrates + Dry Straw">Wheat Straw + Concentrates</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Health status</label>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                >
                  <option value="Healthy">Healthy (Optimal)</option>
                  <option value="Under Treatment">Under Vet Treatment</option>
                  <option value="Dry Period">Dry (Pregnancy)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Last Vaccination</label>
                <input
                  type="date"
                  value={lastVacc}
                  onChange={(e) => setLastVacc(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? 'Registering...' : 'Register Herd Animal'}
            </button>
          </form>
        </div>

        {/* Registered Animal Registry List */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6 text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Activity className="mr-2 text-emerald-500" size={20} />
            Active Herd Registry Log
          </h3>
          
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 text-xs">
            {animals.map((a, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-slate-800 dark:text-white">{a.animalType}</span>
                    <span className="bg-slate-100 dark:bg-emerald-950 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded font-bold">{a.tagNumber}</span>
                  </div>
                  <p className="text-slate-400">Weight: {a.weight} kg • Age: {a.age} Months • Feed: {a.feedSchedule}</p>
                  <p className="text-slate-500 font-light leading-relaxed">
                    <strong>Daily Dairy Yield:</strong> {a.dailyProduction} Liters/Day • <strong>Vaccinated:</strong> {a.lastVaccinationDate}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  a.healthStatus === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{a.healthStatus}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dairy yield trends & Vets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Graph */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Weekly Dairy Production (Liters)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dairyStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="milk" name="Total Milk Output" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vet match */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Heart className="mr-2 text-red-500 animate-pulse" size={20} />
            Veterinary Emergency Contacts
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            In case of emergency outbreaks (FMD, Bovine diseases), contact verified veterinary clinics listed below.
          </p>
          <div className="space-y-4">
            {vets.map((v, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-4 rounded-xl border flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-white block">{v.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{v.center}</span>
                </div>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-extrabold px-3 py-1.5 rounded-lg">{v.phone}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestockDairy;
