import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowUpRight, Search, X,
  Database, ChevronLeft, ChevronRight, 
  Building2, SearchX, ShieldAlert, BarChart3,
  CheckCircle2, ListFilter, Bed, Activity
} from 'lucide-react';

// হাইলাইট ফাংশন (আগের মতোই)
const Highlight = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = String(text).split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5 font-medium">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 overflow-hidden rounded-2xl">
    <div className="h-48 bg-slate-50 animate-pulse" />
    <div className="p-5 space-y-4 animate-pulse">
      <div className="h-4 bg-slate-50 rounded w-1/3" />
      <div className="h-6 bg-slate-50 rounded w-full" />
      <div className="pt-4 border-t border-slate-100 flex justify-between gap-4">
        <div className="h-10 bg-slate-50 rounded-xl w-1/2" />
        <div className="h-10 bg-slate-50 rounded-xl w-1/2" />
      </div>
    </div>
  </div>
);

const Listings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Stability Calculation Logic (আগের মতোই)
  const calculateStability = (prop) => {
    let score = 70; 
    const epc = String(prop.ecp_rating || 'N/A').toUpperCase();
    if (epc.includes('A')) score += 25;
    else if (epc.includes('B')) score += 18;
    else if (epc.includes('C')) score += 10;
    else if (epc.includes('D')) score += 5;

    const tenure = String(prop.tenure || '').toLowerCase();
    if (tenure.includes('freehold')) score += 4;
    
    return Math.min(score, 99); 
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        // লজিক ফিক্স: আপনার সেভ করা Backend_URL এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করা হয়েছে
        const base_url = import.meta.env.VITE_BACKEND_URL || import.meta.env.Backend_URL || "http://127.0.0.1:5000";
        const cleanUrl = base_url.replace(/\/$/, '');
        
        const res = await fetch(`${cleanUrl}/api/properties`);
        if (!res.ok) throw new Error("Fetch failed");
        
        const data = await res.json();
        
        // আপনার নতুন ব্যাকএন্ড যেহেতু 'id' ফিল্ড দিচ্ছে, সরাসরি সেটি ব্যবহার করছি
        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Connection failed:", err);
        setError(true);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, []);

  const filteredData = properties.filter(p => 
    (p.address || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.property_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.uprn || "").toString().includes(searchTerm)
  );

  const totalInventory = filteredData.length;
  const growthAssets = filteredData.filter(p => 
    ['A', 'B', 'C'].includes(String(p.ecp_rating || '').toUpperCase())
  ).length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalInventory / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#FBFBFC] pb-20 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 text-white rounded-xl">
              <Building2 size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Prophetic<span className="text-indigo-600">Core</span></h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Activity size={10} className={error ? "text-red-500" : "text-emerald-500"} /> 
                {error ? "Offline Node" : "Investment Node"}
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by location or UPRN..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-600 outline-none transition-all font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 mt-8">
        {!loading && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-white p-5 flex items-center gap-4">
              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400"><ListFilter size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Inventory</p>
                <p className="text-xl font-black">{totalInventory}</p>
              </div>
            </div>
            <div className="bg-white p-5 flex items-center gap-4">
              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-500"><CheckCircle2 size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-emerald-500 uppercase">Growth Assets</p>
                <p className="text-xl font-black">{growthAssets}</p>
              </div>
            </div>
            <div className="bg-white p-5 flex items-center gap-4">
              <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-500"><Database size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase">Network Status</p>
                <p className="text-xl font-black">{error ? "Disconnected" : "Live Node"}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />) : 
            currentItems.map((prop) => {
              const stability = calculateStability(prop);
              const imgUrl = prop.property_images?.[0];
              const pId = prop.id; // ব্যাকএন্ড থেকে আসা ইউনিক আইডি

              return (
                <div 
                  key={pId} 
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-500 transition-all flex flex-col cursor-pointer"
                  onClick={() => navigate(`/property/${pId}`)}
                >
                  <div className="relative h-52 bg-slate-50 overflow-hidden text-slate-500">
                    {imgUrl ? (
                      <img src={imgUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Property" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-200">
                        <Building2 size={32} strokeWidth={1} />
                        <span className="text-[9px] font-bold mt-2 uppercase">No Preview</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-100 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter">
                      {prop.tenure || 'N/A'}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-[13px] font-bold text-slate-800 line-clamp-2 min-h-[40px] leading-tight">
                      <Highlight text={prop.property_title || "Market Asset"} highlight={searchTerm} />
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-400 mt-2 mb-4">
                      <MapPin size={12} className="shrink-0" />
                      <p className="text-[11px] font-medium truncate">
                        <Highlight text={prop.address || "Location unavailable"} highlight={searchTerm} />
                      </p>
                    </div>

                    <div className="flex items-center gap-4 py-3 border-y border-slate-50 my-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Bed size={14} className="text-slate-400" />
                        <span className="text-xs font-bold">{prop.bedrooms || 0} Bed</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <BarChart3 size={14} className="text-slate-400" />
                        <span className="text-xs font-bold uppercase">EPC {prop.ecp_rating || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Valuation</p>
                        <p className="text-[15px] font-black text-slate-900 tracking-tight">{prop.price || 'POA'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Stability</p>
                        <p className={`text-[15px] font-black ${stability > 85 ? 'text-emerald-500' : 'text-indigo-600'}`}>
                          {stability}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 pb-5 grid grid-cols-2 gap-2 mt-auto">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/risks/${pId}`); }}
                        className="py-2.5 rounded-xl text-[10px] font-black uppercase border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShieldAlert size={14}/> Audit
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/analysis/${pId}`); }}
                        className="py-2.5 rounded-xl text-[10px] font-black uppercase bg-slate-900 text-white hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Insights <ArrowUpRight size={14}/>
                      </button>
                  </div>
                </div>
              );
            })
          }
        </div>

        {!loading && filteredData.length === 0 && (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <SearchX size={40} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No assets matching "{searchTerm}"</h3>
            <button 
              onClick={() => setSearchTerm('')} 
              className="mt-4 text-indigo-600 font-bold underline text-sm cursor-pointer"
            >
              Clear search filters
            </button>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button 
              onClick={() => { setCurrentPage(p => Math.max(1, p-1)); window.scrollTo(0,0); }}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-default"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
               {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                .map((page, i, arr) => (
                  <React.Fragment key={page}>
                    {i > 0 && arr[i-1] !== page - 1 && <span className="px-2 text-slate-300">...</span>}
                    <button 
                      onClick={() => { setCurrentPage(page); window.scrollTo(0,0); }}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all border cursor-pointer ${currentPage === page ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-600'}`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button 
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p+1)); window.scrollTo(0,0); }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-default"
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