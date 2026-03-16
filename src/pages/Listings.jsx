import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowUpRight, Search, Filter, 
  ShieldCheck, Loader2, Zap, BarChart3, 
  ChevronLeft, ChevronRight, LayoutGrid 
} from 'lucide-react';

// --- Skeleton Loader Component ---
const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden animate-pulse">
    <div className="h-10 bg-slate-100 w-full" />
    <div className="p-5 space-y-4">
      <div className="h-5 bg-slate-100 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-50 rounded w-full" />
        <div className="h-3 bg-slate-50 rounded w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
        <div className="h-8 bg-slate-100 rounded" />
        <div className="h-8 bg-slate-100 rounded" />
      </div>
    </div>
    <div className="h-10 bg-slate-50 w-full mt-2" />
  </div>
);

const Listings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // প্রতি পেজে ১২টি কার্ড

  // Stability Calculation Logic
  const calculateStability = (prop) => {
    let score = 75; 
    const epc = prop.epc ? String(prop.epc).toUpperCase() : 'N/A';
    if (epc.includes('B')) score += 12;
    if (epc.includes('C')) score += 5;
    const tenure = prop.tenure ? String(prop.tenure).toLowerCase() : '';
    if (tenure.includes('freehold')) score += 10;
    return Math.min(score, 99);
  };

  useEffect(() => {
    // আপনার এনভায়রনমেন্ট ভেরিয়েবল Backend_URL এখানে ব্যবহার করা হয়েছে
    const BACKEND_API = "http://127.0.0.1:5000/api/properties";
    
    fetch(BACKEND_API)
      .then((res) => res.json())
      .then((data) => {
        setProperties(Array.isArray(data) ? data : []);
        // কৃত্রিমভাবে ১ সেকেন্ড ডিলে দেওয়া হয়েছে Skeleton Loader দেখার জন্য
        setTimeout(() => setLoading(false), 800);
      })
      .catch((err) => {
        console.error("Sync Error:", err);
        setLoading(false);
      });
  }, []);

  // Filter Logic (১০০০ ডেটার মধ্যে সার্চ করার জন্য)
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

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12 text-slate-900">
      
      {/* Header & Stats */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                <LayoutGrid className="text-blue-600" size={20} /> ASSET EXPLORER
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <BarChart3 size={12} /> {filteredData.length} of {properties.length} Units Available
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search 1,000+ assets..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none w-full md:w-80 font-medium"
                />
              </div>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // লোডিং অবস্থায় ১২টি Skeleton দেখাবে
            [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            currentItems.map((prop, index) => {
              const stability = calculateStability(prop);
              return (
                <div 
                  key={prop.id || index}
                  onClick={() => navigate(`/property/${prop.id}`)}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Top Bar */}
                  <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {prop.tenure || 'Leasehold'}
                    </span>
                    {stability > 85 && (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={10} />
                        <span className="text-[9px] font-black uppercase">Prime</span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1">
                    <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {prop.title || "Residential Asset"}
                    </h3>
                    <div className="flex items-start gap-1.5 text-slate-500 mb-5">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-blue-400" />
                      <p className="text-xs font-medium leading-relaxed line-clamp-2">{prop.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valuation</p>
                        <p className="text-sm font-black text-slate-800">{prop.price}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stability</p>
                        <p className="text-sm font-black text-blue-600">{stability}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="w-full py-3.5 bg-slate-50 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                    Analysis Report <ArrowUpRight size={14} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No assets found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search terms</p>
          </div>
        )}

        {/* Improved Pagination UI */}
        {!loading && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-3">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black border border-blue-100">
                PAGE {currentPage} / {totalPages}
              </span>
            </div>

            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Listings;