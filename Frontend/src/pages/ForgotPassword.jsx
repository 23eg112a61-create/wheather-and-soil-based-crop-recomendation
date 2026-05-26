import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ForgotPassword = () => {
  const { speak } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    speak("A secure password reset link has been dispatched to your email inbox.");
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
      
      <div className="max-w-md w-full glassmorphism p-8 rounded-3xl shadow-xl relative border border-white space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white w-fit mx-auto mb-2 shadow-sm">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Recover access to your smart farming analytics profile.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-6 rounded-2xl flex flex-col items-center space-y-4 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck size={48} className="animate-bounce" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Reset E-mail Sent!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We have dispatched a cryptographic reset link to <strong>{email}</strong>. Check your inbox and follow the steps.
                </p>
              </div>
            </div>
            
            <Link to="/login" className="inline-flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="farmer@smartfarm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Transmit Reset Link</span>
            </button>
            
            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors">
                <ArrowLeft size={14} />
                <span>Return to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
