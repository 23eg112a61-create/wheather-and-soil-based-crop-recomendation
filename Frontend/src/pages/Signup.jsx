import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Mail, Lock, User, Phone, MapPin, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

const Signup = () => {
  const { register, speak } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Name, email, and password are required fields.');
      return;
    }

    if (password.length < 8) {
      setError('For security, passwords must be at least 8 characters long.');
      speak('For security, passwords must be at least 8 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, role, location, phone);
      setSuccess('Your account was registered successfully! Redirecting you to login...');
      speak('Your account was registered successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please check your data and try again.';
      setError(errMsg);
      speak(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
      
      <div className="max-w-lg w-full glassmorphism p-8 rounded-3xl shadow-xl relative border border-white space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white w-fit mx-auto mb-2 shadow-sm">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Create an Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join the precision farming revolution with AI analytics.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex items-start space-x-3 text-red-700 dark:text-red-300 text-xs text-left">
            <ShieldAlert className="flex-shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert Box */}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl flex items-start space-x-3 text-emerald-700 dark:text-emerald-300 text-xs text-left">
            <CheckCircle className="flex-shrink-0 mt-0.5" size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Shiva Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="shiva@smartfarm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Password (Min 8 Chars)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
              >
                <option value="farmer">Farmer</option>
                <option value="expert">Agriculture Expert</option>
                <option value="analyst_weather">Weather Analyst</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Punjab, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Registering Account...' : 'Sign Up'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-emerald-800/40 pt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already have an agricultural account?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
