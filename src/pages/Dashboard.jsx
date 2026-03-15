import React from 'react';
import { Line } from 'react-chartjs-2';
import { Search, BarChart3, Zap, ArrowUpRight, Info, MapPin, TrendingDown } from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, 
  PointElement, LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const chartData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      fill: true,
      label: 'Market Price (£)',
      data: [1300000, 1250000, 1220000, 1200000, 1195000, 1199567],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.05)',
      tension: 0.4,
    }]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Investment Insights</h2>
          <p className="text-slate-500 font-medium">Real-time data from ONS & Public Housing Statistics</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-72 shadow-sm text-sm" placeholder="Search UK property markets..." />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Avg. Westminster Price</p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">£1,199,567</h3>
          <span className="text-red-500 text-xs font-bold mt-2 inline-block">-8.02% from last year</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Stability Index</p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">72/100</h3>
          <span className="text-blue-500 text-xs font-bold mt-2 inline-block">Moderate Confidence</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Yield Potential</p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">£8,346 pcm</h3>
          <span className="text-emerald-500 text-xs font-bold mt-2 inline-block">High Rental Demand</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualization Wrapper */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-blue-600"/> Price Fluctuations (12 Months)
          </h4>
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        {/* Explainability Section */}
        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10"><Zap size={150} /></div>
          <h4 className="font-bold text-xl mb-8 relative z-10">Explainable Model</h4>
          <div className="space-y-8 relative z-10">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl h-fit"><MapPin className="text-blue-400" size={20}/></div>
              <div>
                <p className="font-bold text-sm">Proximity Analysis</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Property is 0.1 miles from Temple Station. Academic research links high connectivity to lower capital risk.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl h-fit"><TrendingDown className="text-amber-400" size={20}/></div>
              <div>
                <p className="font-bold text-sm">Industry Dependency</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Local economy shows 40% concentration in Finance. Current assessment flags moderate structural risk.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg">
            View Structural Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;