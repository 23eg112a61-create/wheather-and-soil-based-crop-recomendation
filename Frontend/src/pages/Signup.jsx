import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Mail, Lock, User, Phone, MapPin, ShieldAlert, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';

const Signup = () => {
  const { register, verifyEmail, resendVerification, speak } = useApp();
  const navigate = useNavigate();
  
  // Registration Form details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  
  // State for Verification Step
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resendStatus, setResendStatus] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      
      setSuccess('Your account has been registered successfully! Redirecting to login...');
      speak('Account registered successfully. Redirecting to login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please check your data and try again.';
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
      setError('Please enter the complete 6-digit verification code.');
      speak('Please enter the complete 6 digit verification code.');
      return;
    }

    setSubmitting(true);
    try {
      await verifyEmail(email, otpCode);
      setSuccess('Your email address has been verified successfully! Redirecting to login...');
      speak('Email verified successfully.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
      setSuccess('A fresh 6-digit verification code has been generated!');
      speak('Verification code resent.');
      setCountdown(60);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to resend verification code. Please try again.';
      setError(errMsg);
      speak(errMsg);
    } finally {
      setResendStatus('');
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
      
      <div className="max-w-lg w-full glassmorphism p-8 rounded-3xl shadow-xl relative border border-white space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white w-fit mx-auto mb-2 shadow-sm">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {isVerifying ? 'Email Verification' : 'Create an Account'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isVerifying 
              ? 'Complete registration by verifying your email address.' 
              : 'Join the precision farming revolution with AI analytics.'}
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

        {/* Multi-step Rendering */}
        {!isVerifying ? (
          /* STEP 1: Registration Form Details */
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
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
                    required
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
                    required
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
        ) : (
          /* STEP 2: Email OTP Code Verification */
          <form onSubmit={handleVerifyCode} className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                We've generated a 6-digit email verification code for:
              </p>
              <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wide">
                {email}
              </p>
            </div>

            {/* OTP Input Grid */}
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



            {/* Submit Verification Action */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full max-w-xs mx-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Verifying...' : 'Verify Code'}</span>
              <CheckCircle size={16} />
            </button>

            {/* Resend actions */}
            <div className="pt-2 text-sm text-slate-500 dark:text-slate-400 space-y-3">
              {countdown > 0 ? (
                <p className="text-xs">
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

              <p className="text-xs pt-2">
                Need to change your email?{' '}
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
                  Edit Registration Details
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Footer Navigation Link */}
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
