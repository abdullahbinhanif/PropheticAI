import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowUpRight, Search, Filter, 
  ShieldCheck, Loader2, Zap, BarChart3, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const Listings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const calculateStability = (prop) => {
    let score = 75; 
    const epc = prop.epc ? prop.epc.toString().toUpperCase() : 'N/A';
    if (epc === 'B') score += 12;
    if (epc === 'C') score += 5;
    const tenure = prop.tenure ? prop.tenure.toLowerCase() : '';
    if (tenure.includes('freehold')) score += 10;
    return Math.min(score, 99);
  };

  useEffect(() => {
    // আপনার এনভায়রনমেন্ট ভেরিয়েবল Backend_URL এখানে ব্যবহার করা যেতে পারে
    const BACKEND_API = "http://127.0.0.1:5000/api/properties";
    fetch(BACKEND_API)
      .then((res) => res.text())
      .then((text) => {
        const cleanedText = text.replace(/NaN/g, "null");
        const data = JSON.parse(cleanedText);
        setProperties(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Sync Error:", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  const filteredData = (properties || []).filter(p => 
    p.address?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium text-sm tracking-widest uppercase">Initializing Assets...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12 text-slate-900">
      
      {/* Search & Header Section */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Explorer Core</h1>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <BarChart3 size={12} /> {properties.length} Total Records Found
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Quick search address..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none w-full md:w-64"
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-600 cursor-pointer">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Active Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((prop, index) => {
            const stability = calculateStability(prop);
            return (
              <div 
                key={prop.id || index}
                onClick={() => navigate(`/analysis/${prop.id}`)}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col cursor-pointer"
              >
                {/* Status Bar */}
                <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    {prop.tenure || 'N/A'}
                  </span>
                  {stability > 85 && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ShieldCheck size={12} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Verified Stability</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  <h3 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {prop.title}
                  </h3>
                  <div className="flex items-start gap-1.5 text-slate-500 mb-6">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <p className="text-xs font-medium leading-relaxed line-clamp-2">{prop.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valuation</p>
                      <p className="text-sm font-black text-slate-800">{prop.price}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stability</p>
                      <p className="text-sm font-black text-blue-600">{stability}%</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full py-4 bg-slate-50/50 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                  View Full Insights <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); paginate(currentPage - 1); }}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                if (i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)) {
                  return (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); paginate(i + 1); }}
                      className={`w-10 h-10 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        currentPage === i + 1 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }
                return null;
              })}
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); paginate(currentPage + 1); }}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Listings;