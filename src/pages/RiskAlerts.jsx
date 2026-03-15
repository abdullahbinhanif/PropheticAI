import React from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TrendingDown, 
  Activity, 
  Search, 
  Info,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line 
} from 'recharts';

// Instability Index Data (Sample logic for early warning)
const instabilityData = [
  { month: 'Oct', risk: 30 },
  { month: 'Nov', risk: 35 },
  { month: 'Dec', risk: 48 },
  { month: 'Jan', risk: 52 },
  { month: 'Feb', risk: 65 },
  { month: 'Mar', risk: 72 }, // Rising risk trend
];

const RiskAlerts = () => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Risk Early Warning</h2>
          <p className="text-slate-500 font-medium mt-1">Identification of structural vulnerabilities and market corrections.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
          <AlertTriangle size={18} className="text-red-500" />
          <span className="text-red-700 text-sm font-bold uppercase tracking-tight">System Status: Monitoring Instability</span>
        </div>
      </div>

      {/* Warning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Industry Concentration Risk */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Activity size={20}/></div>
            <h4 className="font-bold text-slate-900 text-[16px]">Industry Dependency</h4>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
            Finance sector concentration in Westminster reached <span className="font-bold text-slate-900">42%</span>. 
            Historical data suggests 40%+ dependency increases correction sensitivity.
          </p>
          <div className="flex items-center justify-between text-xs font-bold py-2 border-t border-slate-100">
            <span className="text-slate-400">RISK LEVEL</span>
            <span className="text-amber-600 uppercase">Moderate Vulnerability</span>
          </div>
        </div>

        {/* Demand Fragility Index */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown size={20}/></div>
            <h4 className="font-bold text-slate-900 text-[16px]">Demand Fragility</h4>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
            Rental enquiries dropped by <span className="font-bold text-slate-900">12.4%</span> in Q1. 
            Divergence between listing volume and active interest detected.
          </p>
          <div className="flex items-center justify-between text-xs font-bold py-2 border-t border-slate-100">
            <span className="text-slate-400">RISK LEVEL</span>
            <span className="text-red-600 uppercase">Elevated Risk</span>
          </div>
        </div>

        {/* Instability Prediction Logic */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={18} className="text-blue-400" />
            <h4 className="text-white font-bold text-[15px]">Explainable Warning Logic</h4>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            "The system flags Westminster not due to price alone, but due to the <span className="text-blue-400 font-bold">divergence</span> between local income growth and capital appreciation rates."
          </p>
          <button className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
            Full Logic Breakdown
          </button>
        </div>
      </div>

      {/* Instability Chart Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="font-bold text-slate-900 text-[18px]">Market Instability Index</h4>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold">Simulated Early Warning Signal (6-Month Horizon)</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> RISK TREND</div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={instabilityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#ef4444', strokeWidth: 0 }} 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Instability Explanation */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
        <div className="flex gap-4">
          <Info className="text-slate-400 shrink-0" size={20} />
          <div className="space-y-2">
            <p className="text-[13px] font-bold text-slate-800">Why prioritized over prediction?</p>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Academic literature suggests property market corrections are often preceded by structural fragility rather than sudden price drops. 
              This system monitors <span className="font-bold italic">patterns</span> that historically correlate with market instability, 
              providing users with an interpretable reason to exercise caution.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RiskAlerts;