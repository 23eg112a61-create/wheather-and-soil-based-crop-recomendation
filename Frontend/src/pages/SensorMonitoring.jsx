import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { Radio, Battery, Compass, ShieldAlert, Cpu, CheckCircle, ArrowRight, Activity } from 'lucide-react';

const SensorMonitoring = () => {
  const { speak } = useApp();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSensors = async () => {
    try {
      const res = await api.get('/sensor/status');
      setSensors(res.data);
    } catch (err) {
      setSensors([
        { deviceId: 'NODE-01-NPK', sensorType: 'Soil NPK Sensor', batteryLevel: 89, status: 'online' },
        { deviceId: 'NODE-02-PH', sensorType: 'Soil pH Probe', batteryLevel: 94, status: 'online' },
        { deviceId: 'NODE-03-MOIST', sensorType: 'Foliar Moisture Sensor', batteryLevel: 42, status: 'online' },
        { deviceId: 'NODE-04-VALVE', sensorType: 'Solenoid Irrigation Valve', batteryLevel: 75, status: 'maintenance' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleSimulateBatteryDrain = () => {
    setSensors(sensors.map(s => s.deviceId === 'NODE-03-MOIST' ? { ...s, batteryLevel: 12, status: 'offline' } : s));
    speak("Simulated node power drainage. NODE-03 reported critical shutdown.");
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 border-b pb-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Distributed IoT Sensor Matrix</h2>
          <p className="text-slate-500 text-sm">Review real-time wireless telemetry node health metrics, solar cell charger grids, and online markers.</p>
        </div>
        <button
          onClick={handleSimulateBatteryDrain}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm shadow-md transition-all flex items-center space-x-2"
        >
          <Activity size={16} />
          <span>Simulate Node Node-03 Failure</span>
        </button>
      </div>

      {/* Numerical inventory panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Operational Nodes</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {sensors.filter(s => s.status === 'online').length}
            </span>
          </div>
          <div className="bg-emerald-100 p-3 text-emerald-600 rounded-xl"><CheckCircle size={22} /></div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Maintenance Required</span>
            <span className="text-3xl font-extrabold text-amber-600">
              {sensors.filter(s => s.status === 'maintenance').length}
            </span>
          </div>
          <div className="bg-amber-100 p-3 text-amber-600 rounded-xl"><Compass size={22} /></div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-400 uppercase">Power Failures</span>
            <span className="text-3xl font-extrabold text-red-500">
              {sensors.filter(s => s.status === 'offline').length}
            </span>
          </div>
          <div className="bg-red-100 p-3 text-red-600 rounded-xl"><ShieldAlert size={22} /></div>
        </div>
      </div>

      {/* Inventory Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sensors.map((s, idx) => (
          <div key={idx} className="glassmorphism p-6 rounded-3xl border flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold uppercase text-slate-400">Node telemetry link</span>
              <span className={`h-2.5 w-2.5 rounded-full ${
                s.status === 'online' ? 'bg-emerald-500 animate-pulse' :
                s.status === 'offline' ? 'bg-red-500' : 'bg-amber-500'
              }`}></span>
            </div>

            <div className="space-y-1">
              <span className="font-bold block text-slate-800 dark:text-white text-base">{s.deviceId}</span>
              <span className="block text-xs text-slate-500 font-medium">{s.sensorType}</span>
            </div>

            <div className="bg-slate-50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="block text-[9px] uppercase font-bold text-slate-400">Solar Battery</span>
                <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{s.batteryLevel}%</span>
              </div>
              <Battery size={18} className={s.batteryLevel > 50 ? 'text-emerald-500' : s.batteryLevel > 20 ? 'text-amber-500' : 'text-red-500'} />
            </div>

            <div className="flex justify-between items-center text-xs font-semibold pt-1">
              <span className="text-slate-400">Signal Index:</span>
              <span className="text-emerald-600">Excellent</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SensorMonitoring;
