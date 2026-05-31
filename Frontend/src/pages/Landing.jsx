import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Sun, Cpu, ShieldCheck, ArrowRight, Activity, CheckCircle, ChevronDown } from 'lucide-react';

const Landing = () => {
  const { user, language, t, speak } = useApp();
  const [ph, setPh] = useState(6.5);
  const [moisture, setMoisture] = useState(50);

  // Quick crop match helper for interactive widget
  const getQuickMatch = (phVal, moistVal) => {
    if (phVal < 5.8) return { name: "Coffee", color: "text-amber-700", desc: "Prefers acidic hilly soils with high moisture." };
    if (moistVal > 70) return { name: "Rice", color: "text-emerald-700", desc: "Requires waterlogged fields and moderate acidity." };
    if (phVal > 7.0) return { name: "Cotton", color: "text-blue-600", desc: "Thrives in black, slightly alkaline, dry-medium soils." };
    if (moistVal < 35) return { name: "Wheat", color: "text-yellow-600", desc: "Prefers cooler temperatures and dry-moderate loam soil." };
    return { name: "Maize (Corn)", color: "text-orange-500", desc: "Highly versatile crop suited for optimal temperate conditions." };
  };

  const matched = getQuickMatch(ph, moisture);

  const handleSpeakWelcome = () => {
    speak(t('landingTagline') + ". " + t('landingSub'));
  };

  return (
    <div className="w-full relative overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. HERO HEADER SECTION - Full Viewport Farming Wallpaper at starting */}
      <section 
        className="relative min-h-[calc(100vh-76px)] px-6 md:px-12 text-white flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/paddy_with_seed.png')" }}
        onMouseEnter={handleSpeakWelcome}
      >
        {/* Sleek, deep glassmorphic gradient overlay for absolute text contrast and premium cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40 z-0"></div>
        
        {/* Left Column Copywriting centered inside container */}
        <div className="relative max-w-4xl z-10 space-y-6 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-[#042f1a]/80 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md">
            <Activity size={12} className="animate-pulse text-emerald-450" />
            <span>Weather-Based Crop Recommendation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white drop-shadow-md">
            {language === 'en' ? (
              <>
                Weather-Based Crop <br />
                Recommendation <br />
                System
              </>
            ) : t('landingTagline')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 font-light leading-relaxed max-w-xl mx-auto drop-shadow">
            {t('landingSub')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            {user ? (
              <>
                <Link
                  to="/crop-recommendation"
                  className="bg-[#10b981] hover:bg-emerald-650 text-slate-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to={
                    user.role === 'admin' ? '/dashboard/admin' :
                    user.role === 'expert' ? '/dashboard/expert' :
                    '/dashboard/farmer'
                  }
                  className="bg-[#0f172a]/30 border border-white/20 hover:bg-[#0f172a]/55 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md transform hover:-translate-y-0.5 backdrop-blur-md w-full sm:w-auto justify-center flex items-center"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-[#10b981] hover:bg-emerald-600 text-slate-900 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                >
                  <span>Get Started Now</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="bg-[#0f172a]/30 border border-white/20 hover:bg-[#0f172a]/55 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-md transform hover:-translate-y-0.5 backdrop-blur-md w-full sm:w-auto justify-center flex items-center"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center text-slate-400 text-xs font-semibold tracking-wider animate-bounce pointer-events-none">
          <span>Scroll to explore features</span>
          <ChevronDown size={18} className="mt-1" />
        </div>
      </section>


      {/* 2. MAIN CORE FEATURES MATRIX */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            Smart Ecosystem Capabilities
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Our platform integrates hardware telemetry, dynamic cloud weather metrics, and deep heuristic classifiers to automate crop management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Soil Analysis with probe image */}
          <Link to="/soil-analysis" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50 dark:border-emerald-800/25">
            <div className="h-44 w-full overflow-hidden relative">
              <img src="/soil_probe.png" alt="Soil Health laboratory" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">Soil telemetries</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Soil Health Analysis
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Log, track, and graph chemical soil parameters in real-time. View Nitrogen, Phosphorus, Potassium (NPK), and pH levels instantly to evaluate nutrient indices.
              </p>
            </div>
          </Link>

          {/* Card 2: Weather Forecast */}
          <Link to="/weather" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50 dark:border-emerald-800/25">
            <div className="h-44 w-full overflow-hidden relative">
              <img src="/weather_forecast.png" alt="Meteorological Climate Radar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">Weather Intelligence</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Meteorological Climate Radar
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Review localized weather radars, 7-day temperature trends, wind velocities, and UV intensity gauges to preempt environmental threats.
              </p>
            </div>
          </Link>

          {/* Card 3: Crop Recommendation */}
          <Link to="/crop-recommendation" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50 dark:border-emerald-800/25">
            <div className="h-44 w-full overflow-hidden relative">
              <img src="/crop_matcher.png" alt="Crop Suitability Matcher" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">Suitability matcher</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Crop Suitability Matcher
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Evaluate optimal crop suitability options against soil parameters, acidity pH levels, and rainfall cycles to safeguard harvest values.
              </p>
            </div>
          </Link>

          {/* Card 4: Disease Detection */}
          <Link to="/disease-detection" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50 dark:border-emerald-800/25">
            <div className="h-44 w-full overflow-hidden relative">
              <img src="/disease_scan.png" alt="Disease scanning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">Computer Vision</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Foliar Disease Diagnostic Scanner
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Upload leaf photographs to identify crop infections. Returns plant disease matching, suggested pesticide formulas, and organic solutions.
              </p>
            </div>
          </Link>

          {/* Card 5: Smart Irrigation */}
          <Link to="/irrigation" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50 dark:border-emerald-800/25">
            <div className="h-44 w-full overflow-hidden relative">
              <img src="/smart_irrigation.png" alt="Automated Irrigation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">Irrigation Valve</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Automated Irrigation Pump Valve
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Monitor soil hydration percentages, calculate volumetric target flows, and simulate dynamic pump solenoid relay toggles.
              </p>
            </div>
          </Link>

          {/* Card 6: IoT Node Inventory */}
          <Link to="/sensors" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50 dark:border-emerald-800/25">
            <div className="h-44 w-full overflow-hidden relative">
              <img src="/iot_nodes.png" alt="Distributed Telemetry Nodes" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <span className="absolute bottom-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">IoT Telemetries</span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Distributed Telemetry Nodes
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Oversee hardware wireless inventory nodes (ESP32 microcontrollers). Review battery status, active telemetry frequencies, and link diagnostics.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. DYNAMIC PRECISION FARMING DEMONSTRATION SHOWCASE */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/30 dark:border-slate-800/40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase w-fit">
              Video Demonstration
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Precision Farming In Action
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
              Discover how next-generation drone mapping, satellite crop tracking, and wireless ground telemetry sensor arrays collaborate to secure agricultural resource utilization, optimize fertilization inputs, and dramatically improve crop harvest volumes.
            </p>
          </div>
          
          {/* Video Player */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200/50 dark:border-slate-800/20 relative">
            <video 
              className="w-full h-full object-cover" 
              controls 
              poster="/smart_farm_hero.png"
              preload="metadata"
            >
              <source 
                src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-farmer-holding-soil-with-a-sprout-43095-large.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SOIL SIMULATION WIDGET */}
      <section className="py-20 px-6 bg-emerald-50 dark:bg-emerald-950/20 w-full border-y border-slate-200 dark:border-emerald-900/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase w-fit">
              Interactive Simulator
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
              Simulate Crop Suitability Instantly
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag the sliders below to simulate different soil pH levels and moisture levels. Our responsive heuristics engine recalculates suitable crops in real-time, showing the strength of precision analytics.
            </p>

            {/* Sliders Container */}
            <div className="space-y-6 pt-4">
              {/* Slider 1: Soil pH */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Soil pH Rating:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{ph} pH (Highly Acidic - Alkaline)</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="8.5"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Slider 2: Soil Moisture */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Soil Moisture Level:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{moisture}% Water Retention</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Heuristic Live Visualizing Card */}
          <div className="glassmorphism p-8 rounded-3xl flex flex-col justify-between space-y-6 text-left shadow-lg border border-white dark:border-emerald-800/10">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-800/40 pb-4">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">AI Classifier Matching Output</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-xs font-semibold">Live Preview</span>
            </div>

            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Leaf className="text-emerald-500" size={24} />
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Perfect Suitable Crop:</span>
              </div>
              <h3 className={`text-3xl font-extrabold tracking-tight ${matched.color}`}>
                {matched.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {matched.desc}
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-emerald-800/40 pt-4 flex flex-col space-y-3">
              <div className="flex justify-between text-xs font-medium text-slate-500">
                <span>Suitability Index:</span>
                <span className="font-bold text-emerald-600">High (94%)</span>
              </div>
              <Link 
                to="/signup" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-2.5 rounded-xl text-sm transition-all shadow-inner"
              >
                Log in to generate full diagnostics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST / TELEMETRY CYCLE SUMMARY */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            End-To-End Precision Farming Cycle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            Distributed ESP32 microcontrollers measure raw nitrogen, phosphorus, potassium, pH levels, and soil moisture directly from field nodes. These values are securely uploaded through encrypted protocols to Mongoose cloud databases. The heuristic engines process weather trends alongside chemical compositions to recommend crops, fertilizers, and irrigation parameters.
          </p>
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3 bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-900/30 shadow-sm">
              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">IoT Telemetry</h4>
                <p className="text-slate-500 text-xs mt-1">Live physical reads avoid human data entry errors.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-900/30 shadow-sm">
              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Weather Integrations</h4>
                <p className="text-slate-500 text-xs mt-1">Dynamic warnings avoid drought and flood exposure.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-900/30 shadow-sm">
              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Yield Security</h4>
                <p className="text-slate-500 text-xs mt-1">Disease detection matches pesticides instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
