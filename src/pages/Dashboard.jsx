import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Search, MapPin, TrendingUp, Activity, 
  Globe, Briefcase 
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

  // CSV Data logic
  const marketData = useMemo(() => {
    const dataMap = {
      '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], prices: [1185000, 1192000, 1198000, 1199567] },
      '6M': { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], prices: [1260000, 1230000, 1250000, 1220000, 1210000, 1199567] },
      '1Y': { labels: ['Apr', 'Jun', 'Aug', 'Oct', 'Dec', 'Mar'], prices: [1360000, 1320000, 1290000, 1260000, 1220000, 1199567] },
      'ALL': { labels: ['2022', '2023', '2024', '2025', '2026'], prices: [950000, 1120000, 1280000, 1350000, 1199567] },
    };
    return dataMap[timeRange];
  }, [timeRange]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Graph Theme & Logic
  const chartData = {
    labels: marketData.labels,
    datasets: [{
      data: marketData.prices,
      borderColor: '#4F46E5',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#FFF',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#4F46E5',
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        return gradient;
      },
      tension: 0.3,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        callbacks: { label: (c) => ` £${c.raw.toLocaleString()}` }
      }
    },
    scales: {
      y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 }, callback: (v) => '£' + (v/1000).toFixed(0) + 'k' } },
      x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' } } }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE] p-4 md:p-8 lg:p-12 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto space-y-8 md:space-y-12">
        
        {/* Header - Optimized for All Devices */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Market <span className="text-indigo-600">Overview</span>
            </h1>
            <p className="text-[12px] font-medium text-slate-500">Institutional-grade property analysis and stability.</p>
          </div>
          
          <div className="relative w-full sm:w-72 lg:w-96">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none text-[13px] font-medium transition-all" 
              placeholder="Search area..." 
            />
          </div>
        </header>

        {/* Stats Grid - Border Based (Flat Design) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-100 bg-white rounded-3xl overflow-hidden">
          <KPICard loading={loading} label="Current Value" value="£1,199,567" subText="Steady Baseline" border />
          <KPICard loading={loading} label="Performance" value="A+" subText="High Growth" border />
          <KPICard loading={loading} label="Market Risk" value="Low" subText="Safe Zone" border />
          <KPICard loading={loading} label="Expected Yield" value="5.8%" subText="Yearly Return" />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Main Pricing Section - Column Focus */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Activity size={18} />
                </div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Pricing Trends</h4>
              </div>
              
              {!loading && (
                <div className="flex bg-slate-50 p-1 rounded-xl self-start sm:self-auto">
                  {['1M', '6M', '1Y', 'ALL'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setTimeRange(t)}
                      className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timeRange === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Graph Container */}
            <div className="h-[300px] md:h-[400px] w-full bg-white border border-slate-50 rounded-3xl p-4 md:p-6">
              {loading ? (
                <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl"></div>
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-4 flex flex-col space-y-10">
            {loading ? (
              <SidebarSkeleton />
            ) : (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold uppercase text-[10px] tracking-widest">
                    <Globe size={14} /> Core Market
                  </div>
                  <h3 className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">Westminster</h3>
                  <p className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">Premium Grade</p>
                  <p className="text-[15px] text-slate-500 leading-relaxed font-normal pt-2">
                    Analysis shows <span className="text-slate-900 font-semibold">exceptional capital safety</span>. Location advantage near Tier-1 infrastructure ensures low volatility.
                  </p>
                </div>

                {/* Key Driver List - Clean Columns */}
                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Key Growth Drivers</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <DriverItem icon={<MapPin size={16}/>} label="Public Transport" score="0.1 mi" />
                    <DriverItem icon={<Briefcase size={16}/>} label="Nearby Jobs" score="Very High" />
                    <DriverItem icon={<TrendingUp size={16}/>} label="Demand Score" score="9.8/10" />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const KPICard = ({ label, value, subText, status, border, loading }) => (
  <div className={`p-6 md:p-8 flex flex-col justify-between bg-white ${border ? 'border-r border-b lg:border-b-0 border-slate-100' : ''} ${!border && 'border-b sm:border-b-0 border-slate-100'}`}>
    {loading ? (
      <div className="space-y-3 animate-pulse">
        <div className="h-2 w-12 bg-slate-100 rounded"></div>
        <div className="h-6 w-20 bg-slate-100 rounded"></div>
      </div>
    ) : (
      <>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`mt-4 text-[10px] font-semibold uppercase tracking-wider ${status === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
          {subText}
        </div>
      </>
    )}
  </div>
);

const DriverItem = ({ icon, label, score }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-50 hover:border-indigo-100 transition-all">
    <div className="flex items-center gap-4">
      <div className="text-slate-400">
        {icon}
      </div>
      <span className="text-[13px] font-medium text-slate-600">{label}</span>
    </div>
    <span className="text-[13px] font-bold text-slate-900">{score}</span>
  </div>
);

const SidebarSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-2 w-20 bg-slate-100 rounded"></div>
    <div className="h-10 w-40 bg-slate-100 rounded"></div>
    <div className="h-20 w-full bg-slate-50 rounded-2xl"></div>
    <div className="pt-8 space-y-4">
      <div className="h-12 w-full bg-slate-50 rounded-xl"></div>
      <div className="h-12 w-full bg-slate-50 rounded-xl"></div>
    </div>
  </div>
);

export default Dashboard;