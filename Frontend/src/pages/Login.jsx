import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, t, speak } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please provide both your email address and password.');
      speak('Please provide both your email address and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password);
      const role = data.user.role;
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'expert') navigate('/dashboard/expert');
      else if (role === 'analyst_weather') navigate('/dashboard/weather');
      else navigate('/dashboard/farmer');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Invalid credentials. Please verify your email and password.';
      setError(errMsg);
      speak(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
      
      <div className="max-w-md w-full glassmorphism p-8 rounded-3xl shadow-xl relative border border-white space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white w-fit mx-auto mb-2 shadow-sm">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Login
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your smart precision dashboards.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex items-start space-x-3 text-red-700 dark:text-red-300 text-xs">
            <ShieldAlert className="flex-shrink-0 mt-0.5" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="farmer@smartfarm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : t('login')}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="border-t border-slate-200 dark:border-emerald-800/40 pt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an agricultural account?{' '}
            <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
