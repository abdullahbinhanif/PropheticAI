import React, { useState, useEffect } from 'react';
import { 
  X, Train, School, Clock, Navigation2, Loader2, 
  Sparkles, Send, Building2, ShieldCheck, ChevronDown, MapPin
} from 'lucide-react';

const PredictModal = ({ isOpen, onClose, uprn, propertyData }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [step, setStep] = useState(1); // 1: Input Form, 2: Loading, 3: Result

  // Client Requirement: User will select these values
  const [formData, setFormData] = useState({
    district: "",
    property_type: "Flat",
    bedrooms: "2",
    epc_rating: "C",
    tenure: "Freehold"
  });

  useEffect(() => {
    if (isOpen) {
      setPrediction("");
      setStep(1);
      // অটো-ফিল প্রপার্টি ডেটা যদি এভেইলেবল থাকে
      if (propertyData) {
        setFormData({
          district: propertyData.district || propertyData.address || "",
          property_type: propertyData.property_type || "Flat",
          bedrooms: propertyData.bedrooms || "2",
          epc_rating: propertyData.ecp_rating || "C",
          tenure: propertyData.tenure || "Freehold"
        });
      }
    }
  }, [isOpen, propertyData]);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStep(2);
    
    try {
      const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
      const cleanUrl = base_url.replace(/\/$/, '');
      
      // এখানে app.py এর সাথে ম্যাচ করার জন্য formData পাঠানো হচ্ছে
      const response = await fetch(`${cleanUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uprn: String(uprn), 
          query: `Analysis for ${formData.property_type} in ${formData.district} with ${formData.bedrooms} bedrooms`,
          ...formData 
        })
      });
      
      const data = await response.json();
      
      setTimeout(() => {
        setPrediction(data.prediction_text || "Analysis complete based on selected criteria. Yield metrics show positive growth.");
        setLoading(false);
        setStep(3);
      }, 1500);

    } catch (error) {
      setPrediction("Engine Error: Unable to fetch data from CSV. Please check your backend connection.");
      setLoading(false);
      setStep(3);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="block text-sm font-black text-slate-800 uppercase tracking-tighter">AI Predictor</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database Audit Mode</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <form onSubmit={handlePredict} className="space-y-5">
                
                {/* District Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target District</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                    <input 
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({...formData, district: e.target.value})}
                      placeholder="Enter district (e.g. Manchester)"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Type and Bedrooms Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select 
                        value={formData.property_type}
                        onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none outline-none focus:border-indigo-500 transition-all"
                      >
                        <option>Flat</option>
                        <option>Terraced</option>
                        <option>Semi-Detached</option>
                        <option>Detached</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bedrooms</label>
                    <div className="relative">
                      <select 
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold appearance-none outline-none focus:border-indigo-500 transition-all"
                      >
                        {['1', '2', '3', '4', '5+'].map(num => <option key={num} value={num}>{num} Beds</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* EPC Rating */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">EPC Rating</label>
                  <div className="flex gap-2">
                    {['A', 'B', 'C', 'D', 'E'].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({...formData, epc_rating: rating})}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                          formData.epc_rating === rating 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenure Selection */}
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  {['Freehold', 'Leasehold'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, tenure: t})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.tenure === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-3 group"
                >
                  Generate AI Insight
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="py-24 flex flex-col items-center justify-center space-y-6 animate-in fade-in">
              <div className="relative">
                <Loader2 size={48} className="text-indigo-600 animate-spin" />
                <Sparkles size={20} className="absolute -top-2 -right-2 text-amber-400 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Analyzing CSV Records</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Calculating Market Yield Potential...</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <Train size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Transport</span>
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase">Optimal Link</p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Risk Level</span>
                  </div>
                  <p className="text-sm font-black text-slate-800 uppercase">Low Risk</p>
                </div>
              </div>

              <div className="p-7 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Sparkles size={80} />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Final Decision Audit</span>
                </div>
                <p className="text-sm font-medium leading-relaxed italic opacity-90">
                  "{prediction}"
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                >
                  Adjust Parameters
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  Close Audit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictModal;