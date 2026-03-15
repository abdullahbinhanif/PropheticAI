import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, AlertCircle, Zap } from 'lucide-react';

const SidebarItem = ({ icon, label, path, active }) => (
  <Link to={path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
    active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-100'
  }`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 fixed h-full z-20">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">
          Prophetic<span className="text-blue-600">AI</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">
          Explainable Decision Support
        </p>
      </div>
      
      <nav className="flex-1 space-y-2">
        <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" path="/" active={location.pathname === '/'} />
        <SidebarItem icon={<BarChart3 size={20}/>} label="Market Analysis" path="/analysis" active={location.pathname === '/analysis'} />
        <SidebarItem icon={<AlertCircle size={20}/>} label="Risk Early Warning" path="/risks" active={location.pathname === '/risks'} />
      </nav>

      <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-tighter">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          System Live
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;