import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AppContext = createContext();

// Regional Multilingual Dictionary
const translations = {
  en: {
    title: "Weather-Based Crop Recommendation System",
    landingTagline: "Weather-Based Crop Recommendation System",
    landingSub: "AI Precision Farming & Smart Soil Intelligence for Sustainable Yields",
    login: "Login",
    signup: "Sign Up",
    logout: "Log Out",
    welcome: "Welcome",
    farmer: "Farmer",
    admin: "Administrator",
    expert: "Agri-Expert",
    weatherAnalyst: "Weather Analyst",
    language: "Language",
    theme: "Theme",
    voice: "Voice Guide",
    dashboard: "Dashboard",
    moisture: "Soil Moisture",
    ph: "Soil pH",
    fertility: "Fertility Status",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    temp: "Temperature",
    humidity: "Humidity",
    rain: "Rainfall",
    currentWeather: "Current Weather",
    forecast: "7-Day Forecast",
    recomCrop: "Recommended Crop",
    confidence: "Confidence Score",
    fertilizer: "Fertilizer suggestion",
    irrigation: "Smart Irrigation",
    disease: "Disease Detection",
    sensors: "IoT Sensor Feeds",
    chatbot: "Smart Agro-AI Assistant"
  },
  es: {
    title: "Recomendación de Cultivos Basada en el Clima",
    landingTagline: "Recomendación de Cultivos Basada en el Clima",
    landingSub: "Agricultura de precisión e inteligencia del suelo para rendimientos sostenibles",
    login: "Iniciar Sesión",
    signup: "Registrarse",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    farmer: "Agricultor",
    admin: "Administrador",
    expert: "Experto Agrícola",
    weatherAnalyst: "Analista del Clima",
    language: "Idioma",
    theme: "Tema",
    voice: "Guía de Voz",
    dashboard: "Tablero",
    moisture: "Humedad del Suelo",
    ph: "pH del Suelo",
    fertility: "Estado de Fertilidad",
    nitrogen: "Nitrógeno (N)",
    phosphorus: "Fósforo (P)",
    potassium: "Potasio (K)",
    temp: "Temperatura",
    humidity: "Humedad",
    rain: "Precipitación",
    currentWeather: "Clima Actual",
    forecast: "Pronóstico de 7 días",
    recomCrop: "Cultivo Recomendado",
    confidence: "Puntuación de Confianza",
    fertilizer: "Sugerencia de Fertilizantes",
    irrigation: "Riego Inteligente",
    disease: "Detección de Enfermedades",
    sensors: "Sensores IoT",
    chatbot: "Asistente Inteligente de IA"
  },
  hi: {
    title: "मौसम आधारित फसल सिफारिश प्रणाली",
    landingTagline: "मौसम आधारित फसल सिफारिश",
    landingSub: "सतत पैदावार के लिए सटीक खेती और स्मार्ट मिट्टी इंटेलिजेंस",
    login: "लॉग इन",
    signup: "साइन अप",
    logout: "लॉग आउट",
    welcome: "स्वागत हे",
    farmer: "किसान",
    admin: "प्रशासक",
    expert: "कृषि विशेषज्ञ",
    weatherAnalyst: "मौसम विश्लेषक",
    language: "भाषा",
    theme: "थीम",
    voice: "आवाज गाइड",
    dashboard: "डैशबोर्ड",
    moisture: "मिट्टी की नमी",
    ph: "मिट्टी पीएच",
    fertility: "उर्वरता स्तर",
    nitrogen: "नाइट्रोजन (N)",
    phosphorus: "फास्फोरस (P)",
    potassium: "पोटेशियम (K)",
    temp: "तापमान",
    humidity: "आर्द्रता",
    rain: "वर्षा",
    currentWeather: "वर्तमान मौसम",
    forecast: "7-दिवसीय पूर्वानुमान",
    recomCrop: "अनुशंसित फसल",
    confidence: "विश्वास स्कोर",
    fertilizer: "उर्वरक सुझाव",
    irrigation: "स्मार्ट सिंचाई",
    disease: "रोग का पता लगाना",
    sensors: "आईओटी सेंसर फीड्स",
    chatbot: "स्मार्ट एआई सहायक"
  },
  te: {
    title: "వాతావరణ ఆధారిత పంట సిఫార్సు విధానం",
    landingTagline: "వాతావరణ ఆధారిత పంట సిఫార్సు",
    landingSub: "సుస్థిర దిగుబడుల కోసం ఖచ్చితమైన వ్యవసాయం మరియు నేల ఇంటెలిజెన్స్ సిఫార్సులు",
    login: "లాగిన్",
    signup: "సైన్ అప్",
    logout: "లాగ్ అవుట్",
    welcome: "స్వాగతం",
    farmer: "రైతు",
    admin: "అడ్మినిస్ట్రేటర్",
    expert: "వ్యవసాయ నిపుణుడు",
    weatherAnalyst: "వాతావరణ విశ్లేషకుడు",
    language: "భాష",
    theme: "థీమ్",
    voice: "వాయిస్ గైడ్",
    dashboard: "డాష్‌బోర్డ్",
    moisture: "నేల తేమ",
    ph: "నేల pH",
    fertility: "సారవంతమైన స్థాయి",
    nitrogen: "నత్రజని (N)",
    phosphorus: "భాస్వరం (P)",
    potassium: "పొటాషియం (K)",
    temp: "ఉష్ణోగ్రత",
    humidity: "తేమ",
    rain: "వర్షపాతం",
    currentWeather: "ప్రస్తుత వాతావరణం",
    forecast: "7-రోజుల సూచన",
    recomCrop: "సిఫార్సు చేయబడిన పంట",
    confidence: "విశ్వాస స్కోరు",
    fertilizer: "ఎరువుల సిఫార్సు",
    irrigation: "స్మార్ట్ నీటి పారుదల",
    disease: "వ్యాధి నిర్ధారణ",
    sensors: "IoT సెన్సార్స్",
    chatbot: "స్మార్ట్ వ్యవసాయ AI సహాయకుడు"
  }
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [voiceActive, setVoiceActive] = useState(localStorage.getItem('voiceActive') === 'true');

  // Verify and fetch profile on boot
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Theme Sync effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Language persist effect
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Voice persist effect
  useEffect(() => {
    localStorage.setItem('voiceActive', voiceActive);
  }, [voiceActive]);

  // Text-To-Speech Speaker Helper
  const speak = (text) => {
    if (!voiceActive) return;
    window.speechSynthesis.cancel(); // Abort active speaking
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1.0;
    
    // Attempt to match regional voice dialect
    if (language === 'hi') msg.lang = 'hi-IN';
    else if (language === 'te') msg.lang = 'te-IN';
    else if (language === 'es') msg.lang = 'es-ES';
    else msg.lang = 'en-US';

    window.speechSynthesis.speak(msg);
  };

  // Translation lookup helper
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    speak(`${t('welcome')} ${response.data.user.name}`);
    return response.data;
  };

  const register = async (name, email, password, role, location, phone) => {
    const response = await api.post('/auth/register', { name, email, password, role, location, phone });
    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    speak("Logged out successfully");
    setUser(null);
    window.location.href = '/';
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    speak(`Theme changed to ${nextTheme}`);
  };

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    const welcomeSpeech = translations[langCode]?.title || 'Language changed';
    // Timeout to let DOM states process
    setTimeout(() => speak(welcomeSpeech), 100);
  };

  const toggleVoice = () => {
    const nextVal = !voiceActive;
    setVoiceActive(nextVal);
    if (nextVal) {
      speak("Voice guide activated successfully.");
    } else {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      theme,
      language,
      voiceActive,
      login,
      register,
      logout,
      toggleTheme,
      changeLanguage,
      toggleVoice,
      speak,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
