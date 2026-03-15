import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  AlertCircle, 
  Search, 
  Menu, 
  X,
  Activity
} from 'lucide-react';

const SidebarItem = ({ icon, label, path, active, onClick }) => (
  <Link 
    to={path} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className={`text-[13px] font-medium tracking-tight ${active ? 'font-semibold' : ''}`}>
      {label}
    </span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <LayoutDashboard size={18} strokeWidth={2}/>, label: "Dashboard", path: "/" },
    { icon: <Search size={18} strokeWidth={2}/>, label: "Market Explorer", path: "/listings" },
    { icon: <BarChart3 size={18} strokeWidth={2}/>, label: "Market Analysis", path: "/analysis" },
    { icon: <AlertCircle size={18} strokeWidth={2}/>, label: "Risk Early Warning", path: "/risks" },
  ];

  return (
    <>
      {/* মোবাইল হেডার (শুধু ফোনে দেখাবে) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-100 px-5 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">PropheticAI</span>
        </div>
        <button onClick={toggleSidebar} className="p-1.5 text-slate-500">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ব্যাকড্রপ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* মেইন সাইডবার */}
      <aside className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* লোগো সেকশন */}
        <div className="h-16 flex items-center px-8 border-b border-slate-50 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-slate-900 leading-none">PropheticAI</h1>
              <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">DSS Platform</p>
            </div>
          </div>
        </div>
        
        {/* মেনু আইটেমসমূহ */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        {/* নিচের স্ট্যাটাস বার */}
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Live Sync</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;