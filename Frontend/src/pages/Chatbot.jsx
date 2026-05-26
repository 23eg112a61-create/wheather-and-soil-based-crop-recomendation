import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Send, Leaf, Sparkles, Volume2 } from 'lucide-react';

const Chatbot = () => {
  const { speak, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Smart Farming Assistant. Ask me anything about soil health, NPK balances, weather forecasts, or disease diagnosis.' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    // AI logic response simulation
    setTimeout(() => {
      let reply = 'That is an excellent farming question. I recommend auditing your NPK sensor balances or running the Leaf Disease scan to diagnose crop health profiles.';
      
      const query = userMsg.toLowerCase();
      if (query.includes('nitrogen') || query.includes('urea') || query.includes('fertilizer')) {
        reply = 'Low Nitrogen (N) is commonly fixed by applying Urea, Ammonium Nitrate, or organic green manure. Ensure application matches recommendation guidelines.';
      } else if (query.includes('crop') || query.includes('grow') || query.includes('plant')) {
        reply = 'Based on Punjab regions, Rice thrives during Kharif (Monsoon) seasons with soil pH 6.0-6.7, while Wheat prefers cool Rabi seasons.';
      } else if (query.includes('blight') || query.includes('fungus') || query.includes('pesticide')) {
        reply = 'Potato/Tomato Late Blight is a fungal threat. Prune infected leaves and apply Mancozeb or Copper Hydroxide fungicide sprays immediately.';
      } else if (query.includes('irrigation') || query.includes('water') || query.includes('pump')) {
        reply = 'Our Smart Irrigation module monitors moisture levels in real-time. If levels drop below 40%, the solenoid pump motor is triggered.';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      speak(reply); // Automatically vocalize response!
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[450px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-800/40 flex flex-col overflow-hidden mb-4 card-transition text-left">
          
          {/* Header */}
          <div className="agro-gradient-emerald text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5">
              <div className="bg-white/20 p-2 rounded-xl text-white">
                <Leaf size={18} />
              </div>
              <div>
                <span className="font-extrabold text-sm block">CropWeather AI</span>
                <span className="text-[9px] uppercase font-bold text-emerald-100 flex items-center">
                  <Sparkles size={8} className="mr-1 animate-pulse" /> Online Assistant
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Conversations Frame */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-slate-950/40 no-scrollbar">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-emerald-950/20 text-slate-700 dark:text-slate-200 rounded-bl-none border'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Message input controls */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask CropWeather AI..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-slate-100 dark:bg-emerald-950/20 border-0 rounded-xl py-2.5 px-4 text-xs focus:outline-none dark:text-white"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="agro-gradient-emerald text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-emerald-400/20"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

    </div>
  );
};

export default Chatbot;
