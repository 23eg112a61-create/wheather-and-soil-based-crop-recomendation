import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Video, Award, Search, CheckCircle, Calendar, Play, FileText } from 'lucide-react';

const TrainingEducation = () => {
  const { speak } = useApp();
  const [videoFilter, setVideoFilter] = useState('All');
  const [schemeCrop, setSchemeCrop] = useState('Rice');
  const [schemeRegion, setSchemeRegion] = useState('Punjab');
  const [schemeResult, setSchemeResult] = useState(null);

  const videos = [
    { id: 1, title: 'Precision Drip Irrigation Pipe Setup', category: 'Irrigation', duration: '12 mins', views: '4.2k views', ytId: 'a38_2x3XbQA' },
    { id: 2, title: 'Organic FYM Compost Making & Aeration', category: 'Organic', duration: '8 mins', views: '3.1k views', ytId: 'a38_2x3XbQA' },
    { id: 3, title: 'Drone Telemetry Crop Foliar Analysis Guide', category: 'Modern Tech', duration: '15 mins', views: '2.5k views', ytId: 'a38_2x3XbQA' },
    { id: 4, title: 'Foliar Late Blight Sprays & Mancozeb Mixing', category: 'Disease', duration: '10 mins', views: '5.6k views', ytId: 'a38_2x3XbQA' }
  ];

  const webinars = [
    { title: 'Modern Precision Agriculture Tech 2026', date: 'June 05, 2026', time: '14:00 PM', speaker: 'Dr. Ramesh Rao', status: 'Enrolled' },
    { title: 'Subsidies & Rainwater Harvesting Designs', date: 'June 12, 2026', time: '11:00 AM', speaker: 'Dr. Ananya Sen', status: 'Join Seminar' }
  ];

  const filteredVideos = videoFilter === 'All' ? videos : videos.filter(v => v.category === videoFilter);

  // Government Subsidies Schemes DB Heuristics
  const handleFindSchemes = () => {
    speak(`Searching government subsidies for ${schemeCrop} in ${schemeRegion}.`);
    
    // Subsidies Rules heuristic
    if (schemeCrop === 'Rice') {
      setSchemeResult({
        schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) - Paddy Shield',
        subsidyLevel: '80% Premium Subsidy',
        details: `Under Punjab state guidelines, rice farmers receive up to 80% crop insurance premium coverage against drought, blast infestation, and waterlogging. Additionally, 50% subsidy is available for zero-tillage seeders.`,
        process: 'Register via closest Common Service Center (CSC) with Land Record documents.'
      });
      speak("PM Paddy Shield matched with eighty percent premium subsidy.");
    } else if (schemeCrop === 'Wheat') {
      setSchemeResult({
        schemeName: 'Sub-Mission on Agricultural Mechanization (SMAM) - Wheat Special',
        subsidyLevel: '50% Machinery Subsidy',
        details: `Provides 50% matching financial assistance to wheat crop growers in ${schemeRegion} for purchasing modern Happy Seeders, laser land levelers, and automated solar water pumps.`,
        process: 'Submit application online through State Agricultural Mechanization Portal.'
      });
      speak("Wheat Special mechanical subsidy matched.");
    } else {
      setSchemeResult({
        schemeName: 'National Mission on Sustainable Agriculture (NMSA)',
        subsidyLevel: '75% Organic Fertilization Subsidy',
        details: `Promotes organic manure composting in ${schemeRegion}. Eligible farmers receive a direct benefit transfer (DBT) of up to 75% for purchasing Neem Seed Organic Cakes and biological pest control agents.`,
        process: 'Apply directly through district horticulture administrative offices.'
      });
      speak("Sustainable Agriculture mission matched with seventy five percent subsidy.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Agronomy Training Academy</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Farmer Education & Subsidy Portal</h2>
          <p className="text-emerald-100 text-sm font-light">Access certified video masterclasses, enroll in workshops, and search regional agricultural subsidies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Government Scheme Finder */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Award className="mr-2 text-emerald-500" size={20} />
              Government Subsidy & Scheme Matching Engine
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Input crop type and state region to instantly identify matching central and state-level financial subsidies, equipment grants, or crop insurance plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Input Selection */}
            <div className="space-y-3 md:col-span-1 text-xs font-bold text-slate-500">
              <div className="space-y-1">
                <label className="uppercase">Target Crop Type</label>
                <select
                  value={schemeCrop}
                  onChange={(e) => setSchemeCrop(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                >
                  <option value="Rice">Rice (Paddy)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton (Fiber)</option>
                  <option value="Coffee">Coffee (Plantation)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="uppercase">State Region</label>
                <select
                  value={schemeRegion}
                  onChange={(e) => setSchemeRegion(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-2.5 px-3 text-sm focus:outline-none"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Shimla">Himachal Pradesh (Shimla)</option>
                  <option value="AndhraPradesh">Andhra Pradesh / Telangana</option>
                </select>
              </div>

              <button
                onClick={handleFindSchemes}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
              >
                Match Subsidies
              </button>
            </div>

            {/* Scheme Output Card */}
            <div className="md:col-span-2 bg-emerald-50/50 dark:bg-emerald-950/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-4">
              {schemeResult ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">{schemeResult.subsidyLevel}</span>
                    <span className="text-xs text-slate-400 font-semibold flex items-center"><FileText size={12} className="mr-1" /> Active Policy</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{schemeResult.schemeName}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Detailed Benefits:</strong> {schemeResult.details}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed font-bold border-t border-dashed border-emerald-200 dark:border-emerald-800/60 pt-2">
                    <strong>Enrollment Process:</strong> {schemeResult.process}
                  </p>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Fill in crop and state details and click "Match Subsidies" to load active governmental assistance plans.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Webinars Calendar */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Calendar className="mr-2 text-emerald-500" size={20} />
            Upcoming Live Workshops
          </h3>

          <div className="space-y-4 text-xs">
            {webinars.map((w, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-4 rounded-xl border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-white block">{w.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${w.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{w.status}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Speaker: {w.speaker}</span>
                  <span>{w.date} • {w.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Video Masterclasses List */}
      <div className="glassmorphism p-6 rounded-3xl border space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 space-y-3 sm:space-y-0">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Video className="mr-2 text-emerald-500" size={20} />
              Agronomy Video Tutorials
            </h3>
            <p className="text-xs text-slate-500">Learn certified practices and machinery deployments directly from visual guides.</p>
          </div>
          
          <div className="flex bg-slate-100 dark:bg-emerald-950/40 p-1 rounded-xl border text-xs font-bold">
            {['All', 'Irrigation', 'Organic', 'Modern Tech', 'Disease'].map(cat => (
              <button
                key={cat}
                onClick={() => setVideoFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${videoFilter === cat ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredVideos.map(v => (
            <div key={v.id} className="bg-white dark:bg-emerald-950/20 border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              {/* Video thumbnail simulator */}
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center group overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${v.ytId}/0.jpg`} 
                  alt={v.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                />
                <button 
                  onClick={() => speak(`Playing tutorial: ${v.title}`)}
                  className="absolute bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-all"
                >
                  <Play size={20} fill="white" />
                </button>
                <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">{v.duration}</span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">{v.category}</span>
                <span className="font-extrabold text-sm text-slate-800 dark:text-white block line-clamp-2">{v.title}</span>
                <span className="text-[10px] text-slate-400 block">{v.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingEducation;
