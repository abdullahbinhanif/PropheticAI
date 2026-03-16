import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowUpRight, Search, Filter, 
  ShieldCheck, Loader2, BarChart3, 
  ChevronLeft, ChevronRight, LayoutGrid 
} from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-8 bg-slate-50 w-full" />
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
    // ১. ব্যাকএন্ড ইউআরএল নির্ধারণ (স্ল্যাশ হ্যান্ডেলিং সহ)
    const base_url = import.meta.env.VITE_BACKEND_URL || "";
    
    // ডাবল স্ল্যাশ (//) এড়ানোর জন্য ক্লিনআপ লজিক
    const clean_url = base_url.endsWith('/') ? base_url.slice(0, -1) : base_url;
    const API_ENDPOINT = clean_url ? `${clean_url}/api/properties` : "/api/properties";
    
    console.log("System Syncing with:", API_ENDPOINT);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_ENDPOINT);
        if (!res.ok) throw new Error(`Server Response: ${res.status}`);
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Connection Refused:", err.message);
        // যদি রেন্ডার ঘুমিয়ে থাকে, তবে সরাসরি লিঙ্কে রিকোয়েস্ট পাঠাতে পারেন
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-12 text-slate-900 font-sans">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                <LayoutGrid className="text-blue-600" size={20} /> PROPERTY CORE
              </h1>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <BarChart3 size={12} /> {filteredData.length} Assets Synchronized
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search address or title..." 
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none w-full md:w-80 font-medium"
                />
              </div>
              <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600">
                <Filter size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
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
                  <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {prop.tenure || 'Leasehold'}
                    </span>
                    {stability > 85 && (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={10} />
                        <span className="text-[9px] font-black uppercase">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1">
                    <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {prop.title}
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
                  <div className="w-full py-3.5 bg-slate-50 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                    Deep Insight <ArrowUpRight size={14} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <h3 className="text-lg font-bold text-slate-800">Syncing with Render...</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Render's free tier sleeps after 15 mins. This might take 30-60 seconds to wake up.
            </p>
            <a 
              href={import.meta.env.VITE_BACKEND_URL + "/api/properties"} 
              target="_blank" 
              className="mt-4 text-xs text-blue-600 font-bold uppercase underline"
            >
              Wake up server manually
            </a>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-3">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <span className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-200">
              {currentPage} / {totalPages}
            </span>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Listings;