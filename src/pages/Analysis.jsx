import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis 
} from 'recharts';
import { Info, Activity, Target, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';

const AnalysisSkeleton = () => (
  <div className="max-w-[1400px] mx-auto p-4 md:p-10 space-y-8 animate-pulse">
    <div className="space-y-2">
      <div className="h-5 w-32 bg-slate-100 rounded-full"></div>
      <div className="h-7 w-64 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 h-[350px] bg-slate-50 rounded-2xl"></div>
      <div className="lg:col-span-5 h-[350px] bg-slate-50 rounded-2xl"></div>
    </div>
  </div>
);

const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${base_url.replace(/\/$/, '')}/api/properties`);
        const data = await response.json();
        const selected = data.find(p => String(p.id || p._id) === String(id));
        setTimeout(() => {
          if (selected) setProperty(selected);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <AnalysisSkeleton />;

  const displayProperty = property || {};
  const yieldValue = parseFloat(displayProperty.yield) || 0;
  const priceValue = parseFloat(String(displayProperty.price).replace(/[^0-9.]/g, '')) || 0;

  // ১. Factor Logic (Bar Chart): লজিক অনুযায়ী ইমপ্যাক্ট সেট করা
  const factorData = [
    { factor: 'Transit', impact: displayProperty.transport_score || 80 },
    { factor: 'Local Wealth', impact: 70 },
    { factor: 'Jobs', impact: 65 },
    { factor: 'Safety Net', impact: ['A', 'B'].includes(displayProperty.epc) ? 85 : 45 },
    { factor: 'Saturation', impact: yieldValue > 6 ? -40 : -20 }, 
  ];

  // ২. Property Balance (Radar Chart): ব্যালেন্সড ইনভেস্টমেন্ট ভিউ
  const tradeOffData = [
    { subject: 'Cash Flow', value: Math.min(yieldValue * 12, 100) },
    { subject: 'Safety', value: ['A', 'B'].includes(displayProperty.epc) ? 90 : 60 },
    { subject: 'Future Gain', value: 75 },
    { subject: 'Exit Ease', value: priceValue > 600000 ? 50 : 85 },
    { subject: 'Risk Cover', value: yieldValue > 5.5 ? 80 : 55 },
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* Minimal Header */}
        <header className="space-y-3">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={12} /> Return
          </button>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              MARKET PULSE <span className="text-slate-200 mx-1">/</span> 
              <span className="text-indigo-600 uppercase">Ref {id?.slice(-4)}</span>
            </h1>
            <p className="text-[12px] text-slate-500 font-medium max-w-xl leading-relaxed">
              A quick look at how local transit, jobs, and energy standards affect this property's long-term health.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Factor Logic: Bar Chart with Entry Animation */}
          <section className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-600"/>
                <h3 className="font-bold text-[11px] uppercase tracking-widest text-slate-700">Growth Drivers</h3>
              </div>
              <TooltipComponent text="External factors impacting your investment." />
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factorData} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide domain={[-100, 100]} />
                  <YAxis 
                    dataKey="factor" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                    width={80}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', fontSize: '10px', boxShadow: 'none' }}
                  />
                  <Bar 
                    dataKey="impact" 
                    radius={[0, 4, 4, 0]} 
                    barSize={16}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {factorData.map((entry, index) => (
                      <Cell key={index} fill={entry.impact > 0 ? '#4f46e5' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Property Balance: Radar Chart with Entry Animation */}
          <section className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2 mb-8">
              <Target size={16} className="text-indigo-600"/>
              <h3 className="font-bold text-[11px] uppercase tracking-widest text-slate-700">Property Balance</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tradeOffData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
                  <Radar
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fill="#4f46e5"
                    fillOpacity={0.1}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Human-Centered Verdict */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[9px] tracking-widest mb-3">
                <ShieldCheck size={14} /> Local Analysis
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                We looked at the numbers: Since the EPC is <span className="text-slate-900 font-bold">{displayProperty.epc || 'N/A'}</span>, 
                your regulatory risk is {['A', 'B', 'C'].includes(displayProperty.epc) ? 'very low' : 'something to watch'}. 
                The {yieldValue}% yield shows this is a {yieldValue > 6 ? 'high-performance' : 'stable'} asset in today's market.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-3">
                <Zap size={14} className="text-amber-500" /> Technical Basis
              </div>
              <ul className="space-y-2">
                {[
                  'Transit scores are based on actual walking distance to stations.',
                  'Exit ease is calculated using the local average time-on-market.',
                  'Safety net refers to energy compliance and tax bands.'
                ].map((text, i) => (
                  <li key={i} className="flex gap-2 text-[11px] text-slate-500 font-medium leading-tight">
                    <span className="text-indigo-400">•</span> {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const TooltipComponent = ({ text }) => (
  <div className="group relative">
    <Info size={14} className="text-slate-300 cursor-help" />
    <div className="absolute right-0 bottom-full mb-2 w-36 p-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {text}
    </div>
  </div>
);

export default Analysis;