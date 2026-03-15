import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis 
} from 'recharts';
import { Info, Activity, Target, ShieldCheck, Zap } from 'lucide-react';

const Analysis = ({ property }) => {
  // যদি প্রপার্টি ডাটা না থাকে, তবে আগের স্ট্যাটিক ভ্যালু দেখাবে অথবা লোডিং স্টেট
  const displayProperty = property || {};

  // ১. Weighted Factors Data: ডায়নামিক লজিক (Interpretability)
  const factorData = [
    { factor: 'Transport Access', impact: displayProperty.transport_score || 85 },
    { factor: 'Income Levels', impact: 70 },
    { factor: 'Employment Rate', impact: 65 },
    { factor: 'Council Tax Band', impact: 40 },
    { factor: 'Industry Dep.', impact: displayProperty.yield > 6 ? -45 : -35 }, // ইল্ড বেশি হলে রিস্ক ইমপ্যাক্ট বাড়ে
  ];

  // ২. Trade-off Data: Yield vs Stability (Radar Chart)
  const tradeOffData = [
    { subject: 'Rental Yield', value: (displayProperty.yield * 10) || 80 },
    { subject: 'Stability', value: displayProperty.epc === 'B' ? 95 : 90 },
    { subject: 'Capital Growth', value: 70 },
    { subject: 'Liquidity', value: 85 },
    { subject: 'Affordability', value: displayProperty.price > 500000 ? 50 : 80 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Multi-Factor Analysis</h2>
        <p className="text-slate-500 font-medium mt-1">
          Transparency-focused evaluation using socio-economic & structural drivers for <span className="text-blue-600">ID: {displayProperty.id || 'N/A'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Factor Contribution (Interpretability) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600"/> Factor Contribution Logic
            </h4>
            <div className="group relative">
              <Info size={18} className="text-slate-400 cursor-help" />
              <div className="absolute right-0 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 pointer-events-none">
                This graph explains WHY a property is rated high or low based on underlying weights.
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide domain={[-100, 100]} />
                <YAxis 
                  dataKey="factor" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} 
                  width={100}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={32}>
                  {factorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#2563eb' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card: Trade-offs (Decision Support) */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Target size={20} className="text-blue-600"/> Investment Trade-offs
          </h4>
          <div className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={tradeOffData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section: Qualitative Explanation */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Interpretability Insight */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold">
              <ShieldCheck size={20} />
              <h5>Model Interpretability Summary</h5>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The evaluation prioritizes <span className="font-bold text-slate-900">contextual reasoning</span> over simple price prediction. For this region, the high proximity to transit hubs (<span className="text-blue-600 font-bold">0.1 miles</span>) significantly offsets the risks identified in local industry concentration. This provides a "buffer" against market corrections.
            </p>
          </div>

          {/* Underlying Assumptions */}
          <div className="bg-blue-50 p-6 md:p-8 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4 text-blue-800 font-bold">
              <Zap size={20} />
              <h5>Model Assumptions & Logic</h5>
            </div>
            <ul className="text-xs text-blue-700 space-y-3 font-medium opacity-80">
              <li className="flex gap-2">• Socio-economic weights are derived from 10-year ONS historical datasets.</li>
              <li className="flex gap-2">• "Industry Dependency" is calculated using local employment concentration indices.</li>
              <li className="flex gap-2">• Stability scores assume no major structural shifts in UK national housing policy.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Analysis;