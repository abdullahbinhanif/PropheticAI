import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Activity, Zap, ShieldAlert, 
  PieChart, BarChart3, Briefcase, TrendingUp, Loader2, Info,
  Globe, Layers
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tradeOffData, setTradeOffData] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/properties`);
        const data = await response.json();
        const selected = data.find(p => String(p.id) === String(id) || String(p.id) === String(parseFloat(id)));
        
        if (selected) {
          setProperty(selected);
          setTradeOffData([
            { subject: 'Yield', A: 75 },
            { subject: 'Stability', A: selected.epc === 'B' ? 95 : 80 },
            { subject: 'Liquidity', A: 70 },
            { subject: 'Transport', A: 90 },
            { subject: 'Safety', A: 85 },
          ]);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Analytics...</p>
    </div>
  );

  if (!property) return <div className="p-20 text-center font-bold">Asset not found.</div>;

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-12 text-slate-900 font-sans">
      {/* Slim Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold text-xs uppercase tracking-tight"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">System Active</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* Header Section: Reduced Sizes */}
        <section className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
              <Layers size={12} /> Asset Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              {property.title}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
              <MapPin size={14} className="text-slate-400" /> {property.address}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 w-full md:w-auto">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Alpha Score</p>
              <div className="text-3xl font-black text-slate-900">8.9<span className="text-sm text-blue-500">/10</span></div>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
          </div>
        </section>

        {/* Analytics Grid: Responsive 12-column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Factor Analysis */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" /> Factor Contribution
              </h3>

              <div className="space-y-6">
                {[
                  { label: 'Market Velocity', impact: '+3.2%', val: 88, color: 'bg-blue-600' },
                  { label: 'Transport Hub', impact: '+1.5%', val: 92, color: 'bg-indigo-500' },
                  { label: 'Energy Resilience', impact: property.epc === 'B' ? '+0.8%' : '-1.2%', val: property.epc === 'B' ? 85 : 35, color: property.epc === 'B' ? 'bg-emerald-500' : 'bg-rose-500' },
                  { label: 'Liquidity Depth', impact: '+0.4%', val: 60, color: 'bg-slate-700' }
                ].map((f) => (
                  <div key={f.label} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">{f.label}</span>
                      <span className="text-[11px] font-black text-slate-900">{f.impact}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${f.color}`} style={{ width: `${f.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Alert: More compact */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden group">
               <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-amber-400 rounded-xl text-slate-900 shrink-0">
                    <Zap size={18} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Risk Advisory</h4>
                    <p className="text-sm font-medium text-slate-200 leading-snug">
                       Concentration in <span className="text-white font-bold">Finance Sector</span> exceeds 60%. Watch for vacancy fragility.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Chart & Market */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <PieChart size={16} className="text-blue-500" /> Performance Radar
              </h3>
              
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tradeOffData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                    <Radar 
                      name="Score" 
                      dataKey="A" 
                      stroke="#2563eb" 
                      strokeWidth={2} 
                      fill="#3b82f6" 
                      fillOpacity={0.1} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-50 pt-4">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Stability</p>
                  <p className="text-sm font-black text-slate-800">High</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Volatility</p>
                  <p className="text-sm font-black text-rose-500">Low</p>
                </div>
              </div>
            </div>

            {/* Industry: Compact list */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Briefcase size={14} /> Employment
                  </h4>
                  <Globe size={14} className="text-blue-500" />
               </div>
               
               <div className="space-y-4">
                  {[
                    { label: 'Banking', val: '68%', color: 'text-blue-600' },
                    { label: 'Technology', val: '12%', color: 'text-slate-700' },
                    { label: 'Services', val: '20%', color: 'text-slate-700' }
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center border-b border-slate-50 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
                      <span className={`text-sm font-black ${item.color}`}>{item.val}</span>
                    </div>
                  ))}
               </div>

               <div className="mt-6 flex gap-3 items-start">
                  <Info size={14} className="text-blue-500 mt-0.5" />
                  <p className="text-[10px] font-medium text-slate-500 italic leading-relaxed">
                    Resilient Zone: Forecasted 10-year growth remains positive.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;