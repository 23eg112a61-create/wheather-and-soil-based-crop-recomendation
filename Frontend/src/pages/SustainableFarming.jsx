import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, BookOpen, RotateCw, AlertTriangle, ShieldCheck, CheckSquare, Plus, Trash2 } from 'lucide-react';

const SustainableFarming = () => {
  const { speak, t } = useApp();
  const [currentCrop, setCurrentCrop] = useState('Rice');
  const [manureType, setManureType] = useState('Compost');
  const [manureWeight, setManureWeight] = useState('500'); // kg
  
  // Crop Rotation DB Heuristics
  const rotationDatabase = {
    Rice: {
      nextCrop: 'Legumes (Green Gram / Chickpea)',
      duration: '3 - 4 Months',
      reason: 'Rice is highly nitrogen-demanding. Rotating with legumes restores nitrogen compounds in the soil structure naturally via root nodule nitrogen fixation, breaking disease cycles.',
      waterChange: 'Reduces water requirement by 65% compared to continuous rice sowing.'
    },
    Maize: {
      nextCrop: 'Soybeans / Mustard',
      duration: '4 Months',
      reason: 'Maize exhausts deep soil nutrients. A shallow-rooted oilseed crop or leguminous soybean helps replenish soil texture balance, controls soil erosion, and reduces weed pressure.',
      waterChange: 'Maintains balanced water levels, reducing irrigation needs by 30%.'
    },
    Wheat: {
      nextCrop: 'Pigeon Pea (Tur) / Cluster Beans',
      duration: '4 - 5 Months',
      reason: 'Wheat depletes phosphorus index. Rotating with pigeon pea restores chemical balances, helps aerate deep sandy loam layers via taproot systems, and enhances organic carbon indexes.',
      waterChange: 'Requires 40% less water, allowing rainwater channels to replenish.'
    },
    Cotton: {
      nextCrop: 'Groundnut / Black Gram',
      duration: '3 Months',
      reason: 'Cotton has long seasons and drains deep potassium. Groundnut puts back essential leaf organic matter, controls fungal leaf spots, and ensures balanced ground porosity.',
      waterChange: 'Allows critical dry soil periods to restore soil health.'
    },
    Coffee: {
      nextCrop: 'Cardamom / Black Pepper (Shade-grown)',
      duration: 'Perennial',
      reason: 'Coffee requires rich organic soil beds. Intercropping with shade-loving spice creepers controls erosion on steep hillsides, maximizes humidity indices, and doubles profitability.',
      waterChange: 'Requires no extra water; utilizes existing coffee sprinkler systems.'
    }
  };

  const rotation = rotationDatabase[currentCrop] || rotationDatabase['Rice'];

  // Manure Calculation Heuristics
  const calculateManureRestoration = (type, weight) => {
    const w = parseFloat(weight) || 0;
    if (type === 'Compost') {
      return { n: (w * 0.015).toFixed(1), p: (w * 0.008).toFixed(1), k: (w * 0.012).toFixed(1), organicMatter: (w * 0.45).toFixed(0) };
    } else if (type === 'Poultry Manure') {
      return { n: (w * 0.032).toFixed(1), p: (w * 0.021).toFixed(1), k: (w * 0.018).toFixed(1), organicMatter: (w * 0.35).toFixed(0) };
    } else { // Neem Cake
      return { n: (w * 0.052).toFixed(1), p: (w * 0.011).toFixed(1), k: (w * 0.014).toFixed(1), organicMatter: (w * 0.65).toFixed(0) };
    }
  };

  const nutrients = calculateManureRestoration(manureType, manureWeight);

  const handleSpeakPlanner = () => {
    speak(`For your current crop ${currentCrop}, the recommended rotational crop is ${rotation.nextCrop}. This crop takes ${rotation.duration} and restores the soil because ${rotation.reason}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Sustainable Precision Farming</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Sustainable Agriculture & Soil Conservation</h2>
          <p className="text-emerald-100 text-sm font-light">Implement modern organic processes, design precise crop rotations, and limit chemical reliance.</p>
        </div>
        <button 
          onClick={handleSpeakPlanner}
          className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all flex items-center space-x-2 w-fit"
        >
          <RotateCw size={16} className="animate-spin-slow" />
          <span>Speak Rotation Advice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Crop Rotation Planner */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <RotateCw className="mr-2 text-emerald-500" size={20} />
              Interactive Crop Rotation Planner
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select the crop currently cultivated in your field. Our agricultural heuristic engine will calculate the next optimal crop to prevent nutrient depletion and suppress soil pathogens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Input Selection */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Current Cultivated Crop</label>
              <select
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 px-4 text-sm focus:outline-none"
              >
                <option value="Rice">Rice (Paddy)</option>
                <option value="Maize">Maize (Corn)</option>
                <option value="Wheat">Wheat (Rabi)</option>
                <option value="Cotton">Cotton (Fiber)</option>
                <option value="Coffee">Coffee (Plantation)</option>
              </select>
            </div>

            {/* Rotation Output Card */}
            <div className="md:col-span-2 bg-emerald-50/50 dark:bg-emerald-950/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">Recommended Next Crop</span>
                <span className="text-xs text-slate-400 font-medium">Rotation Period: {rotation.duration}</span>
              </div>
              
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">{rotation.nextCrop}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Scientific Rationale:</strong> {rotation.reason}
              </p>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold border-t border-dashed border-emerald-200 dark:border-emerald-800/60 pt-2 flex items-center">
                <Sprout size={14} className="mr-1.5" />
                {rotation.waterChange}
              </div>
            </div>
          </div>
        </div>

        {/* Organic Manure Volume Calculator */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <BookOpen className="mr-2 text-emerald-500" size={20} />
              Manure Nutrient Estimator
            </h3>
            <p className="text-xs text-slate-500">Estimate organic N-P-K mineral inputs added by organic fertilizers.</p>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase">Manure Category</label>
              <select
                value={manureType}
                onChange={(e) => setManureType(e.target.value)}
                className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
              >
                <option value="Compost">Decomposed Farm Yard Manure (FYM)</option>
                <option value="Poultry Manure">Dry Poultry Droppings</option>
                <option value="Neem Cake">Neem Seed Organic Cake</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase">Quantity (kg)</label>
              <input
                type="number"
                value={manureWeight}
                onChange={(e) => setManureWeight(e.target.value)}
                className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2"
                placeholder="500"
              />
            </div>

            {/* Calculated Output */}
            <div className="bg-white dark:bg-emerald-950/20 p-4 rounded-xl border space-y-3">
              <span className="block text-[10px] text-slate-400 uppercase">Estimated Nutrients Added</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">
                  <span className="block text-[10px] text-emerald-600 font-bold">Nitrogen</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-white">{nutrients.n} kg</span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">
                  <span className="block text-[10px] text-emerald-600 font-bold">Phosphorus</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-white">{nutrients.p} kg</span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">
                  <span className="block text-[10px] text-emerald-600 font-bold">Potassium</span>
                  <span className="text-base font-extrabold text-slate-800 dark:text-white">{nutrients.k} kg</span>
                </div>
              </div>
              <span className="block text-[10px] text-center text-slate-500 font-light mt-1">
                Adds approximately **{nutrients.organicMatter} kg** of organic carbon to improve water-holding capacities.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Sustainable Farming Guidelines / Chemical Reduction Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Guidelines */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-5">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <ShieldCheck className="text-emerald-500 mr-2" size={20} />
            Chemical Pesticide Reduction Protocols
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left">
            <li className="flex items-start">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] mr-2 flex-shrink-0">1</span>
              <span><strong>Biological Pest Controls:</strong> Introduce predatory insects (like Ladybugs for aphids) and biological agents (Trichoderma viride) instead of immediate synthetic chemical spraying.</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] mr-2 flex-shrink-0">2</span>
              <span><strong>Mechanical Weed Removal:</strong> Utilize mechanical weeding tools or high-density plastic mulching sheets to prevent solar contact with weeds rather than using Glyphosphates.</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] mr-2 flex-shrink-0">3</span>
              <span><strong>Neem Oil Emulsions:</strong> Spray neem-oil based mixtures (5ml/L of water with mild soap emulsifier) as a secure organic repellant for whiteflies and leaf miners.</span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] mr-2 flex-shrink-0">4</span>
              <span><strong>Foliar Trap Crops:</strong> Grow trap crops (like marigolds along tomato boundaries) to divert pests away from main cash crops naturally.</span>
            </li>
          </ul>
        </div>

        {/* Eco-Friendly Milestones */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-5 text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <AlertTriangle className="text-amber-500 mr-2" size={20} />
            Conservation Agriculture Education
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Conservation agriculture relies on three core tenets: minimum mechanical soil disturbance (no-till farming), permanent organic soil cover (mulching), and crop species diversification.
          </p>
          <div className="space-y-3">
            <div className="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-2xl border border-amber-200/50 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">Tenet A: Minimum Tillage</span>
              <span className="text-slate-600 dark:text-slate-300 leading-relaxed">Avoiding deep plowing keeps soil microbial ecosystems intact and prevents heavy soil erosion during heavy rainfall.</span>
            </div>
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-200/50 text-xs">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">Tenet B: Mulching Cover</span>
              <span className="text-slate-600 dark:text-slate-300 leading-relaxed">Keeping harvested residues on the fields acts as a natural sun shield, drastically reducing evaporation by up to 50%.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainableFarming;
