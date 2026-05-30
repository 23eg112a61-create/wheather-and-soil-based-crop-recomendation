import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { 
  Users, Radio, ShieldAlert, Cpu, CheckCircle, Ban, 
  Activity, Send, Sparkles, Database, Server, 
  Search, PlusCircle, Bell, Eye, Edit, Sprout, X, FileText, Trash2,
  MapPin, Cloud, HelpCircle, AlertTriangle, Calendar, FileDown,
  Printer, ShieldCheck, TrendingUp, BarChart2, PieChart as PieIcon, Map, Info, UserCheck, MessageCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const { speak } = useApp();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Core Data States with high-fidelity fallback seed structures
  const [users, setUsers] = useState([
    { _id: '1', id: '1', name: 'Shiva Kumar', email: 'shiva@smartfarm.com', role: 'farmer', location: 'Gill Village sector, Ludhiana', landArea: '12 Hectares', status: 'Active', phone: '+91 98765 43210', lastLogin: '2026-05-30 15:30' },
    { _id: '2', id: '2', name: 'Dr. Ramesh Rao', email: 'ramesh@agro.gov', role: 'expert', location: 'Delhi Center', landArea: 'N/A', status: 'Active', phone: '+91 91234 56789', lastLogin: '2026-05-30 14:15' },
    { _id: '3', id: '3', name: 'Ananya Sen', email: 'ananya@soil-labs.org', role: 'expert', location: 'Kolkata Lab', landArea: 'N/A', status: 'Active', phone: '+91 98123 45678', lastLogin: '2026-05-30 09:45' },
    { _id: '4', id: '4', name: 'Vikram Joshi', email: 'vikram@weather.net', role: 'expert', location: 'Shimla Lab', landArea: 'N/A', status: 'Inactive', phone: '+91 97654 32109', lastLogin: '2026-05-28 11:20' }
  ]);

  const [consultations, setConsultations] = useState([
    { _id: '1', id: '1', farmerName: 'Shiva Kumar', expertName: 'Dr. Ramesh Rao', queryText: 'Blast Disease Spots on leaves appearing on Ludhiana Rice block.', date: '2026-06-01', time: '10:00', status: 'Scheduled' },
    { _id: '2', id: '2', farmerName: 'Gurdev Singh', expertName: 'Dr. Ananya Sen', queryText: 'NPK Phosphorus deficiency. Soil pH stands at 5.5.', date: '2026-05-29', time: '14:30', status: 'Completed' }
  ]);

  // Modal Interactive States
  const [selectedUserForInfo, setSelectedUserForInfo] = useState(null);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [modalTab, setModalTab] = useState('profile'); // 'profile' | 'activities' | 'history'

  const [userToEdit, setUserToEdit] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [cropOverrideUser, setCropOverrideUser] = useState(null);
  const [editConsultation, setEditConsultation] = useState(null);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'farmer', location: '', phone: '', landArea: '', status: 'Active' });
  const [newCropText, setNewCropText] = useState('');
  const [editedQueryText, setEditedQueryText] = useState('');
  const [editedQueryStatus, setEditedQueryStatus] = useState('Scheduled');

  // ==========================================
  // FARMER ACTIVITY INTELLIGENCE CENTER STATES
  // ==========================================
  const [selectedFarmerForIntel, setSelectedFarmerForIntel] = useState(null);
  const [intelData, setIntelData] = useState(null);
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [intelDateFilter, setIntelDateFilter] = useState('All'); // 'All' | 'Today' | '7Days' | '30Days' | 'Custom'
  const [intelSearchQuery, setIntelSearchQuery] = useState('');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Bulletproof Date Formatter to completely avoid RangeError: toISOString() on invalid dates
  const safeFormatDate = (dateVal) => {
    if (!dateVal) return 'N/A';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toISOString().replace('T', ' ').substring(0, 16);
    } catch (e) {
      return String(dateVal);
    }
  };

  // Load Real Data from Mongoose Database
  const fetchDatabaseData = async () => {
    try {
      const usersRes = await api.get('/admin/users');
      if (usersRes.data && usersRes.data.length > 0) {
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.warn("Using local high-fidelity fallback users data (offline or development fallback mode)");
    }

    try {
      const platformConsultationsRes = await api.get('/platform/consultation');
      if (platformConsultationsRes.data && platformConsultationsRes.data.length > 0) {
        setConsultations(platformConsultationsRes.data);
      }
    } catch (err) {
      console.warn("Using local high-fidelity fallback consultations data");
    }
  };

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  // Fetch simple history logs dynamically (modal)
  useEffect(() => {
    if (selectedUserForInfo) {
      setLoadingHistory(true);
      setSelectedUserHistory([]);
      const targetId = selectedUserForInfo._id || selectedUserForInfo.id;
      api.get(`/admin/users/${targetId}/history`)
        .then((res) => {
          setSelectedUserHistory(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to retrieve user history", err);
          setSelectedUserHistory([]);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    }
  }, [selectedUserForInfo]);

  // Fetch complete Farmer Activity Intelligence profile dynamically
  const fetchFarmerIntelligence = (farmer) => {
    setSelectedFarmerForIntel(farmer);
    setIntelData(null);
    setLoadingIntel(true);
    setIntelDateFilter('All');
    setIntelSearchQuery('');
    setCustomStartDate('');
    setCustomEndDate('');

    const targetId = farmer._id || farmer.id;
    api.get(`/admin/users/${targetId}/intelligence`)
      .then((res) => {
        setIntelData(res.data);
        speak(`Loaded full activity intelligence profile for ${farmer.name}.`);
      })
      .catch((err) => {
        console.error("Failed to fetch full activity intelligence profile from server", err);
        setErrorMsg("Connection failure. Failed to sync deep analytics database.");
        setTimeout(() => setErrorMsg(''), 4000);
      })
      .finally(() => {
        setLoadingIntel(false);
      });
  };

  // Suspend/Activate farmer account from intelligence panel
  const handleToggleSuspend = async (farmerId) => {
    try {
      const res = await api.put(`/admin/users/${farmerId}/suspend`);
      const updatedStatus = res.data.status;
      
      // Update local state arrays
      setUsers(users.map(u => (u._id || u.id) === farmerId ? { ...u, status: updatedStatus } : u));
      if (intelData && (intelData.user?._id || intelData.user?.id) === farmerId) {
        setIntelData({
          ...intelData,
          user: { ...intelData.user, status: updatedStatus },
          activityLogs: [
            { action: updatedStatus === 'Inactive' ? 'Account Suspended By Admin' : 'Account Re-Activated By Admin', module: 'Administration', status: 'Success', ipAddress: '192.168.1.102', createdAt: new Date() },
            ...(intelData.activityLogs || [])
          ]
        });
      }

      setSuccessMsg(`Account status changed successfully to ${updatedStatus}!`);
      speak(`Account status updated to ${updatedStatus}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Failed to toggle suspension status on live database.", err);
      // Simulate locally
      const farmer = users.find(u => (u._id || u.id) === farmerId);
      if (farmer) {
        const nextStatus = farmer.status === 'Active' ? 'Inactive' : 'Active';
        setUsers(users.map(u => (u._id || u.id) === farmerId ? { ...u, status: nextStatus } : u));
        setSuccessMsg(`Account status (Simulation Mode) changed successfully to ${nextStatus}!`);
        speak(`Account status updated to ${nextStatus}.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    }
  };

  // Flush farmer diagnostic history records
  const handleClearIntelligence = async (farmerId, farmerName) => {
    if (!window.confirm(`Are you absolutely sure you want to flush and permanently delete all agricultural search histories, location configurations, AI recommendations, leaf scans, consultations, and IP activity logs for ${farmerName}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${farmerId}/intelligence`);
      setSuccessMsg(`Flushed all intelligence database logs for ${farmerName} successfully.`);
      speak("Farmer activity intelligence records cleared.");
      
      // Re-fetch clean (seeded or blank) profile
      api.get(`/admin/users/${farmerId}/intelligence`)
        .then(res => setIntelData(res.data));

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Failed to clear farmer database data", err);
      setErrorMsg("Failed to delete farmer database records.");
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // 1. Register new user profile to database with elegant fallback simulation
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', newUser);
      const createdUser = res.data.user;
      setUsers([createdUser, ...users]);
      setSuccessMsg(`Registered account for ${createdUser.name} successfully.`);
      speak(`Registered new user account.`);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'farmer', location: '', phone: '', landArea: '', status: 'Active' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn("API route unavailable. Registering user profile in high-fidelity local session simulation mode.");
      const mockCreated = {
        _id: String(Date.now()),
        id: String(Date.now()),
        ...newUser,
        lastLogin: new Date().toISOString()
      };
      setUsers([mockCreated, ...users]);
      setSuccessMsg(`(Simulation Mode) Registered account for ${newUser.name} successfully.`);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'farmer', location: '', phone: '', landArea: '', status: 'Active' });
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // 2. Modify existing profile in database with elegant fallback simulation
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!userToEdit) return;
    const targetId = userToEdit._id || userToEdit.id;
    try {
      const res = await api.put(`/admin/users/${targetId}`, userToEdit);
      const updatedUser = res.data.user;
      setUsers(users.map(u => (u._id || u.id) === targetId ? { ...u, ...updatedUser } : u));
      setSuccessMsg(`Successfully updated profile details for ${userToEdit.name}.`);
      speak(`Profile saved successfully.`);
      setUserToEdit(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn("API route unavailable. Saving profile changes in high-fidelity local session simulation mode.");
      setUsers(users.map(u => (u._id || u.id) === targetId ? userToEdit : u));
      setSuccessMsg(`(Simulation Mode) Updated profile details for ${userToEdit.name} successfully.`);
      setUserToEdit(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // 3. Assign crop suggestion override with elegant fallback simulation
  const handleAddCropSuggestion = async (e) => {
    e.preventDefault();
    if (!cropOverrideUser) return;
    const targetId = cropOverrideUser._id || cropOverrideUser.id;
    try {
      const res = await api.post(`/admin/users/${targetId}/crop-suggestions`, { crop: newCropText });
      const updatedSuggestions = res.data.cropSuggestions;
      setUsers(users.map(u => (u._id || u.id) === targetId ? { ...u, cropSuggestions: updatedSuggestions } : u));
      setSuccessMsg(`Assigned crop override '${newCropText}' to ${cropOverrideUser.name}.`);
      speak(`Assigned crop suggestion override.`);
      setCropOverrideUser(null);
      setNewCropText('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn("API route unavailable. Adding crop suggestion override in high-fidelity local session simulation mode.");
      setUsers(users.map(u => {
        if ((u._id || u.id) === targetId) {
          const currentSuggestions = u.cropSuggestions || [];
          return { ...u, cropSuggestions: [...currentSuggestions, newCropText] };
        }
        return u;
      }));
      setSuccessMsg(`(Simulation Mode) Assigned crop override '${newCropText}' to ${cropOverrideUser.name}.`);
      setCropOverrideUser(null);
      setNewCropText('');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // 4. Update booking consultation queries with elegant fallback simulation
  const handleEditConsultationSubmit = async (e) => {
    e.preventDefault();
    if (!editConsultation) return;
    const targetId = editConsultation._id || editConsultation.id;
    try {
      const res = await api.put(`/admin/consultation/${targetId}`, { queryText: editedQueryText, status: editedQueryStatus });
      const updatedBooking = res.data.booking;
      setConsultations(consultations.map(c => (c._id || c.id) === targetId ? { ...c, queryText: updatedBooking.queryText, status: updatedBooking.status } : c));
      setSuccessMsg(`Successfully updated consultation query details.`);
      speak(`Consultation query updated successfully.`);
      setEditConsultation(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn("API route unavailable. Saving consultation query changes in high-fidelity local session simulation mode.");
      setConsultations(consultations.map(c => (c._id || c.id) === targetId ? { ...c, queryText: editedQueryText, status: editedQueryStatus } : c));
      setSuccessMsg(`(Simulation Mode) Updated consultation query details successfully.`);
      setEditConsultation(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // 5. Delete user profile completely with elegant fallback simulation
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user "${userName}" along with all their associated logs, telemetry, recommendations, and analytics? This action is irreversible.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => (u._id || u.id) !== userId));
      setSuccessMsg(`Permanently deleted user "${userName}" and all associated telemetry records.`);
      speak(`Deleted user account.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn("API route unavailable or failed. Deleting user profile in local session simulation mode.");
      setUsers(users.filter(u => (u._id || u.id) !== userId));
      setSuccessMsg(`(Simulation Mode) Permanently deleted user "${userName}".`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Dynamic search activity & topics analytical chart builders
  const getRechartsAnalytics = () => {
    if (!intelData || !intelData.searchHistory) return { searchActivity: [{ date: 'Today', Queries: 4 }], searchCategories: [{ name: 'Crop', value: 4 }, { name: 'Soil', value: 2 }], statusCounts: [] };
    
    // 1. Search Activity Trend Line Chart
    const activityTrend = intelData.searchHistory.map((s, idx) => ({
      date: new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Queries: idx + 1
    })).reverse();

    // 2. Search Topics Pie Chart
    const counts = {};
    intelData.searchHistory.forEach(s => {
      if (s?.category) {
        counts[s.category] = (counts[s.category] || 0) + 1;
      }
    });
    const searchCategories = Object.keys(counts).map(cat => ({
      name: cat,
      value: counts[cat]
    }));

    // 3. Operational Counts Bar Chart
    const statusCounts = [
      { name: 'Crop Recs', count: intelData.aiRecommendations?.length || 0 },
      { name: 'Disease Scans', count: intelData.diseaseReports?.length || 0 },
      { name: 'Consultations', count: intelData.consultations?.length || 0 }
    ];

    return { 
      searchActivity: activityTrend.length > 0 ? activityTrend : [{ date: 'Today', Queries: 4 }], 
      searchCategories: searchCategories.length > 0 ? searchCategories : [{ name: 'Crop', value: 4 }, { name: 'Soil', value: 2 }], 
      statusCounts 
    };
  };

  // Exporter: Excel CSV compiler
  const exportToExcel = (farmerName, intelligence) => {
    if (!intelligence) return;
    
    let csv = "data:text/csv;charset=utf-8,";
    csv += `CROPWEATHER AI - FARMER PLATFORM AUDIT REPORT\n`;
    csv += `Farmer Profile: ${farmerName}\n`;
    csv += `Farmer ID: ${intelligence.user?._id || intelligence.user?.id}\n`;
    csv += `Email: ${intelligence.user?.email}\n`;
    csv += `Location: ${intelligence.locations?.currentLocation || 'N/A'}\n`;
    csv += `Land Area: ${intelligence.user?.landArea || '12 Hectares'}\n\n`;
    
    csv += "--- FARMER SEARCH TIMELINE ---\n";
    csv += "Date,Query,Category,Response\n";
    (intelligence.searchHistory || []).forEach(s => {
      csv += `"${new Date(s.createdAt).toLocaleDateString()}","${s.query || ''}","${s.category || ''}","${(s.responseGenerated || '').replace(/"/g, '""')}"\n`;
    });

    csv += "\n--- AI RECOMMENDATION LOGS ---\n";
    csv += "Crop,Confidence,Reason,Expert Approval\n";
    (intelligence.aiRecommendations || []).forEach(r => {
      csv += `"${r.cropRecommended || ''}","${r.confidenceScore || 0}%","${(r.reason || '').replace(/"/g, '""')}","${r.expertApprovalStatus || ''}"\n`;
    });

    csv += "\n--- FERTILIZER RECORDS ---\n";
    csv += "N,P,K,Soil,Recommended Fertilizer,Dosage\n";
    (intelligence.fertilizerPlans || []).forEach(f => {
      csv += `"${f.nValue || 0}","${f.pValue || 0}","${f.kValue || 0}","${f.soilType || ''}","${f.recommendedFertilizer || ''}","${f.dosage || ''}"\n`;
    });

    csv += "\n--- SYSTEM AUDIT TIMELINE ---\n";
    csv += "Date,Action,Module,Status,IP Address\n";
    (intelligence.activityLogs || []).forEach(l => {
      csv += `"${new Date(l.createdAt).toLocaleString()}","${l.action || ''}","${l.module || ''}","${l.status || ''}","${l.ipAddress || ''}"\n`;
    });

    const encoded = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `${farmerName.replace(/\s+/g, '_')}_Intelligence_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exporter: Print Direct Layout
  const triggerPrintReport = () => {
    window.print();
  };

  // Algorithmic Risk Level Assessment Gauge
  const calculateRiskLevel = (intelligence) => {
    if (!intelligence) return { level: 'Low', score: 20, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10' };
    
    let score = 0;
    
    // Disease scan frequency risk
    const diseaseScans = intelligence.diseaseReports?.length || 0;
    score += diseaseScans * 15;
    
    // Adverse weather forecast risks (monsoons/frost alerts)
    const severeWeatherAlerts = intelligence.advisories?.filter(a => a?.advisoryType === 'Frost Alert' || a?.advisoryType === 'Pest Outbreak').length || 0;
    score += severeWeatherAlerts * 20;

    // Nutrient NPK soil deficiencies
    const hasDeficiencies = intelligence.fertilizerPlans?.some(f => f?.nValue < 50 || f?.kValue < 100) ? 1 : 0;
    score += hasDeficiencies * 30;

    let level = 'Low';
    let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score > 60) {
      level = 'High';
      color = 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse';
    } else if (score > 30) {
      level = 'Medium';
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }

    return { level, score: Math.min(100, score), color };
  };

  // Filters Search history records by Date Range and Global Search Query
  const getFilteredSearchHistory = () => {
    if (!intelData || !intelData.searchHistory) return [];
    
    return intelData.searchHistory.filter(s => {
      if (!s) return false;
      // 1. Apply search query matching
      const queryMatch = (s.query || '').toLowerCase().includes(intelSearchQuery.toLowerCase()) || 
                         (s.category || '').toLowerCase().includes(intelSearchQuery.toLowerCase()) ||
                         (s.responseGenerated || '').toLowerCase().includes(intelSearchQuery.toLowerCase());
      if (!queryMatch) return false;

      // 2. Apply Date Range filters
      const createdAt = new Date(s.createdAt);
      const diffTime = Math.abs(new Date() - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (intelDateFilter === 'Today' && diffDays > 1) return false;
      if (intelDateFilter === '7Days' && diffDays > 7) return false;
      if (intelDateFilter === '30Days' && diffDays > 30) return false;
      if (intelDateFilter === 'Custom' && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999); // Include full end date
        return createdAt >= start && createdAt <= end;
      }

      return true;
    });
  };

  // Sensors register status
  const PIE_COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'];

  // Gather analytics metrics safely
  const { searchActivity, searchCategories, statusCounts } = getRechartsAnalytics();
  const riskAnalysis = calculateRiskLevel(intelData);
  const activeFarmerSearchTimeline = getFilteredSearchHistory();

  // Sensors list batteries
  const [sensors] = useState([
    { id: 'NODE-01-NPK', type: 'Soil NPK', battery: '89%', status: 'online' },
    { id: 'NODE-02-PH', type: 'pH Probe', battery: '94%', status: 'online' },
    { id: 'NODE-03-MOIST', type: 'Humidity', battery: '42%', status: 'online' }
  ]);

  // Statistics for bar chart
  const cropStats = [
    { name: 'Rice', farmers: 45 },
    { name: 'Maize', farmers: 32 },
    { name: 'Wheat', farmers: 28 },
    { name: 'Cotton', farmers: 19 }
  ];

  // Search filter
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.location && u.location.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <span className="text-[8px] font-black uppercase text-emerald-650 dark:text-emerald-455 tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">Full System Control Room</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Admin Precision Dash Panel</h2>
          <p className="text-slate-500 text-sm">Create users, manage crop overrides, edit queries, and audit absolute farmer diagnostic logs.</p>
        </div>

        {/* Action triggers */}
        <button
          onClick={() => { setShowAddModal(true); speak("Opening user registration form."); }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-5 rounded-2xl text-xs transition-all uppercase tracking-wider flex items-center space-x-2 shadow-md shrink-0 self-start lg:self-center"
        >
          <PlusCircle size={15} />
          <span>Add Farmer / Expert</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle size={16} className="animate-pulse" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-xs font-bold flex items-center space-x-2">
          <ShieldAlert size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Numerical Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Registered Farmers & Staff', value: users.length, desc: 'Verifications active', icon: Users, color: 'text-emerald-500 dark:text-emerald-455' },
          { label: 'IoT Sensor Feeds', value: sensors.length, desc: 'Active probes', icon: Radio, color: 'text-cyan-500 dark:text-cyan-455' },
          { label: 'Server State', value: 'Online', desc: 'Secure layers', icon: Server, color: 'text-indigo-500 dark:text-indigo-455' },
          { label: 'System Resource', value: 'Optimal', desc: 'Resource loads low', icon: Cpu, color: 'text-emerald-500' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">{kpi.label}</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{kpi.value}</span>
              <span className="block text-[8px] text-slate-400 font-medium uppercase mt-0.5">{kpi.desc}</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl">
              <kpi.icon size={22} className={kpi.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Workspace Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column Workspace (2/3 col) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* USER REGISTRY SECTION */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-slate-850 dark:text-white text-base flex items-center">
                <Users className="mr-2 text-emerald-500" size={18} />
                User Account Registry & Privilege Overrides
              </h3>
              
              {/* Search Farmer Input */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800/80 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none"
                  placeholder="Search farmer name..."
                />
              </div>
            </div>

            <div className="overflow-x-auto w-full text-xs font-semibold">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email Address</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Last Active</th>
                    <th className="py-3 px-3 text-center">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                  {filteredUsers.map(u => {
                    const userId = u._id || u.id;
                    return (
                      <tr key={userId} className="hover:bg-slate-50 dark:hover:bg-slate-800/25 transition-colors">
                        <td className="py-3.5 px-3 font-extrabold text-slate-800 dark:text-white">{u.name}</td>
                        <td className="py-3.5 px-3 text-slate-500">{u.email}</td>
                        <td className="py-3.5 px-3">
                          <span className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">{u.role}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                            u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10 animate-pulse'
                          }`}>{u.status}</span>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[10px] text-slate-400">
                          {safeFormatDate(u.lastLogin)}
                        </td>
                        <td className="py-3.5 px-3 text-center flex items-center justify-center space-x-1">
                          
                          {/* DYNAMIC VIEW FULL PROFILE BUTTON */}
                          {u.role === 'farmer' && (
                            <button
                              type="button"
                              onClick={() => fetchFarmerIntelligence(u)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors flex items-center justify-center"
                              title="View Full Profile & Complete Search History"
                            >
                              <Sparkles size={13} />
                            </button>
                          )}

                          {/* VIEW INFO BUTTON */}
                          <button
                            type="button"
                            onClick={() => { setSelectedUserForInfo(u); speak(`Auditing user ${u.name}.`); }}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-555 p-1.5 rounded-lg text-slate-455 transition-colors"
                            title="View Profile Modal"
                          >
                            <Eye size={13} />
                          </button>

                          {/* EDIT PROFILE BUTTON */}
                          <button
                            type="button"
                            onClick={() => { setUserToEdit({ ...u }); speak("Editing profile."); }}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 hover:text-blue-500 p-1.5 rounded-lg text-slate-455 transition-colors"
                            title="Modify Profile Details"
                          >
                            <Edit size={13} />
                          </button>

                          {/* ADD CROP SUGGESTION BUTTON */}
                          {u.role === 'farmer' && (
                            <button
                              type="button"
                              onClick={() => { setCropOverrideUser(u); speak("Overriding crop suggestion."); }}
                              className="bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-500 p-1.5 rounded-lg text-slate-455 transition-colors"
                              title="Add Crop Suggestion Override"
                            >
                              <Sprout size={13} />
                            </button>
                          )}

                          {/* DELETE USER BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(userId, u.name)}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 hover:text-red-500 p-1.5 rounded-lg text-slate-455 transition-colors"
                            title="Delete User Completely"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* FARMER CONSULTATION MONITOR & EDITOR */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-5">
            <div className="border-b border-slate-150 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                <FileText className="mr-2 text-emerald-500" size={16} />
                Farmer Live Consultations Booking Auditor
              </h3>
            </div>

            <div className="space-y-4">
              {consultations.map(c => {
                const bookingId = c._id || c.id;
                return (
                  <div key={bookingId} className="bg-slate-50 dark:bg-slate-950 p-4.5 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="text-left space-y-1.5 flex-grow">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{c.farmerName} ➜ {c.expertName}</span>
                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded border ${
                          c.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>{c.status}</span>
                      </div>
                      <p className="text-xs text-slate-505 dark:text-slate-400 font-medium leading-relaxed font-sans">{c.queryText}</p>
                      <span className="block text-[8px] text-slate-550 font-mono">Date booked: {c.date} (Time: {c.time || 'N/A'})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditConsultation(c);
                        setEditedQueryText(c.queryText);
                        setEditedQueryStatus(c.status);
                        speak("Editing farmer consultation session details.");
                      }}
                      className="bg-slate-150 dark:bg-slate-800 hover:bg-emerald-600/10 text-slate-455 hover:text-emerald-600 py-1.5 px-3 rounded-xl text-[10px] font-extrabold uppercase transition-all shadow-sm flex items-center space-x-1 shrink-0 align-middle self-end sm:self-center"
                    >
                      <Edit size={11} />
                      <span>Edit Query</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analytics & Node Diagnostics */}
        <div className="space-y-6">
          
          {/* Crop distribution charts */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-6">
            <h3 className="font-extrabold text-slate-850 dark:text-white text-base">Crop Recommendation distribution</h3>
            
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropStats} margin={{ left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={9} />
                  <YAxis stroke="#888888" fontSize={9} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                  <Bar dataKey="farmers" name="Rec count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active node arrays register */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-slate-850 dark:text-white text-base flex items-center">
              <Radio className="mr-2 text-emerald-500 animate-pulse" size={16} />
              Active Telemetry Node status
            </h3>

            <div className="space-y-3 text-xs">
              {sensors.map(s => (
                <div key={s.id} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex items-center justify-between">
                  <div className="text-left leading-tight">
                    <span className="font-bold block text-slate-800 dark:text-white text-[11px]">{s.id}</span>
                    <span className="text-[9px] text-slate-400 font-medium block">{s.type} Probe</span>
                  </div>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                    s.status === 'online' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10'
                  }`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* A. NEW FARMER ACTIVITY INTELLIGENCE CENTER (FULLSCREEN)   */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {selectedFarmerForIntel && (
        <div className="fixed inset-0 bg-slate-955 backdrop-blur z-50 overflow-y-auto p-4 md:p-8 flex flex-col text-left text-xs text-slate-700 dark:text-slate-350 print:bg-white print:text-black">
          
          {loadingIntel ? (
            <div className="flex flex-col flex-grow items-center justify-center space-y-4 text-emerald-500">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              <span className="text-sm font-extrabold uppercase tracking-widest animate-pulse">Gathering Farmer Telemetry Indexes...</span>
            </div>
          ) : !intelData ? (
            <div className="flex flex-col flex-grow items-center justify-center space-y-4 text-red-500">
              <AlertTriangle size={48} className="animate-bounce" />
              <span className="font-black uppercase tracking-wider text-base">Analytical Seeding Pipeline Error.</span>
              <button 
                onClick={() => setSelectedFarmerForIntel(null)}
                className="bg-slate-800 text-white font-bold py-2 px-6 rounded-xl text-xs uppercase"
              >
                Close Portal
              </button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto w-full space-y-8 print:space-y-4">
              
              {/* Overlay Navigation Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80 print:hidden">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-600 p-2.5 rounded-2xl text-white">
                    <Sparkles size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-emerald-450 tracking-wider">Farmer Activity Intelligence Center</span>
                    <h3 className="text-2xl font-black text-white">{intelData?.user?.name || 'Farmer Profile'}</h3>
                  </div>
                </div>

                {/* Print/Export Action Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportToExcel(intelData?.user?.name || 'Farmer', intelData)}
                    className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 py-2 px-4 rounded-xl font-bold flex items-center space-x-1.5 transition-all text-[10px] uppercase"
                    title="Export all database records to CSV"
                  >
                    <FileDown size={13} />
                    <span>Export Excel</span>
                  </button>

                  <button
                    onClick={triggerPrintReport}
                    className="bg-indigo-650/10 hover:bg-indigo-650 text-indigo-400 hover:text-white border border-indigo-500/20 py-2 px-4 rounded-xl font-bold flex items-center space-x-1.5 transition-all text-[10px] uppercase"
                  >
                    <Printer size={13} />
                    <span>Print / PDF</span>
                  </button>

                  <button
                    onClick={() => handleToggleSuspend(intelData?.user?._id || intelData?.user?.id)}
                    className={`${intelData?.user?.status === 'Active' ? 'bg-red-500/15 text-red-500 hover:bg-red-650' : 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-650'} hover:text-white border border-slate-800 py-2 px-4 rounded-xl font-bold flex items-center space-x-1 transition-all text-[10px] uppercase`}
                  >
                    <Ban size={12} />
                    <span>{intelData?.user?.status === 'Active' ? 'Suspend Account' : 'Activate Account'}</span>
                  </button>

                  <button
                    onClick={() => handleClearIntelligence(intelData?.user?._id || intelData?.user?.id, intelData?.user?.name || 'Farmer')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white py-2 px-4 rounded-xl font-bold flex items-center space-x-1 transition-all text-[10px] uppercase"
                    title="Flush diagnostic records"
                  >
                    <Database size={12} />
                    <span>Reset Data</span>
                  </button>

                  <button 
                    onClick={() => setSelectedFarmerForIntel(null)}
                    className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white p-2.5 rounded-2xl focus:outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Grid 1: Basic Bio Details & Risk Assessment & IoT Locations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. BASIC FARMER INFORMATION */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <Users size={14} className="mr-1.5" />
                    1. Basic Farmer Information
                  </h4>
                  <div className="flex items-center space-x-4 border-b border-slate-800/60 pb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-lg font-black font-mono shadow-md">
                      {(intelData?.user?.name || 'F').split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="text-base font-black text-white leading-tight">{intelData?.user?.name || 'Farmer'}</h5>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-black uppercase px-2 py-0.5 rounded tracking-wide border border-emerald-500/10">
                        {intelData?.user?.role || 'farmer'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px] text-left leading-tight font-medium">
                    <div>
                      <span className="text-[7.5px] text-slate-550 uppercase block font-black">Farmer ID</span>
                      <span className="text-slate-350 font-mono block mt-0.5">{intelData?.user?._id || intelData?.user?.id}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Mobile Number</span>
                      <span className="text-slate-350 block mt-0.5">{intelData?.user?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Registered Email</span>
                      <span className="text-slate-350 block mt-0.5 truncate">{intelData?.user?.email}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Preferred Language</span>
                      <span className="text-slate-350 block mt-0.5">English (Regional)</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Registration Date</span>
                      <span className="text-slate-355 block mt-0.5 font-mono">2026-05-24 10:15</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Last Login Time</span>
                      <span className="text-slate-355 block mt-0.5 font-mono">
                        {safeFormatDate(intelData?.user?.lastLogin)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. FARMER LOCATION INTELLIGENCE */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <MapPin size={14} className="mr-1.5" />
                    2. Location Intelligence
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-[10px] text-left leading-tight font-medium">
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">District & State</span>
                      <span className="text-slate-300 block mt-0.5">
                        {intelData?.locations?.district || 'Ludhiana'}, {intelData?.locations?.state || 'Punjab'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Village / Settlement</span>
                      <span className="text-slate-355 block mt-0.5">{intelData?.locations?.village || 'Gill Village'}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">GPS Coordinates</span>
                      <span className="text-emerald-500 font-mono block mt-0.5">{intelData?.locations?.gpsCoordinates || '30.8601° N, 75.8592° E'}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-555 uppercase block font-black">Soil chemistry Zone</span>
                      <span className="text-slate-355 block mt-0.5">{intelData?.locations?.soilZone || 'Clay Loam Zone Alpha'}</span>
                    </div>
                  </div>

                  {/* Simulated Boundary Maps Grid Layout */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/60 text-left space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase">
                      <span>Interactive Boundary Model</span>
                      <span className="text-emerald-400 font-bold">Area: {intelData?.locations?.farmArea || '12 Hectares'}</span>
                    </div>
                    <div className="h-20 w-full rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
                      <svg className="w-16 h-16 text-emerald-500/20 fill-emerald-500/10 stroke-emerald-500 stroke-2 animate-pulse" viewBox="0 0 100 100">
                        <polygon points="20,20 80,10 90,80 30,90" />
                      </svg>
                      <span className="absolute bottom-1 right-2 text-[6px] font-mono text-slate-550 uppercase">Ludhiana GPS Block-01</span>
                    </div>
                  </div>
                </div>

                {/* 12. FARMER RISK ASSESSMENT (Live gauge indices) */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                      <AlertTriangle size={14} className="mr-1.5" />
                      12. Farmer Risk Assessment
                    </h4>

                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300">Overall Crop Vulnerability</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border ${riskAnalysis.color}`}>
                        {riskAnalysis.level} RISK
                      </span>
                    </div>

                    {/* Gauge Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800/80">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            riskAnalysis.level === 'High' ? 'bg-red-500' : riskAnalysis.level === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${riskAnalysis.score}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[7px] text-slate-550 font-bold uppercase tracking-wider">
                        <span>Low Vulnerability</span>
                        <span>Risk Index: {riskAnalysis.score}%</span>
                        <span>High Vulnerability</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 text-[9px] font-medium space-y-2 mt-4">
                    <span className="text-[7.5px] text-slate-555 uppercase font-black block">Risk Evaluation Factors</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-400 leading-tight">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Foliar Disease: {intelData?.diseaseReports?.length || 0} alerts</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span>Weather Risk: Low</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                        <span>NPK Deficit: Potassium</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span>Failure Probability: 12%</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid 2: Line & Pie charts analytical panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 11. SEARCH ACTIVITY TREND (Line Chart) */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <TrendingUp size={14} className="mr-1.5" />
                    11. Search Activity Trend (Line)
                  </h4>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={searchActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={8} />
                        <YAxis stroke="#64748b" fontSize={8} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 10 }} />
                        <Line type="monotone" dataKey="Queries" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 11. MOST SEARCHED TOPICS (Pie Chart) */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <PieIcon size={14} className="mr-1.5" />
                    11. Most Searched Topics (Pie)
                  </h4>
                  <div className="h-44 w-full flex items-center justify-between">
                    <div className="w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={searchCategories}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {searchCategories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 10 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="w-1/2 space-y-1 text-[9px] font-bold text-slate-400 pl-4 border-l border-slate-800/60">
                      {searchCategories.map((cat, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                            <span className="uppercase">{cat?.name || 'General'}</span>
                          </div>
                          <span className="text-white font-mono">{cat?.value || 0} queries</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 11. CROP/DISEASE/CONSULT COUNTS (Bar Chart) */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <BarChart2 size={14} className="mr-1.5" />
                    11. Operational Audits (Bar)
                  </h4>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusCounts} margin={{ left: -25 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={8} />
                        <YAxis stroke="#64748b" fontSize={8} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 10 }} />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Grid 3: Search Timeline & Advisory Boards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 3. SEARCH HISTORY TIMELINE */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl lg:col-span-2 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                    <h4 className="font-extrabold text-[11px] text-emerald-455 uppercase tracking-widest flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      3. Farmer Search History Timeline
                    </h4>

                    {/* Date select ranges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[8px] font-black uppercase">
                      {['All', 'Today', '7Days', '30Days', 'Custom'].map(range => (
                        <button
                          key={range}
                          onClick={() => setIntelDateFilter(range)}
                          className={`px-2 py-1 rounded transition-colors ${
                            intelDateFilter === range ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Date Picker Inputs */}
                  {intelDateFilter === 'Custom' && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-855 text-[9px] font-bold">
                      <div className="space-y-0.5">
                        <span className="text-[7px] text-slate-550 uppercase font-black">Start Date</span>
                        <input 
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded p-1"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[7px] text-slate-550 uppercase font-black">End Date</span>
                        <input 
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-white rounded p-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Search query search filters inside timeline */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2 text-slate-500" size={12} />
                    <input 
                      type="text"
                      value={intelSearchQuery}
                      onChange={(e) => setIntelSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none placeholder-slate-655"
                      placeholder="Filter queries text..."
                    />
                  </div>

                  {/* Scrollable list */}
                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {activeFarmerSearchTimeline.length === 0 ? (
                      <p className="text-slate-555 py-6 text-center font-medium">No agricultural searches matched the filters.</p>
                    ) : (
                      activeFarmerSearchTimeline.map((s, idx) => (
                        <div key={idx} className="bg-slate-955 border border-slate-855 p-3 rounded-2xl space-y-1.5 animate-fadeIn">
                          <div className="flex justify-between items-center text-[9px] font-bold border-b border-slate-855 pb-1.5 mb-1.5">
                            <div className="flex items-center space-x-1.5">
                              <span className="bg-emerald-500/10 text-emerald-450 border border-emerald-500/10 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                                {s?.category || 'Crop'}
                              </span>
                              <span className="text-slate-300">Query: "{s?.query || 'General Question'}"</span>
                            </div>
                            <span className="text-slate-550 font-mono">
                              {safeFormatDate(s?.createdAt)}
                            </span>
                          </div>
                          <div className="leading-relaxed text-slate-400 pl-2 border-l border-emerald-500/40">
                            <span className="text-[7.5px] text-slate-550 uppercase font-black block">Response Generated:</span>
                            <p className="font-light text-[9.5px] text-slate-350">{s?.responseGenerated}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 9. SEASONAL ADVISORIES */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl text-left">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <Cloud size={14} className="mr-1.5 animate-pulse" />
                    9. Seasonal Advisories
                  </h4>

                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {(intelData?.advisories || []).map((adv, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-855 p-3 rounded-2xl space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[8.5px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded font-black uppercase">
                            {adv?.advisoryType || 'Alert'}
                          </span>
                          <span className={`text-[7px] font-black uppercase px-1.5 py-0.25 rounded border ${
                            adv?.acknowledgementStatus === 'Acknowledged' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'
                          }`}>{adv?.acknowledgementStatus || 'Unread'}</span>
                        </div>
                        <p className="text-[9px] text-slate-355 font-light leading-relaxed">{adv?.message}</p>
                        <span className="block text-[7px] text-slate-550 font-mono">Dispatched: {safeFormatDate(adv?.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Grid 4: AI Recommendations & Fertilizers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                
                {/* 4. AI RECOMMENDATION HISTORY */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <Cpu size={14} className="mr-1.5 animate-pulse" />
                    4. AI Recommendation History (Timeline View)
                  </h4>

                  <div className="space-y-4 relative pl-4 border-l border-slate-800/80 py-2">
                    {(intelData?.aiRecommendations || []).map((rec, idx) => (
                      <div key={idx} className="relative space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-855">
                        <div className="absolute -left-[20.5px] top-4.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-4 border-slate-955"></div>
                        
                        <div className="flex justify-between items-center text-[9px] font-bold border-b border-slate-855 pb-1">
                          <span className="text-white text-[10px] font-black uppercase">{rec?.cropRecommended} ({rec?.confidenceScore || 0}% Confidence)</span>
                          <span className="text-slate-550 font-mono">{safeFormatDate(rec?.createdAt)}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-light leading-relaxed">{rec?.reason}</p>
                        
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-[7px] text-slate-555 uppercase font-black">Expert Endorsement:</span>
                          <span className={`text-[7px] font-black uppercase px-1.5 py-0.2 rounded ${
                            rec?.expertApprovalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-amber-500/10 text-amber-455 border-amber-500/10'
                          }`}>{rec?.expertApprovalStatus || 'Pending'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 10. FERTILIZER SUGGESTION LOGS */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <Sprout size={14} className="mr-1.5" />
                    10. Fertilizer Recommendation Records
                  </h4>

                  <div className="space-y-4">
                    {(intelData?.fertilizerPlans || []).map((fert, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-855 p-4 rounded-2xl space-y-3.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-white font-black uppercase">{fert?.recommendedFertilizer || 'DAP'}</span>
                          <span className="bg-slate-900 px-2 py-0.5 rounded text-[8px] font-black text-emerald-400 uppercase border border-slate-800">
                            Dosage: {fert?.dosage || 'Standard'}
                          </span>
                        </div>
                        
                        {/* Chemical NPK grid */}
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60 leading-none">
                            <span className="text-[7px] text-slate-550 block font-black mb-1">N (Nitrogen)</span>
                            <span className="text-slate-200 font-mono text-xs">{fert?.nValue || 0}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60 leading-none">
                            <span className="text-[7px] text-slate-550 block font-black mb-1">P (Phosphorus)</span>
                            <span className="text-slate-200 font-mono text-xs">{fert?.pValue || 0}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60 leading-none">
                            <span className="text-[7px] text-slate-550 block font-black mb-1">K (Potassium)</span>
                            <span className="text-slate-200 font-mono text-xs">{fert?.kValue || 0}</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded-xl border border-slate-800/60 leading-none">
                            <span className="text-[7px] text-slate-550 block font-black mb-1">Soil Type</span>
                            <span className="text-slate-200 block text-[9px] mt-0.5">{fert?.soilType || 'Loam'}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 leading-relaxed text-[9px] bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-[7.5px] text-slate-555 uppercase font-black block">Application Schedule</span>
                            <p className="text-slate-355 font-light">{fert?.applicationSchedule}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Grid 5: Plant Disease scans image gallery */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl text-left">
                <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                  <ShieldCheck size={14} className="mr-1.5 animate-pulse" />
                  7. Plant Disease Diagnosis Records (Image Gallery Preview)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(intelData?.diseaseReports || []).map((dis, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-855 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                      <div className="h-32 w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-955/40 backdrop-blur-xs z-10"></div>
                        <div className="z-20 text-center space-y-1.5">
                          <span className="text-[9px] bg-red-500/20 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-black uppercase">
                            {dis?.diseaseDetected || 'Tomato Late Blight'}
                          </span>
                          <span className="block text-[8px] text-slate-400 font-mono">Scan File: {dis?.uploadedLeafImage}</span>
                        </div>
                        <svg className="absolute w-24 h-24 text-red-500/10 fill-red-500/5 stroke-red-500/25 stroke-1" viewBox="0 0 100 100">
                          <path d="M 50,10 A 40,40 0 0,0 10,50 A 40,40 0 0,0 50,90 A 40,40 0 0,0 90,50 A 40,40 0 0,0 50,10 Z" />
                          <line x1="10" y1="50" x2="90" y2="50" />
                          <line x1="50" y1="10" x2="50" y2="90" />
                        </svg>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="text-slate-355 uppercase">Confidence Score:</span>
                          <span className="font-mono text-emerald-500 text-xs">{dis?.confidenceScore || 0}%</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-light leading-relaxed border-t border-slate-900 pt-2">
                          <span className="text-[7.5px] text-slate-555 uppercase font-black block">Treatment Suggested:</span>
                          {dis?.treatmentSuggested}
                        </p>
                        <div className="flex justify-between items-center text-[7.5px] font-black uppercase bg-slate-900/60 p-2 rounded-xl border border-slate-800 mt-2">
                          <span className="text-slate-555">Expert Validation:</span>
                          <span className="text-emerald-400 font-extrabold">{dis?.expertValidation || 'Validated'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid 6: Weather & Consultation & Crop Records */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                
                {/* 5. WEATHER QUERY HISTORY */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-400 uppercase tracking-widest flex items-center">
                    <Cloud size={14} className="mr-1.5" />
                    5. Weather Query History
                  </h4>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {(intelData?.weatherHistory || []).map((w, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-850 p-3.5 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-1">
                          <span className="text-white font-extrabold text-[9.5px]">{w?.weatherLocation || 'Ludhiana'}</span>
                          <span className="text-slate-550 font-mono">{safeFormatDate(w?.createdAt)}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1 text-center font-mono font-bold text-[9px] text-slate-350">
                          <div className="bg-slate-900 py-1.5 rounded-lg border border-slate-800">Temp: {w?.temperature}°C</div>
                          <div className="bg-slate-900 py-1.5 rounded-lg border border-slate-800">Rain: {w?.rainfall}mm</div>
                          <div className="bg-slate-900 py-1.5 rounded-lg border border-slate-800">Hum: {w?.humidity}%</div>
                        </div>

                        <p className="text-[9px] text-slate-400 font-light leading-relaxed pl-1.5 border-l border-indigo-500/40">
                          {w?.forecastReturned}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. CONSULTATION HISTORY */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-400 uppercase tracking-widest flex items-center">
                    <MessageCircle size={14} className="mr-1.5" />
                    8. Expert Consultation Chats
                  </h4>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {(intelData?.consultations || []).map((c, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-855 p-3.5 rounded-2xl space-y-2.5">
                        <div className="flex justify-between items-center border-b border-slate-855 pb-1.5 text-[8px] font-black uppercase">
                          <span className="text-white">Expert: {c?.expertName || 'Advisor'}</span>
                          <span className={`px-1.5 py-0.2 rounded border ${
                            c?.resolutionStatus === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-amber-500/10 text-amber-455 border-amber-500/10'
                          }`}>{c?.resolutionStatus || 'Resolved'}</span>
                        </div>
                        
                        <div className="space-y-2 text-[9.5px]">
                          {(c?.chatTranscript || []).map((msg, mIdx) => (
                            <div key={mIdx} className={`flex flex-col ${msg?.sender === 'farmer' ? 'items-start text-left' : 'items-end text-right'}`}>
                              <span className="text-[7px] text-slate-550 uppercase font-black">{msg?.sender === 'farmer' ? 'Farmer Shiva' : 'Expert'}</span>
                              <div className={`p-2 rounded-xl mt-0.5 max-w-[85%] font-light leading-snug ${
                                msg?.sender === 'farmer' ? 'bg-slate-900 border border-slate-850 text-slate-300' : 'bg-emerald-600/15 border border-emerald-500/10 text-emerald-450'
                              }`}>
                                {msg?.message}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. CROP RECOMMENDATION HISTORIES */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                    <Database size={14} className="mr-1.5" />
                    6. Crop Recommendation Records
                  </h4>

                  <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                    {(intelData?.aiRecommendations || []).map((rec, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-855 p-3.5 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-white">{rec?.cropRecommended}</span>
                          <span className="text-slate-550 font-mono text-[8px]">{safeFormatDate(rec?.createdAt)}</span>
                        </div>
                        
                        <div className="space-y-1 bg-slate-900/40 p-2 rounded-xl border border-slate-855 text-[9px] font-medium leading-relaxed">
                          <div>
                            <span className="text-[7.5px] text-slate-550 uppercase font-black block">Soil Telemetry parameters:</span>
                            <span className="text-slate-350 block">Clay Loam, pH: 6.2, NPK: 85-48-42</span>
                          </div>
                          <div className="mt-1 pt-1 border-t border-slate-800">
                            <span className="text-[7.5px] text-slate-550 uppercase font-black block">Expert Decision:</span>
                            <span className="text-emerald-400 font-bold block">Validated and Dispatched Guidance</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 13. CENTRAL AUDIT LOGS (IP Auditing timeline) */}
              <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-3xl space-y-4 shadow-xl text-left">
                <h4 className="font-extrabold text-[11px] text-emerald-450 uppercase tracking-widest flex items-center">
                  <Activity size={14} className="mr-1.5" />
                  13. Central Audit Logs & IP Timeline
                </h4>

                <div className="overflow-x-auto w-full text-xs font-semibold">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-[9px] text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Audited Action</th>
                        <th className="py-2.5 px-3">Module Layer</th>
                        <th className="py-2.5 px-3">State Status</th>
                        <th className="py-2.5 px-3">Device IP Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 font-medium">
                      {(intelData?.activityLogs || []).map((log, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[9px] text-slate-550">
                            {safeFormatDate(log?.createdAt)}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-300">{log?.action}</td>
                          <td className="py-2.5 px-3 text-slate-400">{log?.module}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-flex px-1.5 py-0.2 rounded text-[7px] font-black uppercase ${
                              log?.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'
                            }`}>{log?.status || 'Success'}</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[9px] text-slate-500">{log?.ipAddress || '192.168.1.1'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SIMPLE PROFILE VIEW MODAL                             */}
      {/* ======================================================== */}
      {selectedUserForInfo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-6 text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            
            <button 
              onClick={() => setSelectedUserForInfo(null)}
              className="absolute top-4 right-4 text-slate-455 hover:text-white font-black focus:outline-none"
            >
              <X size={18} />
            </button>

            {/* Profile Overview */}
            <div className="border-b pb-4">
              <span className="text-[8px] font-black uppercase text-emerald-400 tracking-wider">User Information Profile</span>
              <div className="flex items-center space-x-4 mt-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg flex-shrink-0 flex items-center justify-center text-white">
                  <Users size={24} />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedUserForInfo.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wide text-slate-400">
                      {selectedUserForInfo.role}
                    </span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                      selectedUserForInfo.status === 'Active' ? 'bg-emerald-500/10 text-emerald-555 border-emerald-500/10' : 'bg-red-500/10 text-red-500 border-red-500/10'
                    }`}>{selectedUserForInfo.status}</span>
                  </div>
                  <span className="block text-[8px] text-slate-505 font-mono mt-0.5">ID: {selectedUserForInfo._id || selectedUserForInfo.id}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 space-x-4">
              <button
                type="button"
                onClick={() => setModalTab('profile')}
                className={`pb-1 text-xs font-black uppercase tracking-wider transition-colors focus:outline-none ${modalTab === 'profile' ? 'text-emerald-500 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-200'}`}
              >
                Profile Details
              </button>
              <button
                type="button"
                onClick={() => setModalTab('activities')}
                className={`pb-1 text-xs font-black uppercase tracking-wider transition-colors focus:outline-none ${modalTab === 'activities' ? 'text-emerald-500 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-200'}`}
              >
                System Actions
              </button>
              {selectedUserForInfo.role === 'farmer' && (
                <button
                  type="button"
                  onClick={() => setModalTab('history')}
                  className={`pb-1 text-xs font-black uppercase tracking-wider transition-colors focus:outline-none ${modalTab === 'history' ? 'text-emerald-500 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-200'}`}
                >
                  Searches & Diagnostics
                </button>
              )}
            </div>

            {/* Profile Details */}
            {modalTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-slate-50 dark:bg-slate-955 p-3.5 rounded-2xl border">
                    <span className="text-[8px] text-slate-555 uppercase block font-black">Region Location</span>
                    <span className="text-slate-800 dark:text-slate-200 text-sm font-black block mt-0.5">{selectedUserForInfo.location || 'N/A'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-955 p-3.5 rounded-2xl border">
                    <span className="text-[8px] text-slate-555 uppercase block font-black">Phone Number</span>
                    <span className="text-slate-800 dark:text-slate-200 text-sm font-black block mt-0.5">{selectedUserForInfo.phone || 'N/A'}</span>
                  </div>
                </div>
                {selectedUserForInfo.role === 'farmer' && (
                  <div className="space-y-1.5">
                    <span className="text-[8.5px] uppercase font-black tracking-wider text-slate-555 block">Assigned Crop suggestions</span>
                    <div className="flex flex-wrap gap-2">
                      {(selectedUserForInfo.cropSuggestions || ['Commercial Tomato']).map((crop, idx) => (
                        <span key={idx} className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* System Actions */}
            {modalTab === 'activities' && (
              <div className="space-y-3">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-slate-555 block flex items-center">
                  <Activity size={12} className="text-emerald-500 mr-1.5" />
                  Recent User System Actions
                </span>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {(selectedUserForInfo.activities && selectedUserForInfo.activities.length > 0 ? selectedUserForInfo.activities : [
                    { action: 'Logged in successfully', timestamp: new Date(), details: 'Authenticated from coordinates.' }
                  ]).map((act, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-955 border border-slate-200 p-3 rounded-2xl text-[10px] space-y-1 text-left">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-white font-extrabold">{act.action}</span>
                        <span className="text-slate-550 font-mono text-[8px]">
                          {safeFormatDate(act.timestamp)}
                        </span>
                      </div>
                      <p className="text-slate-400 font-light leading-normal">{act.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Searches Timeline */}
            {modalTab === 'history' && (
              <div className="space-y-3">
                <span className="text-[8.5px] uppercase font-black tracking-wider text-slate-555 block flex items-center">
                  <Activity size={12} className="text-emerald-500 mr-1.5" />
                  Farmer Searches & Diagnostic Audits
                </span>
                {loadingHistory ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
                  </div>
                ) : selectedUserHistory.length === 0 ? (
                  <p className="text-slate-500 text-xs py-4 text-center font-medium">No actions logged for this farmer.</p>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {selectedUserHistory.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-955 border border-slate-200 p-3 rounded-2xl text-[10px] space-y-1 text-left">
                        <div className="flex justify-between items-center font-bold border-b pb-1 mb-1">
                          <span className="text-white font-extrabold">{item.title}</span>
                          <span className="text-slate-550 font-mono text-[8px]">
                            {safeFormatDate(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-400 font-light leading-normal text-[9px]">{item.inputs?.soil_weather}</p>
                        <p className="text-emerald-450 font-bold leading-normal text-[9px] mt-1">Result: {item.outputs?.result}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CREATE NEW USER MODAL                                 */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-6 text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white font-black focus:outline-none"
            >
              <X size={18} />
            </button>

            <div className="border-b dark:border-slate-800 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Register New Agricultural Account</h3>
              <p className="text-slate-500 text-xs mt-0.5">Define login credentials and total land sizes for farmer profiles.</p>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    placeholder="E.g. Shiva Kumar"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    placeholder="shiva@smartfarm.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Default Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    placeholder="E.g. AgriPass123!"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">System Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer uppercase text-[10px]"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Location Block</label>
                  <input
                    type="text"
                    value={newUser.location}
                    onChange={(e) => setNewUser(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    placeholder="Punjab, India"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Phone</label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {newUser.role === 'farmer' && (
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Total Land Area (Farmer only)</label>
                  <input
                    type="text"
                    value={newUser.landArea}
                    onChange={(e) => setNewUser(prev => ({ ...prev, landArea: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    placeholder="E.g. 12 Hectares"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md focus:outline-none"
              >
                Register User Account
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MODIFY/EDIT USER DETAILS MODAL                        */}
      {/* ======================================================== */}
      {userToEdit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-6 text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            
            <button 
              onClick={() => setUserToEdit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white font-black focus:outline-none"
            >
              <X size={18} />
            </button>

            <div className="border-b dark:border-slate-800 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Modify User Profile Details</h3>
              <p className="text-slate-500 text-xs mt-0.5">Edit farmer names, total tilled lands, and sector locations.</p>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userToEdit.name}
                    onChange={(e) => setUserToEdit(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userToEdit.email}
                    onChange={(e) => setUserToEdit(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Location Block</label>
                  <input
                    type="text"
                    value={userToEdit.location || ''}
                    onChange={(e) => setUserToEdit(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">System Role</label>
                  <select
                    value={userToEdit.role}
                    onChange={(e) => setUserToEdit(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-255 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer uppercase text-[10px]"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {userToEdit.role === 'farmer' && (
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-500">Total Land Area</label>
                    <input
                      type="text"
                      value={userToEdit.landArea || ''}
                      onChange={(e) => setUserToEdit(prev => ({ ...prev, landArea: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Account status</label>
                  <select
                    value={userToEdit.status}
                    onChange={(e) => setUserToEdit(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-255 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer uppercase text-[10px]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md focus:outline-none"
              >
                Save Profile Changes
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ADD CROP SUGGESTION OVERRIDE POPUP MODAL               */}
      {/* ======================================================== */}
      {cropOverrideUser && (
        <div className="fixed inset-0 bg-slate-955 backdrop-blur z-50 flex items-center justify-center p-6 text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            
            <button 
              onClick={() => setCropOverrideUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white font-black focus:outline-none"
            >
              <X size={18} />
            </button>

            <div className="border-b dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Add Crop Suggestion Override</h3>
              <p className="text-slate-500 text-xs mt-0.5">Assign specialized crop cultivars directly for {cropOverrideUser.name}.</p>
            </div>

            <form onSubmit={handleAddCropSuggestion} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-500">Dispatched Crop Recommendation</label>
                <input
                  type="text"
                  required
                  value={newCropText}
                  onChange={(e) => setNewCropText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  placeholder="E.g. Certified Basmati Rice"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-1 focus:outline-none"
              >
                <Sprout size={12} />
                <span>Assign Suggestion Override</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. EDIT CONSULTATION QUERY MODAL                         */}
      {/* ======================================================== */}
      {editConsultation && (
        <div className="fixed inset-0 bg-slate-955 backdrop-blur z-50 flex items-center justify-center p-6 text-left">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative animate-fadeIn">
            
            <button 
              onClick={() => setEditConsultation(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 dark:hover:text-white font-black focus:outline-none"
            >
              <X size={18} />
            </button>

            <div className="border-b dark:border-slate-800 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Edit Farmer Consultation Query</h3>
              <p className="text-slate-500 text-xs mt-0.5">Amend specific booking text and overall session schedule statuses.</p>
            </div>

            <form onSubmit={handleEditConsultationSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-500">Query Content Text</label>
                <textarea
                  rows={4}
                  required
                  value={editedQueryText}
                  onChange={(e) => setEditedQueryText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-slate-500">Session status</label>
                <select
                  value={editedQueryStatus}
                  onChange={(e) => setEditedQueryStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none cursor-pointer uppercase text-[10px]"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md focus:outline-none"
              >
                Update Consultation Query
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
