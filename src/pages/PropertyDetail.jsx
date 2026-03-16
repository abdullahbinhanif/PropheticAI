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

  // ডেটা ক্লিন করার জন্য একটি ফাংশন (কোটেশন বা ব্র্যাকেট সরানোর জন্য)
  const formatText = (text) => {
    if (!text) return "N/A";
    return String(text).replace(/[\[\]"']/g, '').trim();
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/properties`);
        const data = await response.json();
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

  const nextImg = () => property?.images && setCurrentImg((prev) => (prev + 1) % property.images.length);
  const prevImg = () => property?.images && setCurrentImg((prev) => (prev - 1 + property.images.length) % property.images.length);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest italic">Scanning Dataset...</p>
    </div>
  );

  if (!property) return (
    <div className="p-20 text-center">
        <p className="font-bold text-slate-500">Asset not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold uppercase text-xs">Go Back</button>
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Interactive Image Slider */}
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-200 aspect-video lg:aspect-square shadow-2xl border border-slate-200">
            <img 
              key={currentImg}
              src={property.images?.[currentImg] ? formatText(property.images[currentImg]) : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000"} 
              alt="Property" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000";
              }}
            />
            
            {property.images?.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all z-10">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all z-10">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                  {currentImg + 1} / {property.images.length} Photos
                </div>
              </>
            )}
          </div>

          {/* Right: Asset Header & Quick Stats */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Verified Investment Grade
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                {formatText(property.title)}
              </h1>
              <p className="text-lg text-slate-500 flex items-center gap-2 font-medium">
                <MapPin size={20} className="text-blue-500" /> {formatText(property.address)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-slate-200 py-8">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Valuation</p>
                <p className="text-2xl font-black text-slate-900">{formatText(property.price)}</p>
              </div>
              <div className="text-center border-x border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Beds</p>
                <div className="flex items-center justify-center gap-2 font-black text-2xl text-slate-900">
                   <Bed size={20} className="text-blue-500" /> {formatText(property.bedrooms)}
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">EPC Rating</p>
                <div className={`text-2xl font-black ${property.epc === 'A' || property.epc === 'B' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {formatText(property.epc)}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Asset Narrative</h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{formatText(property.description)?.substring(0, 300)}..."
              </p>
            </div>

            {/* Live Map Integration */}
            <div className="h-64 rounded-[2.5rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-inner relative">
                {property.lat && property.lng ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    src={`https://maps.google.com/maps?q=${property.lat},${property.lng}&hl=es&z=14&output=embed`}
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Globe size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase">Coordinates Unavailable</span>
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* 3. Detailed Analytics Section */}
        <section className="pt-10 border-t border-slate-200">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[350px]">
                 <h3 className="font-black text-xs uppercase tracking-widest mb-8 text-slate-800 flex items-center gap-2">
                   <Activity size={18} className="text-blue-500" /> Factor Radar
                 </h3>
                 <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'Yield', A: (parseFloat(property.yield) * 10) || 60 },
                        { subject: 'EPC', A: property.epc === 'B' || property.epc === 'A' ? 90 : 40 },
                        { subject: 'Market', A: 85 },
                        { subject: 'Transport', A: 95 },
                        { subject: 'Liquidity', A: 70 },
                      ]}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}} />
                        <Radar name="Score" dataKey="A" stroke="#2563eb" strokeWidth={3} fill="#3b82f6" fillOpacity={0.15} />
                      </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl">
                    <div>
                      <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-4">Investment Alpha</h4>
                      <div className="text-5xl font-black leading-none mb-2 tabular-nums">8.9<span className="text-xl text-slate-500">/10</span></div>
                      <p className="text-slate-400 text-sm">Outperforming local average by <span className="text-emerald-400 font-bold">12.4%</span></p>
                    </div>
                    <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
                      Full Market Report <ExternalLink size={14} />
                    </button>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between shadow-sm">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Expected Yield</span>
                        <span className="text-lg font-black text-slate-900">{formatText(property.yield)}%</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Tenure</span>
                        <span className="text-sm font-bold text-slate-700">{formatText(property.tenure)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Tax Band</span>
                        <span className="text-sm font-bold text-slate-700">{formatText(property.council_tax)}</span>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
        </section>

        <section className="pt-10 border-t border-slate-200">
           <RiskAlerts property={property} />
        </section>

      </main>
    </div>
  );
};

export default PropertyDetail;