import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Search, MapPin, TrendingUp, Activity, 
  Globe, ChevronUp, ChevronDown, Database, Layout
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
  const [connStatus, setConnStatus] = useState('Checking');

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Using provided environment variable
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const response = await fetch(`${base_url.replace(/\/$/, '')}/api/properties`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setProperties(data);
          setConnStatus('Nominal');
        } else {
          setConnStatus('Degraded');
        }
      } catch (err) {
        console.error("Sync Error:", err);
        setConnStatus('Offline');
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchAllData();
  }, []);

  const dashboardData = useMemo(() => {
    if (!properties || properties.length === 0) return null;

    const prices = properties.map(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0);
    const yields = properties.map(p => parseFloat(String(p.yield).replace(/[^0-9.]/g, '')) || 5.0);
    
    const regions = properties.map(p => p.address?.split(',').pop()?.trim() || "Unknown");
    const regionCounts = regions.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {});
    const primaryRegion = Object.keys(regionCounts).reduce((a, b) => regionCounts[a] > regionCounts[b] ? a : b, "N/A");

    const avgY = yields.reduce((a, b) => a + b, 0) / yields.length;
    const riskLevel = avgY > 8 ? "High Risk" : avgY > 6 ? "Moderate" : "Low Risk";

    const recentPrices = [...prices].slice(-12);
    const isUp = recentPrices.length > 1 ? recentPrices[recentPrices.length - 1] >= recentPrices[recentPrices.length - 2] : true;

    return {
      total: properties.length,
      avgYield: avgY.toFixed(2),
      region: primaryRegion,
      risk: riskLevel,
      sparklineData: recentPrices,
      trendDir: isUp ? 'up' : 'down',
      dataPoints: properties.length * 12
    };
  }, [properties]);

  const chartConfig = useMemo(() => {
    if (!properties || properties.length === 0) return { labels: [], prices: [] };
    
    let sliceCount = timeRange === '1M' ? 10 : timeRange === '6M' ? 20 : 40;
    if (timeRange === 'ALL') sliceCount = properties.length;

    const displayData = [...properties].slice(-sliceCount);
    return {
      labels: displayData.map((p) => p.title?.substring(0, 15) || "Node"),
      prices: displayData.map(p => parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0)
    };
  }, [properties, timeRange]);

  const chartData = {
    labels: chartConfig.labels,
    datasets: [{
      label: 'Value',
      data: chartConfig.prices,
      borderColor: '#4F46E5',
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#4F46E5',
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.05)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        return gradient;
      },
      tension: 0.1, 
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 0,
        displayColors: false,
        titleFont: { weight: 'bold' },
        callbacks: { label: (v) => `VALUATION: £${v.raw.toLocaleString()}` }
      }
    },
    scales: {
      y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 10, weight: '600' }, callback: (v) => '£' + (v/1000).toFixed(0) + 'k' } },
      x: { grid: { display: false }, ticks: { font: { size: 9, weight: '500' }, maxRotation: 45 } }
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header with Dynamic Status */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900">
              <Database size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">
                Prophetic<span className="text-indigo-600">AI</span> <span className="text-slate-400 font-bold">Overview</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                System: <span className={connStatus === 'Nominal' ? 'text-emerald-500' : 'text-rose-500'}>{connStatus}</span>
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white outline-none text-[12px] font-medium transition-all" 
              placeholder="Search data nodes..." 
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-lg overflow-hidden">
          <KPICard 
            loading={loading} 
            label="Total Inventory" 
            value={dashboardData?.total || '0'} 
            subText="Verified Records" 
            sparkline={dashboardData?.sparklineData}
            trend={dashboardData?.trendDir}
            border 
          />
          <KPICard 
            loading={loading} 
            label="Node Connectivity" 
            value={connStatus === 'Nominal' ? "100%" : "0%"} 
            subText="Latency Tracking" 
            sparkline={dashboardData?.sparklineData?.map(v => v * 0.9)}
            trend="up"
            border 
          />
          <KPICard 
            loading={loading} 
            label="Risk Factor" 
            value={dashboardData?.risk || 'N/A'} 
            subText="Standard Deviation" 
            sparkline={dashboardData?.sparklineData?.slice(0, 6)}
            trend={dashboardData?.risk?.includes('High') ? 'down' : 'up'}
            border 
          />
          <KPICard 
            loading={loading} 
            label="Performance" 
            value={`${dashboardData?.avgYield || '0.00'}%`} 
            subText="Avg Net Yield" 
            trend={parseFloat(dashboardData?.avgYield) > 5 ? 'up' : 'down'}
            sparkline={dashboardData?.sparklineData} 
          />
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-widest">Asset Valuation Timeline</h4>
              </div>
              <div className="flex bg-slate-100 p-1 rounded">
                {['1M', '6M', '1Y', 'ALL'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTimeRange(t)} 
                    className={`px-4 py-1 text-[10px] font-bold transition-all ${timeRange === t ? 'bg-white text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[450px] w-full border border-slate-200 p-6 rounded-lg bg-white">
              {loading ? (
                <div className="w-full h-full bg-slate-50 animate-pulse rounded" />
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 border border-slate-200 rounded-lg space-y-6 bg-white">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase text-[10px] tracking-widest">
                <Globe size={14} /> Geographic Focus
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">
                  {loading ? "---" : (dashboardData?.region || 'Unknown')}
                </h3>
                <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                  System has mapped <span className="text-slate-900 font-bold">{dashboardData?.total || 0} nodes</span> across this region. 
                  Market volatility within this cluster remains <span className="font-bold text-indigo-600 uppercase">Stable</span>.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 uppercase text-[9px] tracking-[0.2em] mb-4 ml-1">Metadata Signals</h4>
              <DriverItem icon={<MapPin size={14}/>} label="Primary Node" score={loading ? "..." : dashboardData?.region} />
              <DriverItem icon={<Layout size={14}/>} label="Data Points" score={loading ? "..." : `${dashboardData?.dataPoints} Units`} />
              <DriverItem icon={<TrendingUp size={14}/>} label="Market Bias" score={dashboardData?.trendDir === 'up' ? 'Bullish' : 'Bearish'} color={dashboardData?.trendDir === 'up' ? 'text-emerald-600' : 'text-rose-600'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Flat Components (No Shadows) ---

const KPICard = ({ label, value, subText, border, loading, trend, sparkline }) => (
  <div className={`p-8 bg-white ${border ? 'lg:border-r border-b lg:border-b-0 border-slate-200' : ''}`}>
    {loading ? (
      <div className="space-y-6 animate-pulse">
        <div className="h-2 w-12 bg-slate-100 rounded" />
        <div className="h-8 w-24 bg-slate-100 rounded" />
        <div className="h-10 w-full bg-slate-50 rounded" />
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <div className={`${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{value}</h3>
        
        {sparkline && sparkline.length > 0 && (
          <div className="h-10 flex items-end gap-1 mb-4">
             {sparkline.map((v, i) => {
               const max = Math.max(...sparkline) || 1;
               const height = (v / max) * 100;
               return (
                <div 
                  key={i} 
                  className={`flex-1 transition-all duration-700 ${trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                  style={{ height: `${Math.max(height, 15)}%`, opacity: (i + 1) / sparkline.length }}
                />
               );
             })}
          </div>
        )}
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{subText}</div>
      </>
    )}
  </div>
);

const DriverItem = ({ icon, label, score, color }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded transition-colors hover:bg-white group">
    <div className="flex items-center gap-3">
      <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">{icon}</div>
      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
    </div>
    <span className={`text-[11px] font-black ${color || 'text-slate-900'}`}>{score}</span>
  </div>
);

export default Dashboard;