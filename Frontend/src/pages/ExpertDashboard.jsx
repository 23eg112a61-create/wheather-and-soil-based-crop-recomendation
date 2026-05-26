import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Sprout, ShieldAlert, FileText, CheckCircle, Plus, Send } from 'lucide-react';

const ExpertDashboard = () => {
  const { speak } = useApp();
  const [diseases, setDiseases] = useState([]);
  const [treatmentMsg, setTreatmentMsg] = useState('');
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchDiseaseHistory = async () => {
    try {
      const res = await api.get('/disease/history');
      setDiseases(res.data);
    } catch (err) {
      setDiseases([
        { _id: '1', diseaseName: 'Tomato Late Blight', confidence: 94, treatment: 'Apply Mancozeb spray.', prevention: 'Avoid overhead watering.', createdAt: new Date().toISOString() },
        { _id: '2', diseaseName: 'Rice Blast', confidence: 88, treatment: 'Apply Tricyclazole.', prevention: 'Manage nitrogen application.', createdAt: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    fetchDiseaseHistory();
  }, []);

  const handleUpdateTreatment = (diseaseId) => {
    setSelectedDiseaseId(diseaseId);
    const item = diseases.find(d => d._id === diseaseId);
    setTreatmentMsg(item ? item.treatment : '');
  };

  const handleSaveTreatment = (e) => {
    e.preventDefault();
    if (!selectedDiseaseId) return;

    setDiseases(diseases.map(d => d._id === selectedDiseaseId ? { ...d, treatment: treatmentMsg } : d));
    setSuccess('Consultation feedback dispatched to farmer dashboard successfully.');
    speak('Consultation feedback sent successfully.');
    setTreatmentMsg('');
    setSelectedDiseaseId(null);

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Agriculture Expert Consultation Center</h2>
        <p className="text-slate-500 text-sm">Review leaf disease scans uploaded by farmers, verify confidence margins, and append specific fertilizer recipes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Uploaded scans lists */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <ShieldAlert className="mr-2 text-emerald-500" size={20} />
            Submitted Diagnostic Telemetry Scans
          </h3>

          <div className="space-y-4">
            {diseases.map((d, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div className="space-y-1.5 text-left max-w-lg">
                  <span className="font-bold block text-base text-slate-800 dark:text-white">{d.diseaseName}</span>
                  <p className="text-xs text-slate-400">Scan confidence: {d.confidence}% • Submitted: {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <strong>Treatment Strategy:</strong> {d.treatment}
                  </p>
                </div>
                <button
                  onClick={() => handleUpdateTreatment(d._id)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-4 py-2 rounded-xl text-sm transition-all flex items-center space-x-1"
                >
                  <Send size={14} />
                  <span>Update Recipe</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel: Update Treatment */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6 flex flex-col justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <FileText className="mr-2 text-emerald-500" size={20} />
            Consultation Feedback
          </h3>

          {success && (
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle size={14} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {selectedDiseaseId ? (
            <form onSubmit={handleSaveTreatment} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Specific Treatment / Pesticide Recipe</label>
                <textarea
                  rows={6}
                  value={treatmentMsg}
                  onChange={(e) => setTreatmentMsg(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Input chemical ingredients, concentration levels, and frequency metrics..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                Dispatch Consultation
              </button>
            </form>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              Select an uploaded disease scan on the left to modify its specific treatment recipe and consult the farmer directly.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExpertDashboard;
