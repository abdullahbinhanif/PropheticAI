import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TrendingDown, 
  Activity, 
  Info
} from 'lucide-react';
import { 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis 
} from 'recharts';
import Papa from 'papaparse';

// --- Skeleton Loader Component ---
const FullPageSkeleton = () => (
  <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse p-4">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-3">
        <div className="h-9 bg-slate-200 rounded-lg w-72"></div>
        <div className="h-4 bg-slate-100 rounded-md w-96"></div>
      </div>
      <div className="h-10 bg-slate-100 rounded-xl w-56"></div>
    </div>

    {/* Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-56 bg-white border border-slate-100 rounded-3xl p-6 space-y-5">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
            <div className="h-6 bg-slate-100 rounded w-40 mt-2"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-slate-50 rounded w-full"></div>
            <div className="h-3 bg-slate-50 rounded w-full"></div>
            <div className="h-3 bg-slate-50 rounded w-4/5"></div>
          </div>
          <div className="pt-4 border-t border-slate-50 flex justify-between">
             <div className="h-3 bg-slate-50 rounded w-16"></div>
             <div className="h-3 bg-slate-50 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Chart Skeleton */}
    <div className="bg-white border border-slate-100 rounded-3xl p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 rounded w-64"></div>
          <div className="h-3 bg-slate-100 rounded w-48"></div>
        </div>
        <div className="h-8 bg-slate-50 rounded-full w-32"></div>
      </div>
      <div className="w-full h-[300px] bg-slate-50/50 rounded-2xl border border-slate-50 border-dashed flex items-end p-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 bg-slate-100/50 rounded-t-lg" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
          ))}
      </div>
    </div>

    {/* Info Box Skeleton */}
    <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100"></div>
  </div>
);

const RiskAlerts = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const defaultData = [
    { month: 'Oct', risk: 30 },
    { month: 'Nov', risk: 35 },
    { month: 'Dec', risk: 48 },
    { month: 'Jan', risk: 52 },
    { month: 'Feb', risk: 65 },
    { month: 'Mar', risk: 72 },
  ];

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const csvPath = `${base_url.replace(/\/$/, '')}/api/risk-data-csv`;

        const response = await fetch(csvPath);
        if (!response.ok) throw new Error('Network error');

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              const formatted = results.data
                .filter(row => row.month && row.risk !== undefined)
                .map(row => ({
                  month: String(row.month),
                  risk: Number(row.risk)
                }));
              setChartData(formatted.length > 0 ? formatted : defaultData);
            } else {
              setChartData(defaultData);
            }
            // ডেটা আসার পর ১ সেকেন্ড দেরি করে লোডার অফ হবে যাতে এনিমেশনটা বোঝা যায়
            setTimeout(() => setLoading(false), 800);
          },
          error: () => {
            setChartData(defaultData);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Fetch Error:", err);
        setChartData(defaultData);
        setLoading(false);
      }
    };

    fetchCSVData();
  }, []);

  if (loading) return <FullPageSkeleton />;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Risk Early Warning</h2>
          <p className="text-slate-500 font-medium mt-1">Identification of structural vulnerabilities and market corrections.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl">
          <AlertTriangle size={18} className="text-red-500" />
          <span className="text-red-700 text-[11px] font-bold uppercase tracking-tight">System Status: Monitoring Instability</span>
        </div>
      </div>

      {/* Warning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Activity size={20}/></div>
            <h4 className="font-bold text-slate-900 text-[16px]">Industry Dependency</h4>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
            Finance sector concentration reached <span className="font-bold text-slate-900">42%</span>. 
            Dependency over 40% increases correction sensitivity.
          </p>
          <div className="flex items-center justify-between text-[10px] font-bold py-2 border-t border-slate-100">
            <span className="text-slate-400 uppercase tracking-widest">Risk Level</span>
            <span className="text-amber-600 uppercase">Moderate Vulnerability</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-red-200 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg text-red-600"><TrendingDown size={20}/></div>
            <h4 className="font-bold text-slate-900 text-[16px]">Demand Fragility</h4>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
            Rental enquiries dropped by <span className="font-bold text-slate-900">12.4%</span> in Q1. 
            Listing volume and active interest divergence detected.
          </p>
          <div className="flex items-center justify-between text-[10px] font-bold py-2 border-t border-slate-100">
            <span className="text-slate-400 uppercase tracking-widest">Risk Level</span>
            <span className="text-red-600 uppercase">Elevated Risk</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={18} className="text-blue-400" />
            <h4 className="text-white font-bold text-[15px]">Explainable Warning Logic</h4>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            "The system flags divergence between local income growth and capital appreciation rates."
          </p>
          <button className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 border-none outline-none">
            Full Logic Breakdown
          </button>
        </div>
      </div>

      {/* Instability Chart Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-[18px]">Market Instability Index</h4>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Early Warning Signal Output</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> 
              LIVE CSV STREAM
            </div>
          </div>
        </div>
        
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} 
                dy={10}
              />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip 
                cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid #f1f5f9', 
                  boxShadow: 'none',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#fff', stroke: '#ef4444', strokeWidth: 3 }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={1500}
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
            <p className="text-[13px] font-bold text-slate-800">Interpretation Note</p>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              This system monitors <span className="font-bold italic">patterns</span> from CSV datasets that historically correlate with market instability.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RiskAlerts;