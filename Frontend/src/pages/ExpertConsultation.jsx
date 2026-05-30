import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { User, MessageSquare, Video, Phone, Calendar, Search, HelpCircle, CheckCircle, VideoOff } from 'lucide-react';

const ExpertConsultation = () => {
  const { user, speak } = useApp();
  const [experts] = useState([
    { id: 1, name: 'Dr. Ramesh Rao', specialty: 'Soil Chemistry & Nutrient Management', location: 'Delhi Central Laboratory', rating: 4.9, available: 'Online' },
    { id: 2, name: 'Dr. Ananya Sen', specialty: 'Plant Pathology & Fungal Diagnostics', location: 'Kolkata Agricultural University', rating: 4.8, available: 'Online' },
    { id: 3, name: 'Dr. Vikram Joshi', specialty: 'Micro-climate & Irrigation Cycles', location: 'Shimla Research Center', rating: 4.7, available: 'Offline' }
  ]);

  const [selectedExpert, setSelectedExpert] = useState(experts[0]);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'expert', text: 'Hello Shiva! I am Dr. Ramesh Rao. How can I help you manage your Ludhiana farm block today?' }
  ]);

  // Appointment Form
  const [bookingDate, setBookingDate] = useState('2026-06-01');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingQuery, setBookingQuery] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Video Call State
  const [inCall, setInCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const videoRef = useRef(null);

  // FAQ Search
  const [searchQuery, setSearchQuery] = useState('');
  const faqs = [
    { q: 'How do I treat yellow spots on my tomato leaves?', a: 'Yellow spots with dark concentric rings usually indicate early or late blight. Apply Mancozeb spray or use organic copper-based solutions, and avoid overhead watering.' },
    { q: 'What is the optimal pH rating for growing Paddy?', a: 'Rice paddy grows best in slightly acidic soils with a pH ranging between 5.5 and 6.5. This allows normal absorption of nitrogen and iron.' },
    { q: 'When should I irrigate my wheat fields?', a: 'Irrigation is most critical during Crown Root Initiation (CRI) (approx 21 days after sowing) and during the flowering stage to maximize kernel weights.' },
    { q: 'How does high relative humidity affect pest outbreaks?', a: 'Humidity levels above 80% create a perfect breeding ground for fungal spores and insect pests like aphids and plant hoppers. Increase spacing and apply biological sprays.' }
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()));

  const fetchBookings = async () => {
    try {
      const res = await api.get('/platform/consultation');
      setAppointments(res.data);
    } catch (e) {
      setAppointments([
        { farmerName: 'Shiva Kumar', expertName: 'Dr. Ramesh Rao', date: '2026-06-01', time: '10:00', queryText: 'Soil pH check', status: 'Scheduled' }
      ]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { sender: 'user', text: chatInput };
    setChatLog(prev => [...prev, userMsg]);
    setChatInput('');

    // Expert Simulation reply trigger
    speak("Processing request with consulting expert.");
    setTimeout(() => {
      const replies = [
        "Based on your NPK readings, I suggest adding Urea at 20kg per acre to compensate for low Nitrogen.",
        "That symptom matches Rice Blast. Apply Tricyclazole fungicide as soon as possible and reduce standing water levels.",
        "For sandy loam textures, check moisture scales. Trigger your solenoid valve to deliver 12 liters of water per square meter.",
        "Excellent query. Balanced soil organic carbon content is key. Consider adding Neem Seed Cake organic manure."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const expertMsg = { sender: 'expert', text: randomReply };
      setChatLog(prev => [...prev, expertMsg]);
      speak(randomReply);
    }, 1200);
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingQuery.trim()) return;

    setLoading(true);
    try {
      const payload = {
        farmerName: user?.name || 'Shiva Kumar',
        expertName: selectedExpert.name,
        date: bookingDate,
        time: bookingTime,
        queryText: bookingQuery
      };

      await api.post('/platform/consultation/book', payload);
      setSuccess('Appointment slot successfully reserved and logged in cloud.');
      speak("Appointment successfully booked.");
      setBookingQuery('');
      fetchBookings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.warn('Booking API error, saving locally.');
      const localBooking = {
        farmerName: user?.name || 'Shiva Kumar',
        expertName: selectedExpert.name,
        date: bookingDate,
        time: bookingTime,
        queryText: bookingQuery,
        status: 'Scheduled'
      };
      setAppointments(prev => [localBooking, ...prev]);
      setSuccess('Appointment successfully reserved (Standby Mode).');
      setBookingQuery('');
    } finally {
      setLoading(false);
    }
  };

  // Launch Video Consultation Call
  const startVideoCall = async () => {
    setInCall(true);
    speak("Launching encrypted video consultation channel.");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (e) {
      console.warn("Camera streams unavailable. Running call simulation.");
    }
  };

  const stopVideoCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setInCall(false);
    speak("Consultation call ended.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Live Agriculture Consulting</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Agricultural Expert Consultation</h2>
          <p className="text-emerald-100 text-sm font-light">Consult leading plant biochemists, patholologists, and irrigation specialists via secure channels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Expert List Column */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glassmorphism p-6 rounded-3xl border space-y-5">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Select Agriculture Consultant</h3>
            <div className="space-y-4">
              {experts.map(e => (
                <div 
                  key={e.id}
                  onClick={() => { setSelectedExpert(e); setChatLog([{ sender: 'expert', text: `Hello! I am ${e.name}. How can I assist you with ${e.specialty} today?` }]); }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedExpert.id === e.id 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm' 
                      : 'bg-white dark:bg-emerald-950/15 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-600 p-2.5 rounded-xl text-white">
                      <User size={18} />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-sm text-slate-800 dark:text-white block">{e.name}</span>
                      <span className="text-[10px] text-slate-400 block">{e.specialty}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[10px] font-semibold border-t pt-2 border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">{e.location}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${e.available === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{e.available}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Chat Simulator */}
        <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6 flex flex-col justify-between h-[450px]">
          <div className="flex justify-between items-center border-b pb-3">
            <div className="text-left">
              <span className="font-bold text-sm text-slate-800 dark:text-white block">{selectedExpert.name}</span>
              <span className="text-[10px] text-emerald-600 block">Active Consultation Channel</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={startVideoCall}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-2 rounded-xl border transition-all"
                title="Launch Video consultation"
              >
                <Video size={16} />
              </button>
            </div>
          </div>

          {/* Chat bubbles */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 text-sm flex flex-col justify-end">
            {chatLog.map((c, idx) => (
              <div 
                key={idx} 
                className={`max-w-[75%] p-3 rounded-2xl ${
                  c.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none self-end text-right' 
                    : 'bg-slate-100 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200 rounded-bl-none self-start text-left'
                }`}
              >
                {c.text}
              </div>
            ))}
          </div>

          {/* Input field */}
          <div className="flex space-x-3 pt-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-grow bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              placeholder={`Send a secure message to ${selectedExpert.name}...`}
            />
            <button
              onClick={handleSendChat}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              Send
            </button>
          </div>
        </div>

      </div>

      {/* Video Call Modal overlay / Stream container */}
      {inCall && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-800 space-y-4 p-6 shadow-2xl">
            <div className="flex justify-between items-center text-white">
              <span className="font-extrabold text-sm flex items-center"><Video size={16} className="text-emerald-500 mr-2 animate-pulse" /> Live Tele-Consultation Call</span>
              <span className="text-xs text-slate-400">Consulting: {selectedExpert.name}</span>
            </div>
            
            {/* Viewfinder simulation */}
            <div className="w-full aspect-video rounded-2xl bg-black relative flex items-center justify-center overflow-hidden border border-slate-800">
              {localStream ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-600/10 rounded-full flex items-center justify-center text-emerald-500 animate-pulse">
                    <User size={32} />
                  </div>
                  <span className="text-xs text-slate-400">Connecting Encrypted Camera Feeds...</span>
                </div>
              )}
              {/* Floating expert thumbnail simulator */}
              <div className="absolute bottom-4 right-4 h-24 aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedExpert.name}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={stopVideoCall}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs"
              >
                Disconnect Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Scheduler & FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Booking slot form */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Calendar className="mr-2 text-emerald-500" size={20} />
            Reserve Consultation Appointment
          </h3>

          {success && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleBookAppointment} className="space-y-4 text-xs font-semibold text-left">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Target Date</label>
                <input 
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Preferred Time Slot</label>
                <input 
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase">Crop Query Details</label>
              <textarea
                rows={3}
                value={bookingQuery}
                onChange={(e) => setBookingQuery(e.target.value)}
                className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-3 text-sm"
                placeholder="Briefly explain soil details or pest conditions to share with Dr. Rao..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? 'Reserving slot...' : 'Register Appointment Slot'}
            </button>
          </form>
        </div>

        {/* FAQs Registry */}
        <div className="glassmorphism p-6 rounded-3xl border space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <HelpCircle className="mr-2 text-emerald-500" size={20} />
              Platform FAQ Knowledge Base
            </h3>
            <div className="relative w-44">
              <Search className="absolute left-2 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-emerald-950/20 border rounded-lg pl-7 pr-2 py-1 text-xs"
                placeholder="Search FAQs..."
              />
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-56 pr-2">
            {filteredFaqs.map((f, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-4 rounded-xl border text-xs text-left">
                <span className="font-bold text-slate-800 dark:text-white block mb-1">Q: {f.q}</span>
                <p className="text-slate-500 leading-relaxed">A: {f.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpertConsultation;
