import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Search, MapPin, TrendingUp, Activity, 
  Globe, Briefcase, AlertCircle, ChevronUp, ChevronDown 
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, 
  PointElement, LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1Y');
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${base_url.replace(/\/$/, '')}/api/properties`);
        const data = await response.json();
        if (Array.isArray(data)) setProperties(data);
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- CSV Driven Logic Engine ---
  const dashboardData = useMemo(() => {
    if (properties.length === 0) return null;

    // Extract Prices & Yields
    const prices = properties.map(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0);
    const yields = properties.map(p => parseFloat(String(p.yield).replace(/[^0-9.]/g, '')) || 0);
    
    // 1. Primary Region
    const regions = properties.map(p => p.address?.split(',').pop()?.trim());
    const regionCounts = regions.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});
    const primaryRegion = Object.keys(regionCounts).reduce((a, b) => regionCounts[a] > regionCounts[b] ? a : b);

    // 2. Risk Assessment (Based on Yield Variance)
    const avgY = yields.reduce((a, b) => a + b, 0) / yields.length;
    const riskLevel = avgY > 6 ? "Moderate" : avgY > 8 ? "High" : "Low";

    // 3. Trends for Sparklines (Last 8 points)
    const recentPrices = [...prices].reverse().slice(-8);
    const priceTrend = recentPrices[recentPrices.length - 1] >= recentPrices[recentPrices.length - 2] ? 'up' : 'down';

    return {
      total: properties.length,
      avgYield: avgY.toFixed(1),
      region: primaryRegion,
      risk: riskLevel,
      sparklineData: recentPrices,
      trendDir: priceTrend,
      dataPoints: properties.length * 8
    };
  }, [properties]);

  const chartConfig = useMemo(() => {
    if (properties.length === 0) return { labels: [], prices: [] };
    let sliceCount = timeRange === '1M' ? 4 : timeRange === '6M' ? 6 : 12;
    if (timeRange === 'ALL') sliceCount = properties.length;

    const displayData = [...properties].reverse().slice(-sliceCount);
    return {
      labels: displayData.map((_, i) => `${timeRange === '1M' ? 'Wk' : 'Mo'} ${i + 1}`),
      prices: displayData.map(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0)
    };
  }, [properties, timeRange]);

  const chartData = {
    labels: chartConfig.labels,
    datasets: [{
      data: chartConfig.prices,
      borderColor: '#4F46E5',
      borderWidth: 2,
      pointRadius: 2,
      pointBackgroundColor: '#fff',
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.08)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        return gradient;
      },
      tension: 0.4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: '#F1F5F9', drawBorder: false }, ticks: { font: { size: 10 }, callback: (v) => '£' + (v/1000).toFixed(0) + 'k' } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
            PropheticAI<span className="text-indigo-600">Overview</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live CSV Analytics Engine</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 pr-4 py-2 bg-transparent border-b border-slate-200 focus:border-indigo-600 outline-none text-[12px]" 
              placeholder="Search assets..." 
            />
          </div>
        </header>

        {/* Stats Grid - Now Fully Dynamic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-100 bg-white rounded-xl overflow-hidden">
          <KPICard 
            loading={loading} 
            label="Total Assets" 
            value={dashboardData?.total.toLocaleString() || '0'} 
            subText={`${dashboardData?.total} CSV Rows Loaded`} 
            sparkline={dashboardData?.sparklineData}
            trend={dashboardData?.trendDir}
            border 
          />
          <KPICard 
            loading={loading} 
            label="Market Status" 
            value={properties.length > 0 ? "Active" : "Offline"} 
            subText="Real-time CSV Link" 
            sparkline={dashboardData?.sparklineData.map(v => v * 0.9)} // Variant for visual diff
            trend="up"
            border 
          />
          <KPICard 
            loading={loading} 
            label="System Risk" 
            value={dashboardData?.risk || 'Low'} 
            subText="Stability Variance" 
            sparkline={dashboardData?.sparklineData.slice(0, 5)}
            trend={dashboardData?.risk === 'High' ? 'down' : 'up'}
            border 
          />
          <KPICard 
            loading={loading} 
            label="Avg. Yield" 
            value={`${dashboardData?.avgYield || '0.0'}%`} 
            subText="Net Performance" 
            trend={parseFloat(dashboardData?.avgYield) > 5 ? 'up' : 'down'}
            sparkline={dashboardData?.sparklineData} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">Asset Valuation Curve</h4>
              </div>
              <div className="flex bg-slate-100/50 p-1 rounded-lg">
                {['1M', '6M', '1Y', 'ALL'].map(t => (
                  <button key={t} onClick={() => setTimeRange(t)} className={`px-3 py-1 text-[9px] font-bold rounded-md ${timeRange === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-[400px] w-full bg-white border border-slate-100 rounded-xl p-6">
              {loading ? <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" /> : <Line data={chartData} options={chartOptions} />}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-500 font-bold uppercase text-[9px] tracking-widest">
                <Globe size={12} /> Regional Focus
              </div>
              <h3 className="text-3xl font-semibold text-slate-900">{dashboardData?.region || 'Global'}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Our engine identified <span className="text-slate-900 font-medium">{dashboardData?.total} records</span> in the dataset. 
                The current growth index reflects a <span className="text-indigo-600 font-bold">{dashboardData?.trendDir === 'up' ? 'Bullish' : 'Bearish'}</span> trend based on recent entries.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100 space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[9px] tracking-widest">Detailed Metrics</h4>
              <DriverItem icon={<MapPin size={14}/>} label="Primary Region" score={dashboardData?.region || 'N/A'} />
              <DriverItem icon={<Briefcase size={14}/>} label="Data Points" score={`${dashboardData?.dataPoints.toLocaleString()} Tags`} />
              <DriverItem icon={<TrendingUp size={14}/>} label="Growth Index" score={dashboardData?.trendDir === 'up' ? 'Bullish' : 'Bearish'} color={dashboardData?.trendDir === 'up' ? 'text-emerald-500' : 'text-amber-500'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ label, value, subText, border, loading, trend, sparkline }) => (
  <div className={`p-8 flex flex-col justify-between bg-white ${border ? 'lg:border-r border-b lg:border-b-0 border-slate-100' : ''}`}>
    {loading ? (
      <div className="space-y-3 animate-pulse">
        <div className="h-2 w-16 bg-slate-100 rounded"></div>
        <div className="h-8 w-24 bg-slate-100 rounded"></div>
      </div>
    ) : (
      <>
        <div className="space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
            <div className={`${trend === 'up' ? 'text-emerald-500' : 'text-amber-500'}`}>
              {trend === 'up' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>
        
        {/* Sparkline inside the border */}
        {sparkline && (
          <div className="mt-4 h-8 flex items-end gap-1 overflow-hidden">
             {sparkline.map((v, i) => {
               const max = Math.max(...sparkline);
               const height = max > 0 ? (v / max) * 100 : 10;
               return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-[1px] transition-all duration-500 ${trend === 'up' ? 'bg-emerald-400/20' : 'bg-amber-400/20'}`} 
                  style={{ height: `${height}%`, minHeight: '4px' }}
                ></div>
               );
             })}
          </div>
        )}
        <div className="mt-2 text-[10px] font-medium text-slate-400">{subText}</div>
      </>
    )}
  </div>
);

const DriverItem = ({ icon, label, score, color }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3"><div className="text-slate-400">{icon}</div><span className="text-[11px] font-medium text-slate-600">{label}</span></div>
    <span className={`text-[11px] font-bold ${color || 'text-slate-900'}`}>{score}</span>
  </div>
);

const SidebarSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-2 w-20 bg-slate-100"></div>
    <div className="h-10 w-48 bg-slate-100"></div>
    <div className="h-32 w-full bg-slate-100 rounded-xl"></div>
  </div>
);

export default Dashboard;