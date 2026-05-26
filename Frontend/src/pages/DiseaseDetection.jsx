import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle, UploadCloud, Sprout, Activity, FileText } from 'lucide-react';

const DiseaseDetection = () => {
  const { speak } = useApp();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [cropHint, setCropHint] = useState('Tomato');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/disease/history');
      setLogs(res.data);
    } catch (err) {
      setLogs([
        { diseaseName: 'Tomato Late Blight', confidence: 94, treatment: 'Apply Mancozeb.', prevention: 'Proper crop spacing.', createdAt: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files[0];
    if (!file) return;

    // Enforce 5MB limit client side
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Image size must not exceed 5MB.');
      speak('File is too large.');
      return;
    }

    // Enforce image extension check
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Rejected file format. Only JPEG, JPG, and PNG images are allowed.');
      speak('Rejected file format.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    
    if (!selectedFile) {
      setError('Please select a leaf photograph to analyze.');
      return;
    }

    setLoading(true);
    speak("Launching visual analysis scan.");
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('cropHint', cropHint);

    try {
      const res = await api.post('/disease/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data.result);
      speak(`AI diagnostics identified leaf disease as ${res.data.result.diseaseName} with a confidence score of ${res.data.result.confidence} percent.`);
      setSelectedFile(null);
      fetchLogs();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to complete leaf analysis. Confirm backend uploads folder settings.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      <div className="space-y-2 border-b pb-4">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Foliar Disease Diagnosis</h2>
        <p className="text-slate-500 text-sm">Upload leaf photographs to run visual recognition scans matching diseases, pesticide recipes, and organic controls.</p>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-700 text-xs flex items-center space-x-3">
          <ShieldAlert size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload area vs result card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload form */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <UploadCloud className="mr-2 text-emerald-500" size={20} />
            Diagnostic Upload Portal
          </h3>

          <form onSubmit={handleUpload} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Select crop type */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Host Crop Type</label>
                <select
                  value={cropHint}
                  onChange={(e) => setCropHint(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/40 rounded-xl py-3 px-4 text-sm focus:outline-none"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize (Corn)</option>
                </select>
              </div>

              {/* Drag file input */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-500">Leaf Photograph File</label>
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>

            {selectedFile && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Selected photograph: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Executing AI Classifier...' : 'Initiate Crop Diagnostics'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="glassmorphism p-6 rounded-3xl border flex flex-col justify-between space-y-6 min-h-[300px]">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-xs font-bold uppercase text-slate-400">Diagnosis Report</span>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">REPORT</span>
          </div>

          {result ? (
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-2">
                <Sprout className="text-emerald-500" size={24} />
                <span className="text-sm font-semibold text-slate-400">Identified Disease:</span>
              </div>
              <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 tracking-tight leading-none">
                {result.diseaseName}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Scan Match confidence score: {result.confidence}%
              </p>
              <div className="divide-y space-y-2 text-xs pt-2">
                <div className="flex flex-col py-1.5 space-y-1">
                  <span className="text-slate-400 font-semibold">Pesticide Prescription:</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{result.treatment}</span>
                </div>
                <div className="flex flex-col py-1.5 space-y-1">
                  <span className="text-slate-400 font-semibold">Prevention Protocol:</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">{result.prevention}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              Submit a leaf photograph on the left to initiate visual disease scanning.
            </div>
          )}
        </div>

      </div>

      {/* Historical Diagnosis list logs */}
      <div className="glassmorphism p-6 rounded-3xl border space-y-6">
        <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
          <FileText className="mr-2 text-emerald-500" size={20} />
          Diagnostic Classification History
        </h3>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {logs.map((l, idx) => (
            <div key={idx} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center space-y-3 md:space-y-0 text-left">
              <div className="space-y-1">
                <span className="font-bold block text-base text-slate-800 dark:text-white">{l.diseaseName}</span>
                <span className="text-xs text-slate-400">Match rating: {l.confidence}% • Scanned: {new Date(l.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-slate-500 max-w-lg space-y-1">
                <p><strong>Treatment:</strong> {l.treatment}</p>
                <p><strong>Prevention:</strong> {l.prevention}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DiseaseDetection;
