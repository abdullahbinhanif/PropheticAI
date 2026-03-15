import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Search, BarChart3, Zap, MapPin, 
  TrendingDown, Info, ArrowUpRight 
} from 'lucide-react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, 
  PointElement, LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Reusable Stat Card Component (Clean Design)
const StatCard = ({ label, value, subValue, subColor }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between h-full">
    <div>
      <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{value}</h3>
    </div>
    <div className={`mt-4 text-[13px] font-bold ${subColor}`}>
      {subValue}
    </div>
  </div>
);

const Dashboard = () => {
  const chartData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      fill: true,
      label: 'Market Price (£)',
      data: [1300000, 1250000, 1220000, 1200000, 1195000, 1199567],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.03)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#2563eb'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { display: false }, border: { display: false } },
      x: { grid: { display: false }, border: { display: false } }
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Investment Insights</h2>
          <p className="text-slate-500 font-medium mt-1">Socio-economic housing evaluation for UK regions</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all" 
            placeholder="Search UK property markets..." 
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Avg. Westminster Price" 
          value="£1,199,567" 
          subValue="↓ 8.02% from last year" 
          subColor="text-red-500"
        />
        <StatCard 
          label="Stability Index" 
          value="72 / 100" 
          subValue="Moderate Confidence" 
          subColor="text-blue-600"
        />
        <StatCard 
          label="Yield Potential" 
          value="£8,346 pcm" 
          subValue="High Rental Demand" 
          subColor="text-emerald-600"
        />
      </div>

      {/* Main Content: Chart & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Market Visualization */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600"/> Price Fluctuations (12 Months)
            </h4>
            <div className="p-2 bg-slate-50 rounded-lg cursor-pointer">
              <Info size={16} className="text-slate-400" />
            </div>
          </div>
          <div className="h-[300px] md:h-full min-h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Explainability Section - Light Theme Clean Design */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Zap size={20} className="text-blue-600" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">Explainable Model</h4>
            </div>

            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="mt-1"><MapPin className="text-blue-500" size={20}/></div>
                <div>
                  <p className="font-bold text-[14px] text-slate-900 uppercase tracking-tight">Proximity Analysis</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Property is <span className="font-bold text-slate-700">0.1 miles</span> from Temple Station. 
                    High connectivity is historically linked to lower capital risk in Central London.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1"><TrendingDown className="text-amber-500" size={20}/></div>
                <div>
                  <p className="font-bold text-[14px] text-slate-900 uppercase tracking-tight">Industry Dependency</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Local economy shows <span className="font-bold text-slate-700">40% concentration</span> in Finance. 
                    This high dependency flags a moderate structural risk for long-term stability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-xl font-bold text-[14px] hover:bg-blue-600 transition-all active:scale-[0.98]">
            View Structural Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;