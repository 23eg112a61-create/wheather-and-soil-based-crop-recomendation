import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Leaf, Sun, Cpu, Settings, Thermometer, ShieldAlert, CheckCircle, ArrowRight, Activity, MapPin } from 'lucide-react';

const Landing = () => {
  const { user, t, speak } = useApp();
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
    <div className="w-full relative overflow-hidden flex flex-col">
      {/* Hero Header Section - Full Background Paddy Field Image with Premium Dark Glassmorphic Overlay */}
      <section 
        className="relative py-24 md:py-32 px-6 md:px-12 text-white text-left flex flex-col lg:flex-row items-center justify-between gap-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/paddy_with_seed.png')" }}
        onMouseEnter={handleSpeakWelcome}
      >
        {/* Sleek, deep gradient overlay to ensure absolute text contrast and premium cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-emerald-950/40 z-0"></div>
        
        {/* Left Column Copywriting */}
        <div className="relative max-w-2xl z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Activity size={12} className="animate-pulse" />
            <span>Weather-Based Crop Recommendation Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
            {t('landingTagline')}
          </h1>
          <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed max-w-xl">
            {t('landingSub')}
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            {user ? (
              <Link
                to="/crop-recommendation"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <span>Generate AI Recommendation</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Colorful farming telemetry preview tablet widget */}
        <div className="relative z-10 w-full lg:w-[460px] h-[320px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/30 flex-shrink-0 group">
          <img 
            src="/farmer_tablet.png" 
            alt="CropWeather precision agriculture intelligence tablet" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent pointer-events-none"></div>
          {/* Live Telemetry Pill floating on top */}
          <div className="absolute bottom-4 left-4 bg-emerald-950/80 backdrop-blur border border-emerald-500/40 p-3 rounded-2xl flex items-center space-x-3 text-left">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">NPK SENSOR SCAN</span>
              <span className="block text-xs font-bold text-white">Grid Zone #14 Calibrated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Core Features Matrix - Refactored to be extremely clear and visual */}
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
          {/* Card 1: Soil Analysis with embedded probe image */}
          <Link to="/soil-analysis" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50">
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
          <Link to="/weather" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50">
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
          <Link to="/crop-recommendation" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50">
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
                Evaluate optimal crop strategies against soil NPK, acidity pH levels, and rainfall scales to maximize production yields.
              </p>
            </div>
          </Link>

          {/* Card 4: Disease Detection with embedded scan image */}
          <Link to="/disease-detection" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50">
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
                Upload leaf photographs to identify crop infections. Returns exact plant disease matching, suggested pesticides, and preventative recipes.
              </p>
            </div>
          </Link>

          {/* Card 5: Smart Irrigation */}
          <Link to="/irrigation" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50">
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
                Monitor soil hydration percentages, calculate target volumetric flow rates, and trigger simulated solenoid valve pump relays.
              </p>
            </div>
          </Link>

          {/* Card 6: IoT Node Inventory */}
          <Link to="/sensors" className="glassmorphism rounded-3xl card-transition text-left block overflow-hidden border border-slate-200/50">
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
                Oversee your hardware node network (ESP32 microcontrollers). Audit wireless signals, battery levels, and active status feeds.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Dynamic Precision Farming Video Demonstration Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/30">
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
          
          {/* Responsive HTML5 video player framework */}
          <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200/50 relative">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/a38_2x3XbQA" 
              title="Smart Precision Farming Overview" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Interactive Soil Simulation Widget */}
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

          {/* Visualization Card */}
          <div className="glassmorphism p-8 rounded-3xl flex flex-col justify-between space-y-6 text-left shadow-lg border border-white">
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
                to="/crop-recommendation" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                Log in to generate full diagnostics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / About Agriculture System Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            End-To-End Precision Farming Cycle
          </h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
            Distributed ESP32 microcontrollers measure raw nitrogen, phosphorus, potassium, pH levels, and soil moisture directly from field nodes. These values are securely uploaded through encrypted protocols to Mongoose cloud databases. The heuristic engines process weather trends alongside chemical compositions to recommend crops, fertilizers, and irrigation parameters.
          </p>
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3 bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-900/30">
              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">IoT Telemetry</h4>
                <p className="text-slate-500 text-xs mt-1">Live physical reads avoid human data entry errors.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-900/30">
              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Weather Integrations</h4>
                <p className="text-slate-500 text-xs mt-1">Dynamic warnings avoid drought and flood exposure.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border border-slate-100 dark:border-emerald-900/30">
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
