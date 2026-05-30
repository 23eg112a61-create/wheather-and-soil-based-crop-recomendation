import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Mail, Lock, ShieldAlert, ArrowRight, CheckCircle, Sprout, CloudSun, GraduationCap, UserCheck, Smartphone } from 'lucide-react';

const Login = () => {
  const { login, verifyEmail, resendVerification, t, speak } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Verification Fallback States
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resendStatus, setResendStatus] = useState('');

  // Resend Countdown Timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password || !role) {
      setError('Please provide email, password, and select your system role.');
      speak('Please provide email, password, and select your system role.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email, password, role);
      setSuccess('Logged in successfully!');
      
      const userRole = data.user.role;
      if (userRole === 'admin') navigate('/dashboard/admin');
      else if (userRole === 'expert') navigate('/dashboard/expert');
      else navigate('/dashboard/farmer');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Invalid credentials. Please verify your details.';
      setError(errMsg);
      speak(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmail(email, otpCode);
      setSuccess('Verification completed! You can now log in.');
      speak('Verification completed.');
      setIsVerifying(false);
      setOtpCode('');
      setDevOtpCode('');
      setError('');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Verification failed. Please check the code and try again.';
      setError(errMsg);
      speak(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    setError('');
    setSuccess('');
    setResendStatus('Resending...');
    
    try {
      await resendVerification(email);
      setSuccess('A fresh verification code has been generated!');
      speak('Verification code resent.');
      setCountdown(60);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to resend code. Please try again.';
      setError(errMsg);
      speak(errMsg);
    } finally {
      setResendStatus('');
    }
  };

  // Modern Role Grid data definitions
  const roleOptions = [
    { id: 'farmer', label: 'Farmer', icon: Sprout, desc: 'Precision farming & NPK tracking' },
    { id: 'expert', label: 'Expert', icon: GraduationCap, desc: 'Agri-consultancy & training' },
    { id: 'admin', label: 'Admin', icon: UserCheck, desc: 'System management & security' },
  ];

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
      
      <div className="max-w-xl w-full glassmorphism p-8 rounded-3xl shadow-xl relative border border-white space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white w-fit mx-auto mb-2 shadow-sm">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isVerifying ? 'Verify Your Email' : 'Log In'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isVerifying
              ? 'Enter the OTP to complete registration.'
              : 'Sign in to access your smart precision dashboards.'}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-xl flex items-start space-x-3 text-red-700 dark:text-red-300 text-xs text-left animate-shake">
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

        {/* Form rendering */}
        {!isVerifying ? (
          /* STANDARD LOGIN INTERFACE */
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            
            {/* Interactive Premium Role Selector Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block text-center sm:text-left">
                Select Your Dashboard Access Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = role === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRole(opt.id)}
                      className={`flex items-start space-x-3 p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-white/60 dark:bg-emerald-950/10 border-slate-200 dark:border-emerald-800/20 hover:border-emerald-500/40 dark:hover:border-emerald-500/30'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-emerald-900/30 text-slate-500 dark:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <span className={`block text-sm font-extrabold transition-colors ${
                          isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="block text-[10px] text-slate-400 leading-tight">
                          {opt.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Email Address</label>
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

            {/* Password Field */}
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
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : t('login')}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          /* EMAIL OTP VERIFICATION FALLBACK SCREEN */
          <form onSubmit={handleVerifyCode} className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                Please enter the 6-digit verification code generated for:
              </p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wide text-center">
                {email}
              </p>
            </div>

            {/* OTP Code Input */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block text-center">
                Enter 6-Digit Code
              </label>
              <div className="relative max-w-xs mx-auto">
                <Smartphone className="absolute left-4 top-4 text-slate-400 pointer-events-none" size={20} />
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center tracking-[1.2em] pl-[1.2em] font-mono text-2xl font-black bg-white/80 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>



            {/* Actions */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full max-w-xs mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Verifying...' : 'Verify & Complete Access'}</span>
              <CheckCircle size={16} />
            </button>

            <div className="pt-2 text-sm text-slate-500 dark:text-slate-400 space-y-3">
              {countdown > 0 ? (
                <p className="text-xs text-center">
                  Resend code available in <span className="font-extrabold text-slate-700 dark:text-slate-300 font-mono">{countdown}</span> seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendStatus !== ''}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  {resendStatus ? resendStatus : 'Resend Verification Code'}
                </button>
              )}

              <p className="text-xs pt-2 text-center">
                Need to go back?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifying(false);
                    setOtpCode('');
                    setError('');
                    setSuccess('');
                  }}
                  className="text-slate-600 dark:text-slate-300 font-bold hover:underline"
                >
                  Return to Login Screen
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Footer Navigation Link */}
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
