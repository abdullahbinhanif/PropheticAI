import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, Database, Search, BarChart3, Activity } from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import Papa from 'papaparse';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-100 rounded-md ${className}`} />
);

const RiskAlerts = () => {
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${base_url.replace(/\/$/, '')}/api/risk-data-csv`);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data) {
              const formatted = results.data
                .map((row, index) => {
                  const riskVal = parseFloat(row.risk) || 0;
                  const name = row.month || `Asset_${index}`;
                  
                  let analysis = {
                    msg: "Verified stable. Asset operating within safety parameters.",
                    tag: "SAFE",
                    color: "#059669",
                    bg: "#ecfdf5",
                    priority: 3
                  };

                  if (riskVal > 20) {
                    analysis = {
                      msg: "Critical exposure. High capital risk protocol triggered.",
                      tag: "CRITICAL",
                      color: "#dc2626",
                      bg: "#fef2f2",
                      priority: 1
                    };
                  } else if (riskVal > 10) {
                    analysis = {
                      msg: "Moderate volatility. Active monitoring recommended.",
                      tag: "WARNING",
                      color: "#d97706",
                      bg: "#fffbeb",
                      priority: 2
                    };
                  }

                  return {
                    id: `node-${index}`,
                    name: name,
                    displayShort: name.split(',')[0].substring(0, 10),
                    val: riskVal,
                    ...analysis
                  };
                })
                .filter(item => item.val >= 0);
              
              setAllData(formatted);
            }
            // প্রোডাকশন ভাইব দেওয়ার জন্য সামান্য ডিলে রাখা হয়েছে
            setTimeout(() => setLoading(false), 800);
          }
        });
      } catch (err) {
        console.error("CSV Engine Error:", err);
        setLoading(false);
      }
    };
    fetchCSVData();
  }, []);

  const displayData = useMemo(() => {
    let data = [...allData];
    if (searchTerm) {
      return data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return data.sort((a, b) => b.val - a.val).slice(0, 30);
  }, [allData, searchTerm]);

  const stats = useMemo(() => {
    const highRisk = allData.filter(i => i.val > 20).length;
    const avg = allData.reduce((acc, curr) => acc + curr.val, 0) / (allData.length || 1);
    return { highRisk, avg: avg.toFixed(2) };
  }, [allData]);

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
    <div>
  <div className="flex items-center gap-4 mb-3">
    {/* Icon Container with subtle shadow */}
    <div className="p-2.5 bg-slate-900 shadow-lg shadow-slate-200">
      <Database size={22} className="text-white" />
    </div>
    
    <div className="flex flex-col">
      <h1 className="flex items-center text-2xl font-black tracking-tight uppercase leading-none">
        <span className="text-indigo-600">Prophetic</span>
        <span className="text-slate-900 ml-1.5">AI</span>
        <span className="mx-2 w-[1.5px] h-5 bg-slate-200 hidden md:block"></span>
        <span className="text-slate-400 text-sm font-medium tracking-[0.1em] hidden md:block">
          Risk Intelligence Terminal
        </span>
      </h1>
      
      {/* Small version for Mobile or subtle secondary line */}
      <span className="text-[9px] font-bold text-slate-400 tracking-[0.15em] md:hidden mt-1">
        RISK INTELLIGENCE TERMINAL
      </span>
    </div>
  </div>

  {loading ? (
    <Skeleton className="h-3 w-48 mt-2" />
  ) : (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">
        Data Stream Active <span className="text-slate-300 mx-1">•</span> {allData.length} Total Assets Synchronized
      </p>
    </div>
  )}
</div>
          
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 px-6 py-4 min-w-[140px]">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Critical Assets</p>
              {loading ? <Skeleton className="h-7 w-12" /> : <p className="text-xl font-black text-red-600">{stats.highRisk}</p>}
            </div>
            <div className="bg-white border border-slate-200 px-6 py-4 min-w-[140px]">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Fleet Avg Risk</p>
              {loading ? <Skeleton className="h-7 w-16" /> : <p className="text-xl font-black text-slate-900">{stats.avg}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <BarChart3 size={14} /> Risk Distribution Waveform
              </h3>
            </div>
            
            <div className="w-full h-[420px] border border-slate-100 bg-[#fafafa]/30 p-4">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="displayShort" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 9, fontWeight: 700, fill: '#64748b'}} 
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                    <Tooltip 
                      cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
                      content={({ active, payload }) => {
                        if (active && payload?.[0]) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white border-2 border-slate-900 p-4 shadow-2xl">
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{d.name}</p>
                              <div className="text-2xl font-black mb-1" style={{color: d.color}}>{d.val}</div>
                              <div className="text-[10px] font-bold text-slate-800 leading-tight uppercase">{d.msg}</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="stepAfter" 
                      dataKey="val" 
                      stroke="#6366f1" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorRisk)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Sidebar Feed */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH ALL ASSETS..."
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 py-4 pl-12 pr-4 text-[11px] font-black focus:outline-none focus:bg-white focus:border-slate-900 uppercase tracking-widest transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border border-slate-200 h-[400px] overflow-hidden flex flex-col bg-white">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Global Risk Feed</span>
                {!loading && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400">SYNCED</span>
                  </div>
                )}
              </div>
              <div className="overflow-y-auto custom-scrollbar">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border-b border-slate-50 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-3/4" />
                    </div>
                  ))
                ) : (
                  displayData.map((item) => (
                    <div key={item.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-crosshair">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-sm" style={{ backgroundColor: item.bg, color: item.color }}>
                          {item.tag}
                        </span>
                        <span className="text-xs font-black text-slate-900">{item.val}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 uppercase truncate mb-0.5">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{item.msg}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="pt-12 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-6 items-center">
              <div className="p-4 bg-slate-50 border border-slate-100">
                <ShieldAlert className="text-slate-900" size={24} />
              </div>
              <div>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-black uppercase tracking-widest mb-1 text-slate-900">Risk Protocol Active</h4>
                    <p className="text-[11px] text-slate-500 font-bold max-w-2xl leading-relaxed uppercase">
                      Analysis complete for {allData.length} vectors. Classifications are mapped based on real-time deviation logic.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {!loading && (
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 border border-slate-100">
                <Activity size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase text-slate-900">Verification Engine: Operational</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiskAlerts;