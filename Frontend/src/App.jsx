import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Leaf, Sun, Cpu, Settings, Thermometer, ShieldAlert, LogOut, MessageSquare, Volume2, VolumeX, Moon, SunMedium } from 'lucide-react';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import FarmerDashboard from './pages/FarmerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import SoilAnalysis from './pages/SoilAnalysis';
import WeatherDashboard from './pages/WeatherDashboard';
import CropRecommendation from './pages/CropRecommendation';
import SensorMonitoring from './pages/SensorMonitoring';
import DiseaseDetection from './pages/DiseaseDetection';
import SmartIrrigation from './pages/SmartIrrigation';
import Chatbot from './pages/Chatbot';

// Import New Platform Pages
import SustainableFarming from './pages/SustainableFarming';
import ExpertConsultation from './pages/ExpertConsultation';
import TrainingEducation from './pages/TrainingEducation';
import Marketplace from './pages/Marketplace';
import ResearchHub from './pages/ResearchHub';
import LivestockDairy from './pages/LivestockDairy';
import AnalyticsReports from './pages/AnalyticsReports';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useApp();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

// Protected Role-based Route Wrapper
const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useApp();
  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect unauthorized roles back to landing
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const { user, theme, toggleTheme, language, changeLanguage, voiceActive, toggleVoice, logout, t } = useApp();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 flex flex-col">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-40 w-full glassmorphism px-6 py-4 shadow-sm flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-emerald-600 p-2.5 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300 relative flex items-center justify-center">
              <Leaf size={22} className="relative z-10" />
              <Sun size={12} className="absolute -top-1 -right-1 text-amber-300 animate-pulse z-20" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-amber-500 bg-clip-text text-transparent">
                CropWeather AI
              </span>
              <span className="block text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                Weather-Based Crop Recommendation
              </span>
            </div>
          </Link>

          {/* Right Control Bar */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white/80 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800/40 rounded-lg px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>

            {/* Voice Guide Toggle */}
            <button
              onClick={toggleVoice}
              title="Toggle Voice Guide"
              className={`p-2 rounded-lg transition-colors duration-200 ${
                voiceActive 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {voiceActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Dark Mode Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <SunMedium size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Session Links */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={
                    user.role === 'admin' ? '/dashboard/admin' :
                    user.role === 'expert' ? '/dashboard/expert' :
                    '/dashboard/farmer'
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg dark:hover:bg-red-950/20"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100 font-medium text-sm px-3 py-2"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition-all"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Main Route Frame */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/soil-analysis" element={<ProtectedRoute><SoilAnalysis /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><WeatherDashboard /></ProtectedRoute>} />
            <Route path="/crop-recommendation" element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
            <Route path="/sensors" element={<ProtectedRoute><SensorMonitoring /></ProtectedRoute>} />
            <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
            <Route path="/irrigation" element={<ProtectedRoute><SmartIrrigation /></ProtectedRoute>} />

            {/* New Platform Routes */}
            <Route path="/sustainable-farming" element={<ProtectedRoute><SustainableFarming /></ProtectedRoute>} />
            <Route path="/expert-consultation" element={<ProtectedRoute><ExpertConsultation /></ProtectedRoute>} />
            <Route path="/training-education" element={<ProtectedRoute><TrainingEducation /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/research-hub" element={<ProtectedRoute><ResearchHub /></ProtectedRoute>} />
            <Route path="/livestock-dairy" element={<ProtectedRoute><LivestockDairy /></ProtectedRoute>} />
            <Route path="/analytics-reports" element={<ProtectedRoute><AnalyticsReports /></ProtectedRoute>} />

            {/* Protected Role-specific Dashboards */}
            <Route path="/dashboard/farmer" element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['farmer', 'admin']}><FarmerDashboard /></RoleRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/admin" element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute>
              </ProtectedRoute>
            } />




            <Route path="/dashboard/expert" element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['expert', 'admin']}><ExpertDashboard /></RoleRoute>
              </ProtectedRoute>
            } />

            {/* Redirect any invalid route to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Floating AI Chatbot overlay */}
        {user && <Chatbot />}

        {/* Dynamic Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 px-6 border-t border-slate-800 text-center text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-white font-bold">
              <Leaf className="text-emerald-500" size={18} />
              <span>CropWeather AI System</span>
            </div>
            <p>&copy; 2026 CropWeather Systems Inc. All rights reserved. Developed for weather-based crop recommendation.</p>
            <div className="flex space-x-4">
              <span className="hover:text-emerald-500 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-emerald-500 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
// Verified under crop recommendation tool

