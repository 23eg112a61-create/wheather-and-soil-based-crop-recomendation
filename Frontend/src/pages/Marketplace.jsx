import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { ShoppingBag, Tag, Plus, CheckCircle, Navigation, Globe, MapPin, Truck } from 'lucide-react';

const Marketplace = () => {
  const { user, speak } = useApp();
  const [activeTab, setActiveTab] = useState('shop'); // 'shop', 'sell', 'logistics', 'export'
  const [items, setItems] = useState([]);
  
  // Local Shop Catalog
  const shopCatalog = [
    { id: 1, name: 'Certified Basmati Rice Seeds (Kharif Special)', price: 1200, category: 'Seeds', desc: 'High-yield, drought-resistant certified paddy seeds.' },
    { id: 2, name: 'Organic Neem Seed Organic Cake (Nutrient Rich)', price: 450, category: 'Fertilizers', desc: 'Rich in organic NPK and acts as natural root nematode deterrent.' },
    { id: 3, name: 'Smart IoT NPK Moisture Probes NODE-V2', price: 3200, category: 'Machinery', desc: 'ESP32 automated sensor probe transmitting soil parameters via Wi-Fi.' },
    { id: 4, name: 'Premium Hybrid Cotton Seeds', price: 950, category: 'Seeds', desc: 'Pest-resistant hybrid cotton seeds suited for black soils.' }
  ];

  // Forms
  const [cropName, setCropName] = useState('');
  const [cropCategory, setCropCategory] = useState('Crops');
  const [cropDesc, setCropDesc] = useState('');
  const [cropPrice, setCropPrice] = useState('');
  const [cropQty, setCropQty] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Cart Simulation
  const [cartCount, setCartCount] = useState(0);

  // Logistics tracking simulation
  const [shipments] = useState([
    { id: 'TRK-2948', cargo: '5 Tons Wheat Grain', source: 'Ludhiana Farm', destination: 'FCI Warehouses Delhi', status: 'In Transit', progress: 65 },
    { id: 'TRK-5832', cargo: '2 Tons Basmati Rice', source: 'Amritsar Block', destination: 'Mundra Port Gujarat', status: 'Delivered', progress: 100 }
  ]);

  // Export Opportunities
  const [exports] = useState([
    { crop: 'Basmati Grains (Premium A-Grade)', market: 'Dubai, UAE', price: 'Rs. 95,000 / Ton', minQty: '10 Tons', certified: 'APEDA Certified' },
    { crop: 'Organic Arabica Coffee Beans', market: 'Hamburg, Germany', price: 'Rs. 2,10,000 / Ton', minQty: '5 Tons', certified: 'Euro-Organic Certified' }
  ]);

  const fetchItems = async () => {
    try {
      const res = await api.get('/platform/marketplace');
      // Filter out only farm crops posted by users to display on sell listings, or combine
      setItems(res.data);
    } catch (e) {
      setItems([
        { name: 'Harvested Wheat (Shiva Kumar)', description: 'Dry, cleaned gold wheat grains.', price: 18500, quantity: 5, category: 'Crops', sellerName: 'Shiva Kumar', status: 'Available' }
      ]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePostCrop = async (e) => {
    e.preventDefault();
    if (!cropName || !cropPrice || !cropQty) return;

    setLoading(true);
    try {
      const payload = {
        name: cropName,
        description: cropDesc || 'Cleaned, harvested farm stock.',
        category: cropCategory,
        price: parseFloat(cropPrice),
        quantity: parseInt(cropQty),
        sellerName: user?.name || 'Shiva Kumar'
      };

      await api.post('/platform/marketplace', payload);
      setSuccess('Crop harvest successfully listed for corporate buyers.');
      speak("Harvest listed successfully.");
      setCropName('');
      setCropPrice('');
      setCropQty('');
      setCropDesc('');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.warn('Marketplace post error, saving locally.');
      const localCrop = {
        name: cropName,
        description: cropDesc || 'Cleaned, harvested farm stock.',
        price: parseFloat(cropPrice),
        quantity: parseInt(cropQty),
        category: 'Crops',
        sellerName: user?.name || 'Shiva Kumar',
        status: 'Available'
      };
      setItems(prev => [localCrop, ...prev]);
      setSuccess('Crop listed for sale (Standby Mode).');
      setCropName('');
      setCropPrice('');
      setCropQty('');
      setCropDesc('');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (name) => {
    setCartCount(prev => prev + 1);
    speak(`${name} added to cart.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-8 text-left">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Agriculture Trade Center</span>
          <h2 className="text-3xl font-extrabold tracking-tight">Agricultural Marketplace</h2>
          <p className="text-emerald-100 text-sm font-light">Procure certified inputs, sell your harvested yield directly to corporate buyers, and organize cold chain logistics.</p>
        </div>

        <div className="flex bg-white/10 border border-white/20 p-4 rounded-2xl items-center space-x-3 w-fit">
          <ShoppingBag className="text-emerald-200" size={24} />
          <div>
            <span className="block text-[10px] uppercase font-bold text-emerald-200">Procurement Cart</span>
            <span className="text-sm font-semibold text-white">{cartCount} Items Selected</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-emerald-950/40 p-1.5 rounded-2xl border w-fit space-x-1">
        <button 
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'shop' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
        >
          Buy Seeds & Machinery
        </button>
        <button 
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'sell' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
        >
          Sell Crop Yields
        </button>
        <button 
          onClick={() => setActiveTab('logistics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'logistics' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
        >
          Storage & Logistics
        </button>
        <button 
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'export' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'}`}
        >
          Export Opportunities
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {shopCatalog.map(item => (
            <div key={item.id} className="bg-white dark:bg-emerald-950/20 border rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all text-left space-y-4">
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">{item.category}</span>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white block leading-snug">{item.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-base font-black text-slate-900 dark:text-white">Rs. {item.price}</span>
                <button
                  onClick={() => handleAddToCart(item.name)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold py-1.5 px-3 rounded-lg text-xs"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'sell' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post harvest form */}
          <div className="glassmorphism p-6 rounded-3xl border space-y-6 lg:col-span-1 text-left">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Tag className="mr-2 text-emerald-500" size={20} />
              List Crop Harvest for Sale
            </h3>

            {success && (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handlePostCrop} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Crop Name</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                  placeholder="e.g., Organic Gold Wheat Grains"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase">Price per Ton (Rs.)</label>
                  <input
                    type="number"
                    value={cropPrice}
                    onChange={(e) => setCropPrice(e.target.value)}
                    className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                    placeholder="18500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase">Volume (Tons)</label>
                  <input
                    type="number"
                    value={cropQty}
                    onChange={(e) => setCropQty(e.target.value)}
                    className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Product Description</label>
                <textarea
                  rows={2}
                  value={cropDesc}
                  onChange={(e) => setCropDesc(e.target.value)}
                  className="w-full bg-white dark:bg-emerald-950/20 border border-slate-200 rounded-lg p-2.5 text-sm"
                  placeholder="State moisture content, clean level..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                {loading ? 'Posting listing...' : 'Post Harvest Offer'}
              </button>
            </form>
          </div>

          {/* Active Marketplace listings */}
          <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6 text-left">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Active Farmer Crop Listings</h3>
            
            <div className="space-y-4">
              {items.map((c, idx) => (
                <div key={idx} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                  <div className="space-y-1.5 max-w-lg">
                    <span className="font-bold block text-base text-slate-800 dark:text-white">{c.name}</span>
                    <p className="text-xs text-slate-400">Seller: {c.sellerName} • Volume Available: {c.quantity} Tons</p>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">{c.description}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">Rs. {c.price} / Ton</span>
                    <span className="inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logistics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Active Shipments */}
          <div className="glassmorphism p-6 rounded-3xl border lg:col-span-2 space-y-6">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Truck className="mr-2 text-emerald-500" size={20} />
              GPS Cold Chain Logistics Tracker
            </h3>
            
            <div className="space-y-4">
              {shipments.map((s, idx) => (
                <div key={idx} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm text-slate-800 dark:text-white block">{s.cargo}</span>
                      <span className="text-[10px] text-slate-400">Tracking Code: {s.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${s.status === 'In Transit' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-emerald-100 text-emerald-700'}`}>{s.status}</span>
                  </div>

                  {/* Progress Tracker Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>Source: {s.source}</span>
                      <span>Target: {s.destination}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${s.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehousing details */}
          <div className="glassmorphism p-6 rounded-3xl border space-y-5">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
              <Navigation className="mr-2 text-emerald-500" size={20} />
              Cold Storage Allocation
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We coordinate with regional Cold Storages to reserve space for perishable harvests like vegetables or fruits. Reservable spaces have optimal 4°C moisture control.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100 text-xs flex items-start space-x-2">
              <MapPin size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-white block">Punjab Cold Storage Warehouse</span>
                <p className="text-slate-400 mt-1">Available Capacity: 450 Metric Tons</p>
                <p className="text-slate-400">Rates: Rs. 120 / Ton / Month</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="glassmorphism p-6 rounded-3xl border space-y-6 text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center">
            <Globe className="mr-2 text-emerald-500" size={20} />
            APEDA Global Export Board
          </h3>
          <p className="text-xs text-slate-500">Exhibit your certified crops on global export boards. Direct crop procurement channels operate with verified international ports.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exports.map((e, idx) => (
              <div key={idx} className="bg-white dark:bg-emerald-950/20 p-5 rounded-2xl border space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-extrabold text-base text-slate-800 dark:text-white block">{e.crop}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{e.certified}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block uppercase text-[9px]">Target Market</span>
                    <span className="font-bold text-slate-800 dark:text-white">{e.market}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[9px]">Price Offered</span>
                    <span className="font-bold text-slate-800 dark:text-white">{e.price}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[9px]">Minimum Consignment</span>
                    <span className="font-bold text-slate-800 dark:text-white">{e.minQty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
