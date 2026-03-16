import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowUpRight, Search, 
  ShieldCheck, Database, 
  ChevronLeft, ChevronRight, X, Building2, SearchX
} from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-40 bg-slate-50 w-full" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-slate-100 rounded w-3/4" />
      <div className="h-3 bg-slate-50 rounded w-full" />
      <div className="pt-4 border-t border-slate-50 flex justify-between">
        <div className="h-8 bg-slate-50 rounded w-20" />
        <div className="h-8 bg-slate-50 rounded w-20" />
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
    if (!highlight.trim()) return text;
    const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
          <mark key={i} className="bg-yellow-200 text-black px-0.5 rounded-sm">{part}</mark> : part
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
    const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
    const API_ENDPOINT = `${base_url.replace(/\/$/, '')}/api/properties`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINT);
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

  const verifiedCount = filteredData.filter(p => calculateStability(p) > 85).length;
  const standardCount = filteredData.length - verifiedCount;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-20 text-slate-900 font-sans selection:bg-blue-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-2 text-white">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase">Prophetic Core</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <Database size={10} className="text-blue-500" /> Live Data Stream
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-[500px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Find by postcode, street or title..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-sm focus:bg-white focus:border-slate-900 transition-all outline-none font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full cursor-pointer"
                >
                  <X size={16} className="text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 mt-10">
        {!loading && (
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="border border-slate-200 bg-white px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] font-black uppercase text-slate-400">Total Found</span>
              <span className="text-sm font-bold">{filteredData.length}</span>
            </div>
            <div className="border border-slate-200 bg-white px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-black uppercase text-slate-400">Verified</span>
              <span className="text-sm font-bold text-emerald-600">{verifiedCount}</span>
            </div>
            <div className="border border-slate-200 bg-white px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-black uppercase text-slate-400">Standard</span>
              <span className="text-sm font-bold text-blue-600">{standardCount}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : currentItems.length > 0 ? (
            currentItems.map((prop, index) => {
              const stability = calculateStability(prop);
              const isVerified = stability > 85;

              return (
                <div 
                  key={prop.id || index}
                  className="group bg-white border border-slate-200 p-6 transition-all flex flex-col h-full hover:border-slate-900"
                >
                  <div className="mb-6 flex items-start justify-between gap-2">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 whitespace-nowrap border border-slate-100">
                      {prop.tenure || 'Leasehold'}
                    </span>
                    
                    {isVerified && (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-1 shrink-0 border border-emerald-100">
                        <ShieldCheck size={10} className="shrink-0" />
                        <span className="text-[8px] font-black uppercase tracking-tight">Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-[15px] font-bold text-slate-900 leading-tight mb-3">
                      {getHighlightedText(prop.title || 'Market Listing', searchTerm)}
                    </h3>
                    
                    <div className="flex items-start gap-2 text-slate-500 mb-6">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      <p className="text-xs font-medium leading-relaxed">
                        {getHighlightedText(prop.address || 'Location on Request', searchTerm)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-6">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Valuation</span>
                        <p className="text-base font-black text-slate-900">{prop.price || 'Contact'}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Yield Index</span>
                        <p className={`text-base font-black ${isVerified ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {stability}%
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/property/${prop.id}`)}
                      className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-none outline-none"
                    >
                      View Analytics <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-24 bg-white border border-slate-200 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full mb-6 border border-slate-100">
                <SearchX size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching Assets Found</h3>
              <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                We couldn't find any properties matching your search criteria. Please check your spelling or try searching for a different area.
              </p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-8 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Clear Filters & View All
              </button>
            </div>
          )}
        </div>

        {!loading && filteredData.length > itemsPerPage && (
          <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-200 pt-10">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Index <span className="text-slate-900">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)}</span> of {filteredData.length} Assets
            </div>

            <nav className="flex items-center gap-1 px-1 py-1 bg-white border border-slate-200">
              <button 
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0,0); }}
                disabled={currentPage === 1}
                className="p-2.5 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => { setCurrentPage(p); window.scrollTo(0,0); }}
                        className={`w-10 h-10 text-[11px] font-black transition-all cursor-pointer ${
                          currentPage === p ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="w-6 text-center text-slate-300 self-center font-bold">...</span>;
                  return null;
                })}
              </div>

              <button 
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0,0); }}
                disabled={currentPage === totalPages}
                className="p-2.5 hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
};

export default Listings;