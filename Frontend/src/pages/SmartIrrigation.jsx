import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { Droplet, Compass, Settings, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SmartIrrigation = () => {
  const { speak } = useApp();
  const [moisture, setMoisture] = useState(45);
  const [motorOn, setMotorOn] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/soil/all');
        if (res.data.length > 0) {
          setMoisture(res.data[0].moisture);
          setHistory(res.data);
        }
      } catch (err) {
        setHistory([
          { moisture: 45, createdAt: '09:00' },
          { moisture: 42, createdAt: '11:00' },
          { moisture: 48, createdAt: '13:00' },
          { moisture: 52, createdAt: '15:00' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleMotor = () => {
    setMotorOn(!motorOn);
    speak(`Smart irrigation motor pump toggled ${!motorOn ? 'ON' : 'OFF'}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      <div className="space-y-2 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Hydration & Irrigation Laboratory</h2>
        <p className="text-slate-500 text-sm">Simulate solenoid valve switches, monitor real-time soil water depletion curves, and automate motor triggers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pump controller simulation */}
        <div className="glassmorphism p-6 rounded-3xl border flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Settings className="mr-2 text-emerald-500" size={20} />
              Motor Control Rig
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
              motorOn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
            }`}>{motorOn ? 'RUNNING' : 'STANDBY'}</span>
          </div>

          <div className="space-y-4 text-left">
            <p className="text-sm text-slate-500 leading-relaxed">
              Target Soil Moisture hydration index is configured to 55%. Current real-time soil water retention reading is {moisture}%.
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-2xl border flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Volumetric target</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">12 Liters / sqm</span>
              </div>
              
              <button
                onClick={toggleMotor}
                className={`font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md ${
                  motorOn ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {motorOn ? 'Stop Pump' : 'Start Pump'}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t pt-3 flex justify-between font-medium">
            <span>Solenoid state: Closed</span>
            <span>Power grid: Normal</span>
          </div>
        </div>

        {/* Moisture Graph charts */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Droplet className="mr-2 text-emerald-500" size={20} />
            Water Retention Moisture Analytics
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history.slice().reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMoist2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="createdAt" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="moisture" name="Moisture (%)" stroke="#059669" fillOpacity={1} fill="url(#colorMoist2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartIrrigation;
