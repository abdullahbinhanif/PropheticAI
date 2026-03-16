import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowUpRight, Search, 
  Database, ChevronLeft, ChevronRight, X, 
  Building2, SearchX, ShieldAlert, BarChart3,
  CheckCircle2, ListFilter
} from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 overflow-hidden rounded-2xl">
    <div className="p-5 space-y-5 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 bg-slate-100 rounded w-20" />
        <div className="h-4 bg-slate-100 rounded w-16" />
      </div>
      <div className="space-y-3">
        <div className="h-5 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-50 rounded w-full" />
      </div>
      <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
        <div className="h-9 bg-slate-50 rounded-xl w-1/2" />
        <div className="h-9 bg-slate-50 rounded-xl w-1/2" />
      </div>
    </div>
  </div>
);

const Listings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const getHighlightedText = (text, highlight) => {
    if (!highlight || !highlight.trim()) return text;
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = String(text).split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
          <mark key={i} className="bg-yellow-200 text-slate-900 px-0.5 rounded-sm font-semibold">{part}</mark> : part
        )}
      </span>
    );
  };

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        const res = await fetch(`${base_url.replace(/\/$/, '')}/api/properties`);
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Connection failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = properties.filter(p => 
    p.address?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFound = filteredData.length;
  const verifiedCount = filteredData.filter(p => calculateStability(p) > 85).length;
  const standardCount = totalFound - verifiedCount;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-10 md:pb-20 text-slate-900 font-sans selection:bg-indigo-100">
      {/* পরিবর্তন: এখানে z-50 থেকে কমিয়ে z-30 করা হয়েছে যাতে সাইডবার (z-50) এটার উপরে থাকে */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 md:z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="bg-indigo-600 p-2.5 text-white rounded-xl">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-black tracking-tight uppercase leading-none pb-0.5">
                  Prophetic<span className="text-indigo-600">Core</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <Database size={10} className="text-indigo-500" /> Dynamic Asset Intelligence
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-[480px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search assets by location or name..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13px] focus:bg-white focus:border-indigo-600 transition-all outline-none font-semibold shadow-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full cursor-pointer">
                  <X size={14} className="text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8">
        
        {/* Bordered Stats Bar */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-none">
          <div className="bg-white px-6 py-5 flex items-center gap-4">
            <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
              <ListFilter size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Index</span>
              <span className="text-xl font-black text-slate-900 leading-tight">{totalFound.toLocaleString()} Units</span>
            </div>
          </div>
          <div className="bg-white px-6 py-5 flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-500 border border-emerald-100">
              <CheckCircle2 size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Growth Assets</span>
              <span className="text-xl font-black text-slate-900 leading-tight">{verifiedCount.toLocaleString()} Verified</span>
            </div>
          </div>
          <div className="bg-white px-6 py-5 flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100">
            <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-500 border border-indigo-100">
              <BarChart3 size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Standard Yield</span>
              <span className="text-xl font-black text-slate-900 leading-tight">{standardCount.toLocaleString()} Nodes</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : currentItems.length > 0 ? (
            currentItems.map((prop, index) => {
              const stability = calculateStability(prop);
              const isVerified = stability > 85;
              const propertyId = prop.id || prop._id;

              return (
                <div key={propertyId || index} className="group bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-indigo-500 transition-all flex flex-col h-full shadow-none">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                      {prop.tenure || 'Leasehold'}
                    </span>
                    {isVerified && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-[14px] md:text-[15px] font-bold text-slate-900 leading-snug mb-3 min-h-[42px] group-hover:text-indigo-600 transition-colors">
                      {getHighlightedText(prop.title || 'Market Listing', searchTerm)}
                    </h3>
                    <div className="flex items-start gap-2 text-slate-500 mb-6">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-slate-300" />
                      <p className="text-[12px] font-medium leading-relaxed">
                        {getHighlightedText(prop.address || 'Address Hidden', searchTerm)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-5">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Value</span>
                        <p className="text-lg font-black text-slate-900">{prop.price || 'TBA'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Rating</span>
                        <p className={`text-lg font-black ${isVerified ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {stability}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => propertyId && navigate(`/risks/${propertyId}`)}
                        className="py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shadow-none"
                      >
                        <ShieldAlert size={14} /> Audit
                      </button>
                      <button 
                        onClick={() => propertyId && navigate(`/property/${propertyId}`)}
                        className="py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-none"
                      >
                        Analysis <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-3xl flex flex-col items-center text-center px-6">
              <SearchX size={48} className="text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No Assets Matching Query</h3>
              <p className="text-slate-400 text-sm mt-1">Try searching by a different postcode or keyword.</p>
              <button onClick={() => setSearchTerm('')} className="mt-6 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer">Clear Search</button>
            </div>
          )}
        </div>

        {!loading && filteredData.length > itemsPerPage && (
          <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Viewing <span className="text-slate-900">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)}</span> of {filteredData.length}
            </p>

            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-none">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0,0); }}
                disabled={currentPage === 1}
                className="p-2 hover:bg-slate-50 disabled:opacity-20 transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex px-2">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (totalPages > 5 && (p !== 1 && p !== totalPages && (p < currentPage - 1 || p > currentPage + 1))) {
                    if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="px-1 text-slate-300 self-center">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => { setCurrentPage(p); window.scrollTo(0,0); }}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-[11px] font-bold transition-all mx-0.5 cursor-pointer ${
                        currentPage === p ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0,0); }}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-slate-50 disabled:opacity-20 transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Listings;