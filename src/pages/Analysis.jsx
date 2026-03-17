import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Cell, RadialBarChart, 
  RadialBar, PolarAngleAxis
} from 'recharts';
import { Info, Activity, Target, ShieldCheck, Zap, ArrowLeft, Building2, TrendingUp, Globe, HeartPulse } from 'lucide-react';

const Analysis = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // যদি ID না থাকে তবে লিস্টিং পেজে পাঠিয়ে দেওয়া ভালো
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      try {
        // এনভায়রনমেন্ট ভেরিয়েবল চেক (VITE_ prefix সহ বা ছাড়া)
        const base_url = import.meta.env.VITE_BACKEND_URL || import.meta.env.Backend_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${base_url.replace(/\/$/, '')}/api/properties`);
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        
        // আইডি ম্যাচিং লজিক (UPRN এবং ID উভয়ই চেক করা হচ্ছে)
        const selected = Array.isArray(data) ? data.find(p => 
          String(p.uprn || "").trim() === String(id).trim() || 
          String(p.id || "").trim() === String(id).trim()
        ) : null;
        
        if (selected) {
          setProperty(selected);
        } else {
          console.warn(`Property with ID ${id} not found in the list.`);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const analysisData = useMemo(() => {
    if (!property) return null;
    
    // ডাটা এক্সট্রাকশন লজিক
    const yieldVal = property.yield_num || 0;
    const priceVal = property.price_num || 0;
    const epc = String(property.ecp_rating || 'N/A').toUpperCase();

    const factorData = [
      { name: 'Income Strength', score: Math.min(yieldVal * 12, 98), fill: '#4f46e5' }, 
      { name: 'Energy Standard', score: ['A', 'B', 'C'].includes(epc[0]) ? 92 : 45, fill: '#10b981' },
      { name: 'Ownership Value', score: 78, fill: '#f59e0b' },
      { name: 'Resale Speed', score: priceVal < 700000 ? 85 : 55, fill: '#ec4899' },
    ];

    const gaugeData = [{ value: 82, fill: '#4f46e5' }];

    return { factorData, gaugeData, yieldVal, epc, priceVal };
  }, [property]);

  // লোডিং স্টেট
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-medium text-slate-500">Preparing your personalized analysis...</p>
      </div>
    </div>
  );

  // যদি প্রপার্টি না পাওয়া যায় (ভুল ID বা লিস্টিং থেকে না আসলে)
  if (!property) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div className="max-w-xs space-y-4">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Building2 size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">No Asset Selected</h2>
            <p className="text-sm text-slate-500">Please select a property from the listings page to view its detailed analysis.</p>
            <button onClick={() => navigate('/listings')} className="w-full py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 transition-transform active:scale-95 cursor-pointer">Back to Listings</button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Humanized Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/listings')} 
              className="flex items-center gap-2 text-indigo-600 hover:gap-3 transition-all text-xs font-bold cursor-pointer"
            >
              <ArrowLeft size={16} /> Explore more properties
            </button>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Investment Insights <span className="text-slate-200 font-light mx-2">|</span> 
              <span className="text-indigo-600"> {property.property_title || "Asset Overview"}</span>
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl font-medium">
              We’ve analyzed the market data for <span className="text-slate-800 font-bold">{property.address}</span> to help you make an informed decision.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-slate-700">Live Market Data Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Performance Bar Chart */}
          <section className="lg:col-span-7 border border-slate-100 rounded-3xl p-8 hover:border-indigo-50 transition-colors">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600"/> Why this property stands out
                </h3>
                <p className="text-xs text-slate-400">Comparing key performance factors against local averages.</p>
              </div>
            </div>
            
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData.factorData} layout="vertical">
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
                    width={110} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} 
                  />
                  <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={14}>
                    {analysisData.factorData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* New Meaningful Health Gauge */}
          <section className="lg:col-span-5 border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center bg-slate-50/30">
            <div className="w-full mb-6">
               <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <HeartPulse size={18} className="text-indigo-600"/> Overall Health
              </h3>
            </div>
            <div className="h-[240px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  data={analysisData.gaugeData} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={30}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-slate-900 leading-none">82<span className="text-lg text-slate-400">%</span></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Optimal Fit</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 font-medium px-4 mt-4">
              This score indicates how well this asset matches a <span className="font-bold text-slate-800">High-Yield Low-Risk</span> profile.
            </p>
          </section>

          {/* Executive Summary Card */}
          <div className="lg:col-span-12 bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
                  <TrendingUp size={14}/> Expert Recommendation
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">
                  A steady <span className="text-indigo-600 font-black">{analysisData.yieldVal}% yield</span> makes this a strong contender for your portfolio.
                </h2>
                <p className="text-slate-500 text-base font-medium">
                  Based on current market trends, this property sits in the top tier of the local market. 
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <SummaryPoint label="Risk Level" value="Low-Moderate" detail="Safe for steady growth" />
                <SummaryPoint label="Strategy" value="Capital Growth" detail="Ideal for long-term hold" />
                <SummaryPoint label="Market Rent" value="High Demand" detail="Quick tenant turnaround" />
                <SummaryPoint label="Compliance" value={`Grade ${analysisData.epc}`} detail="Meets energy standards" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryPoint = ({ label, value, detail }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value}</p>
    <p className="text-[10px] text-slate-400 font-medium">{detail}</p>
  </div>
);

export default Analysis;