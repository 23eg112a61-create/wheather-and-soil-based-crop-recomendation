import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Users, Radio, ShieldAlert, Cpu, CheckCircle, Ban, Edit, Trash, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const { speak } = useApp();
  const [users, setUsers] = useState([
    { id: 1, name: 'Shiva Kumar', email: 'shiva@smartfarm.com', role: 'farmer', location: 'Punjab', status: 'Active' },
    { id: 2, name: 'Dr. Ramesh Rao', email: 'ramesh@agro.gov', role: 'expert', location: 'Delhi Center', status: 'Active' },
    { id: 3, name: 'Ananya Sen', email: 'ananya@soil-labs.org', role: 'expert', location: 'Kolkata Lab', status: 'Active' },
    { id: 4, name: 'Vikram Joshi', email: 'vikram@weather.net', role: 'analyst_weather', location: 'Shimla Station', status: 'Active' }
  ]);

  const [sensors, setSensors] = useState([
    { id: 'NODE-01-NPK', type: 'Soil NPK', battery: '89%', status: 'online' },
    { id: 'NODE-02-PH', type: 'pH Probe', battery: '94%', status: 'online' },
    { id: 'NODE-03-MOIST', type: 'Humidity', battery: '42%', status: 'online' },
    { id: 'NODE-04-VALVE', type: 'Solenoid Valve', battery: '75%', status: 'maintenance' }
  ]);

  const cropStats = [
    { name: 'Rice', farmers: 45 },
    { name: 'Maize', farmers: 32 },
    { name: 'Wheat', farmers: 28 },
    { name: 'Cotton', farmers: 19 },
    { name: 'Coffee', farmers: 12 }
  ];

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    speak("User privilege level modified successfully.");
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    speak("User account status adjusted.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Operations Panel</h2>
        <p className="text-slate-500 text-sm">Monitor operational statuses, manage credentials, check telemetry node registries, and overview overall crop data graphs.</p>
      </div>

      {/* Numerical Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glassmorphism p-6 rounded-2xl flex items-center justify-between border">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Registered Users</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{users.length}</span>
          </div>
          <div className="bg-emerald-100 p-3.5 rounded-xl text-emerald-600"><Users size={24} /></div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl flex items-center justify-between border">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">IoT Nodes Logged</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{sensors.length}</span>
          </div>
          <div className="bg-emerald-100 p-3.5 rounded-xl text-emerald-600"><Radio size={24} /></div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl flex items-center justify-between border">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">System Resource</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">Normal</span>
          </div>
          <div className="bg-emerald-100 p-3.5 rounded-xl text-emerald-600"><Cpu size={24} /></div>
        </div>

        <div className="glassmorphism p-6 rounded-2xl flex items-center justify-between border">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Active Database</span>
            <span className="text-3xl font-extrabold text-emerald-600">Secure</span>
          </div>
          <div className="bg-emerald-100 p-3.5 rounded-xl text-emerald-600"><Activity size={24} /></div>
        </div>
      </div>

      {/* Users and Crop Analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User list table */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Users className="mr-2 text-emerald-500" size={20} />
            User Management Registry
          </h3>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-400 font-semibold text-xs">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-white">{u.name}</td>
                    <td className="py-4 px-4 text-slate-500">{u.email}</td>
                    <td className="py-4 px-4">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-100 dark:bg-emerald-950/40 rounded px-1 py-0.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="expert">Expert</option>
                        <option value="analyst_weather">Weather Analyst</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-900 ${
                          u.status === 'Active' ? 'text-red-500' : 'text-emerald-500'
                        }`}
                        title={u.status === 'Active' ? 'Suspend User' : 'Activate User'}
                      >
                        {u.status === 'Active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crop analytics Chart */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Crop Recommendation Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropStats}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="farmers" name="Active Farmers" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Sensor node status grid */}
      <div className="glassmorphism p-6 rounded-3xl border space-y-6">
        <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
          <Radio className="mr-2 text-emerald-500" size={20} />
          Active Wireless Node Registers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {sensors.map(s => (
            <div key={s.id} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold block text-sm text-slate-800 dark:text-white">{s.id}</span>
                <span className="block text-xs text-slate-400">{s.type} Probe</span>
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  s.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{s.status}</span>
              </div>
              <div className="text-right space-y-0.5">
                <span className="block text-[10px] text-slate-400 uppercase">Battery</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">{s.battery}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
