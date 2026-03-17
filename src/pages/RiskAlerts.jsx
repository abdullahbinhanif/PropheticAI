import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, X, BrainCircuit, Building2, ShieldAlert, 
  ChevronLeft, ChevronRight, AlertTriangle, 
  Target, Fingerprint, Activity, Info
} from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Dot } from 'recharts';
import Papa from 'papaparse';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-100/80 rounded-2xl ${className}`} />
);

const RiskAlerts = () => {
  const [loading, setLoading] = useState(true);
  const [riskyData, setRiskyData] = useState([]);
  const [totalParsed, setTotalParsed] = useState(0); // Under Review count
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
              setTotalParsed(results.data.length); // Total data from CSV
              
              const validPrices = results.data.map(r => parseFloat(r.price) || 0).filter(p => p > 0);
              const fleetAvg = validPrices.length > 0 ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length : 0;

              const processedItems = results.data.map((row, index) => {
                const price = parseFloat(row.price) || 0;
                const ecp = String(row.ecp || "N/A").toUpperCase();
                const uprn = row.uprn || `ASSET-${1000 + index}`;
                let riskScore = 0;
                let problemParts = [];

                // --- Business Logic Validation from CSV Row ---
                if (price > fleetAvg * 1.20) { 
                  riskScore += 45; 
                  problemParts.push("its market price is significantly higher than the fleet average"); 
                }
                if (['E', 'F', 'G'].includes(ecp)) { 
                  riskScore += 40; 
                  problemParts.push(`it holds a critically low energy rating of ${ecp}`); 
                }
                if (row.tenure?.toLowerCase().includes("lease")) {
                  riskScore += 15;
                  problemParts.push("leasehold tenure presents long-term valuation risks");
                }

                // Filtering: Only show assets that have some risk
                if (riskScore >= 35) {
                  return {
                    id: uprn,
                    name: row.title || "Unidentified Asset",
                    val: Math.round(price / 1000),
                    fullPrice: price.toLocaleString(),
                    ecp: ecp,
                    tenure: row.tenure || "Freehold",
                    riskLevel: riskScore >= 75 ? "Critical Warning" : "Attention Required",
                    score: riskScore,
                    color: riskScore >= 75 ? "#f43f5e" : "#f59e0b",
                    bgColor: riskScore >= 75 ? "bg-rose-50" : "bg-amber-50",
                    summary: problemParts.length > 0 ? problemParts.join(", and ") + "." : "data inconsistencies detected."
                  };
                }
                return null;
              }).filter(item => item !== null);
              
              setRiskyData(processedItems.sort((a, b) => b.score - a.score));
            }
            setTimeout(() => setLoading(false), 800);
          }
        });
      } catch (err) {
        setLoading(false);
      }
    };
    fetchCSVData();
  }, []);

  const filteredRisky = useMemo(() => {
    return riskyData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [riskyData, searchTerm]);

  const totalPages = Math.ceil(filteredRisky.length / itemsPerPage);
  const currentItems = filteredRisky.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderCustomDot = (props) => {
    const { cx, cy, payload } = props;
    return <Dot cx={cx} cy={cy} r={4} fill={payload.color} stroke="#fff" strokeWidth={2} style={{ cursor: 'pointer' }} />;
  };

  return (
    <div className="min-h-screen bg-[#FCFDFF] p-4 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- Top Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-500 font-bold">
              <ShieldAlert size={18} />
              <span className="text-[10px] uppercase tracking-[0.3em]">Audit Intel Terminal</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Vulnerability Scan</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Live detection of high-risk portfolio assets
            </p>
          </div>
          
          <div className="flex gap-3">
            <StatCard label="Critical Assets" value={riskyData.filter(d => d.score >= 75).length} color="text-rose-600" />
            <StatCard label="Under Review" value={totalParsed} color="text-slate-900" />
          </div>
        </div>

        {/* --- Main Dashboard Area --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Detailed Area Chart */}
          <div className="lg:col-span-2 border border-slate-100 rounded-[2rem] p-8 bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Activity size={16} /></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Value Volatility Index (k)</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input 
                  type="text" 
                  placeholder="FILTER ASSETS..."
                  className="w-full md:w-64 bg-slate-50 border border-slate-100 py-3 pl-11 pr-4 rounded-xl text-[10px] font-bold focus:outline-none focus:border-indigo-400 uppercase transition-all"
                  value={searchTerm}
                  onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                />
              </div>
            </div>
            
            <div className="h-[280px] w-full cursor-crosshair">
              {loading ? <Skeleton className="w-full h-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredRisky.slice(0, 15)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" hide />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '700', fill: '#cbd5e1'}} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      fill="url(#chartGradient)" 
                      dot={renderCustomDot}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Side Insight Panel (White Theme as requested) */}
          <div className="border border-slate-100 rounded-[2rem] p-8 bg-white flex flex-col justify-between">
             <div className="space-y-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <BrainCircuit size={24} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-black uppercase leading-tight tracking-tight text-slate-900">Audit Findings</h2>
                  <p className="text-slate-500 text-[11px] font-bold leading-relaxed uppercase tracking-wider">
                    Current system scan confirms that <span className="text-rose-600">{riskyData.filter(d => d.score >= 75).length}</span> assets within your portfolio are at high risk of valuation collapse due to non-compliance with the latest EPC regulations. 
                  </p>
                </div>
             </div>
             <div className="pt-8 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                  <Activity size={12} /> Next Sync: Automatic
                </div>
             </div>
          </div>
        </div>

        {/* --- Asset Grid --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Queue Management</h3>
            <div className="flex items-center gap-5">
               <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="text-slate-300 hover:text-slate-900 transition-all disabled:opacity-20 cursor-pointer" disabled={currentPage === 1}>
                 <ChevronLeft size={24} />
               </button>
               <span className="text-[10px] font-black text-slate-900 tabular-nums">{currentPage} / {totalPages || 1}</span>
               <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="text-slate-300 hover:text-slate-900 transition-all disabled:opacity-20 cursor-pointer" disabled={currentPage === totalPages}>
                 <ChevronRight size={24} />
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-52 w-full" />) : 
              currentItems.map((item) => (
                <div key={item.id} className="group border border-slate-100 p-7 rounded-[2rem] bg-white hover:border-slate-900 transition-all duration-300 relative">
                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg ${item.bgColor} border border-transparent`} style={{ color: item.color }}>
                      {item.riskLevel}
                    </span>
                    <span className="text-lg font-black text-slate-900 tracking-tighter">£{item.val}K</span>
                  </div>
                  
                  <h4 className="text-[13px] font-black uppercase text-slate-800 mb-5 line-clamp-1 group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                  
                  <div className="flex items-center gap-5 mb-8">
                     <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase"><Building2 size={14} /> {item.tenure}</div>
                     <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase"><Target size={14} /> EPC {item.ecp}</div>
                  </div>

                  <button 
                    onClick={() => setSelectedProperty(item)}
                    className="w-full bg-slate-50 text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all cursor-pointer"
                  >
                    Predict Investigation
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* --- Popup --- */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setSelectedProperty(null)} />
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] border border-slate-100 relative z-10 flex flex-col max-h-[95vh] overflow-hidden">
            
            <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                <Fingerprint size={18} /> Internal Asset Log: {selectedProperty.id}
              </div>
              <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors cursor-pointer">
                <X size={22} />
              </button>
            </div>
            
            <div className="p-8 md:p-10 overflow-y-auto space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase leading-tight tracking-tight">{selectedProperty.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Action Required Immediately</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 border border-slate-50 rounded-3xl bg-slate-50/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Security Score</p>
                  <p className="text-sm font-black text-slate-900">{selectedProperty.score}% Volatility</p>
                </div>
                <div className="p-5 border border-slate-100 rounded-3xl bg-slate-50/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Asset Value</p>
                  <p className="text-sm font-black text-slate-900">£{selectedProperty.fullPrice}</p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                   <h4 className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">Prediction Basis</h4>
                   <p className="text-[13px] text-slate-600 font-bold leading-relaxed uppercase">
                     This asset has been flagged because {selectedProperty.summary} Based on the current trend, we suggest a full valuation audit before the next financial cycle.
                   </p>
                 </div>
                 
                 <div className="flex items-start gap-4 p-5 border border-amber-100 rounded-2xl bg-amber-50">
                   <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-amber-800 uppercase leading-normal">
                     High risk of price adjustment in current market. Reviewing this now may prevent potential loss.
                   </p>
                 </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-white">
              <button 
                onClick={() => setSelectedProperty(null)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-600 transition-all cursor-pointer"
              >
                Exit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl text-right min-w-[120px]">
    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">{label}</p>
    <p className={`text-2xl font-black ${color} tabular-nums`}>{value}</p>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center shadow-sm">
        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{data.name}</p>
        <p className="text-xl font-black text-slate-900">£{data.val}K</p>
        <div className="mt-2 w-full h-1 rounded-full" style={{ backgroundColor: data.color }}></div>
      </div>
    );
  }
  return null;
};

export default RiskAlerts;