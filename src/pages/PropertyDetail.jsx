import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Activity, ShieldCheck, 
  Layers, Globe, ChevronLeft, ChevronRight,
  Bed, Bath, Maximize, Camera, Zap, TrendingUp, Info
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, RadarChart as ReRadar 
} from 'recharts';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  const formatValue = (value, type = 'text') => {
    if (value === undefined || value === null || value === "null" || value === "") return "N/A";
    const cleaned = String(value).replace(/[\[\]"']/g, '').trim();
    if (type === 'price' && !cleaned.includes('£')) {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(cleaned);
    }
    return cleaned;
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${base_url.replace(/\/$/, '')}/api/properties`);
        const data = await response.json();
        const selected = data.find(p => String(p.id) === String(id));
        if (selected) setProperty(selected);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <p className="text-slate-500 mb-4 font-medium">Property not found</p>
      <button onClick={() => navigate(-1)} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm">Go Back</button>
    </div>
  );

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(formatValue(property.address))}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-900 pb-20">
      
      {/* --- Simple SaaS Header --- */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-semibold text-sm">
            <ArrowLeft size={18} /> <span>Portfolio</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Status: Active</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        {/* --- Hero Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Slider: Full Responsive */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video bg-white rounded-3xl overflow-hidden border border-slate-200">
              <img 
                src={property.images?.[currentImg] ? formatValue(property.images[currentImg]) : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"} 
                className="w-full h-full object-cover"
                alt="Property"
              />
              <div className="absolute inset-x-4 bottom-4 flex justify-between items-center">
                <div className="flex gap-2 bg-white/90 backdrop-blur p-1.5 rounded-2xl border border-white/20 shadow-sm">
                  <button onClick={() => setCurrentImg(p => (p - 1 + property.images.length) % property.images.length)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeft size={18}/></button>
                  <button onClick={() => setCurrentImg(p => (p + 1) % property.images.length)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronRight size={18}/></button>
                </div>
                <div className="bg-black/50 backdrop-blur px-3 py-1.5 rounded-xl text-white text-[10px] font-bold">
                  {currentImg + 1} / {property.images?.length || 1} IMAGES
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Core Stats: Responsive Fix */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md mb-3 inline-block">Investment Asset</span>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2 leading-tight">{formatValue(property.title)}</h1>
                <p className="flex items-center gap-1.5 text-slate-400 text-sm font-medium"><MapPin size={14} /> {formatValue(property.address)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Market Price</p>
                  <p className="text-2xl font-extrabold text-slate-900">{formatValue(property.price, 'price')}</p>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Annual Yield</p>
                  <p className="text-2xl font-extrabold text-emerald-600">{formatValue(property.yield)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Info size={18}/></div>
                <h3 className="text-base font-bold text-slate-800">Property Overview</h3>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">{formatValue(property.description)}</p>
            </div>

            {/* Gallery Overview: Small Thumbnails */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Camera size={18}/></div>
                <h3 className="text-base font-bold text-slate-800">Visual Assets</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {property.images?.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImg(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentImg === idx ? 'border-indigo-500 p-0.5' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={formatValue(img)} className="w-full h-full object-cover rounded-lg" alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white p-2 rounded-3xl border border-slate-200 h-80 overflow-hidden">
               <iframe title="Map" width="100%" height="100%" className="rounded-[20px] grayscale-[0.2]" frameBorder="0" src={mapUrl} allowFullScreen></iframe>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Data Intelligence: Responsive Chart Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg text-indigo-500"><Activity size={18}/></div>
                <h3 className="text-base font-bold text-slate-800">Performance Metrics</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                    { subject: 'Yield', A: (parseFloat(property.yield) * 10) || 60 },
                    { subject: 'Growth', A: 80 },
                    { subject: 'Demand', A: 70 },
                    { subject: 'Safety', A: 90 },
                    { subject: 'EPC', A: 75 },
                  ]}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fontWeight: 700, fill: '#64748B'}} />
                    <Radar dataKey="A" stroke="#6366F1" strokeWidth={2} fill="#6366F1" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technical Data: Based on CSV Fields */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Asset Specifications</h3>
              <div className="space-y-4">
                {[
                  { label: 'Energy Class', val: property.epc, icon: <Zap size={14}/> },
                  { label: 'Council Tax', val: property.council_tax, icon: <Layers size={14}/> },
                  { label: 'Furnishing', val: property.furnishing, icon: <Globe size={14}/> },
                  { label: 'Asset Security', val: property.security || 'Verified', icon: <ShieldCheck size={14}/> },
                  { label: 'Living Area', val: `${property.sq_ft || 'N/A'} sqft`, icon: <Maximize size={14}/> }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-1">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="p-1.5 bg-slate-50 rounded-md text-slate-400">{item.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-tighter">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatValue(item.val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Bedrooms</p>
                  <div className="flex items-center justify-center gap-1.5 text-slate-800">
                    <Bed size={14} className="text-slate-400"/>
                    <span className="font-bold">{formatValue(property.bedrooms)}</span>
                  </div>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Bathrooms</p>
                  <div className="flex items-center justify-center gap-1.5 text-slate-800">
                    <Bath size={14} className="text-slate-400"/>
                    <span className="font-bold">{formatValue(property.bathrooms) || '1'}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default PropertyDetail;