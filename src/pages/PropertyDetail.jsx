import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Activity, Zap, ShieldAlert, 
  PieChart, BarChart3, Briefcase, TrendingUp, Loader2, Info,
  Globe, Layers, Bed, Bath, Maximize, ExternalLink, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

import RiskAlerts from './RiskAlerts';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImg, setCurrentImg] = useState(0);

  // টেক্সট ক্লিন করার ইউটিলিটি
  const formatText = (text) => {
    if (text === undefined || text === null || text === "null") return "N/A";
    return String(text).replace(/[\[\]"']/g, '').trim();
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // আপনার লোকালহোস্ট এবং রেন্ডার লিঙ্কের জন্য ডাইনামিক ইউআরএল
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${BACKEND_URL}/api/properties`);
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        // ১,০০০ রো থেকে সঠিক আইডি খুঁজে বের করা
        const selected = data.find(p => String(p.id) === String(id));
        
        if (selected) {
          setProperty(selected);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const nextImg = () => {
    if (property?.images?.length) {
      setCurrentImg((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImg = () => {
    if (property?.images?.length) {
      setCurrentImg((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Analyzing Asset Data...</p>
    </div>
  );

  if (!property) return (
    <div className="p-20 text-center bg-slate-50 min-h-screen flex flex-col items-center justify-center">
        <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
        <p className="font-bold text-slate-500">Asset Record Not Found in Synchronized Database.</p>
        <button onClick={() => navigate('/listings')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200">Return to Listings</button>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* 1. Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all font-bold text-xs uppercase tracking-tight"
          >
            <ArrowLeft size={16} /> Exit to Dashboard
          </button>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[10px] font-black uppercase">
                UPRN: {property.id}
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
        
        {/* 2. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Interactive Image Slider */}
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-200 aspect-video lg:aspect-square shadow-2xl border border-slate-100">
            <img 
              key={currentImg}
              src={property.images?.[currentImg] ? formatText(property.images[currentImg]) : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"} 
              alt="Property" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000";
              }}
            />
            
            {property.images?.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImg} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-blue-600 hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100">
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/40 backdrop-blur-xl rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {currentImg + 1} / {property.images.length} Perspectives
                </div>
              </>
            )}
          </div>

          {/* Right: Asset Header & Quick Stats */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div> Tier 1 Investment Grade
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                {formatText(property.title)}
              </h1>
              <p className="text-lg text-slate-500 flex items-center gap-2 font-medium">
                <MapPin size={20} className="text-blue-500" /> {formatText(property.address)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 border-y border-slate-200 py-10">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">Valuation</p>
                <p className="text-3xl font-black text-slate-900">{formatText(property.price)}</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">Beds</p>
                <div className="flex items-center justify-center gap-2 font-black text-3xl text-slate-900">
                   {formatText(property.bedrooms)}
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">EPC Rating</p>
                <div className={`text-3xl font-black ${['A', 'B'].includes(formatText(property.epc)) ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {formatText(property.epc)}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Info size={40} /></div>
              <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Asset Narrative</h4>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                {formatText(property.description)}
              </p>
            </div>

            {/* Live Map Integration */}
            <div className="h-48 rounded-[2.5rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-inner relative group">
                {property.lat && property.lng ? (
                  <iframe 
                    title="Property Location"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&hl=en&z=14&output=embed`}
                    allowFullScreen
                    className="grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                  ></iframe>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Globe size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase">Coordinates Pending Synchronization</span>
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* 3. Detailed Analytics Section */}
        <section className="pt-16 border-t border-slate-200">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Radar Chart Card */}
              <div className="w-full lg:w-1/3 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                 <h3 className="font-black text-xs uppercase tracking-widest mb-10 text-slate-800 flex items-center gap-2">
                   <Activity size={18} className="text-blue-500" /> Performance Radar
                 </h3>
                 <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'Yield', A: (parseFloat(property.yield) * 10) || 60 },
                        { subject: 'EPC', A: ['A', 'B'].includes(formatText(property.epc)) ? 95 : 45 },
                        { subject: 'Value', A: 85 },
                        { subject: 'Location', A: 90 },
                        { subject: 'Stability', A: 75 },
                      ]}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} />
                        <Radar name="Score" dataKey="A" stroke="#2563eb" strokeWidth={4} fill="#3b82f6" fillOpacity={0.1} />
                      </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Stats Cards */}
              <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div>
                      <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-6">Investment Alpha Score</h4>
                      <div className="text-7xl font-black leading-none mb-4 tabular-nums tracking-tighter">8.9<span className="text-2xl text-slate-600">/10</span></div>
                      <p className="text-slate-400 text-sm leading-relaxed">Outperforming local market benchmarks by <span className="text-emerald-400 font-black">+12.4%</span> annualized.</p>
                    </div>
                    <button className="mt-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-white transition-all group">
                      Download Market Report <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-slate-200 flex flex-col justify-between shadow-sm">
                    <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Yield</span>
                        <span className="text-2xl font-black text-slate-900">{formatText(property.yield)}%</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</span>
                        <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{formatText(property.tenure)}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Council Tax</span>
                        <span className="text-sm font-black text-slate-700 uppercase">{formatText(property.council_tax)}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Status</span>
                        <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 uppercase">Available</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
        </section>

        {/* 4. Risk Analysis Section */}
        <section className="pt-16 border-t border-slate-200">
           <RiskAlerts property={property} />
        </section>

      </main>
    </div>
  );
};

export default PropertyDetail;