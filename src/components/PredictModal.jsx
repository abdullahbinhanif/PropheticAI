import React, { useState, useEffect } from 'react';
import { X, Train, School, Clock, Navigation2, Loader2, Sparkles, Send } from 'lucide-react';

const PredictModal = ({ isOpen, onClose, uprn, propertyData }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [userInput, setUserInput] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Result

  useEffect(() => {
    if (isOpen) {
      setPrediction("");
      setUserInput("");
      setStep(1);
    }
  }, [isOpen, uprn]);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    setStep(2);
    
    try {
      const base_url = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
      const cleanUrl = base_url.replace(/\/$/, '');
      
      const response = await fetch(`${cleanUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uprn, query: userInput })
      });
      
      const data = await response.json();
      
      setTimeout(() => {
        setPrediction(data.prediction_text);
        setLoading(false);
        setStep(3);
      }, 1200);

    } catch (error) {
      setPrediction("Unable to connect to intelligence node. Please try again.");
      setLoading(false);
      setStep(3);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 overflow-hidden">
        
        {/* Header - Minimalist */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700 tracking-tight">AI Asset Insights</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Navigation2 size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Current Location Context</p>
                  <p className="text-sm font-semibold text-slate-700">{propertyData?.address || "United Kingdom"}</p>
                </div>
              </div>

              <form onSubmit={handlePredict} className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about schools, transport links, or investment potential..."
                    className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-600 placeholder:text-slate-400"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!userInput.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                >
                  Generate Insights
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="py-16 flex flex-col items-center justify-center space-y-4 animate-in fade-in">
              <Loader2 size={32} className="text-indigo-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Analyzing proximity data...</p>
                <p className="text-xs text-slate-400 mt-1">Calculating travel times and local amenities</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in zoom-in-95 duration-400">
              {/* Proximity Dashboard - Soft Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Train size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Transport</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">0.4 miles</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> 8 min walk
                  </p>
                </div>
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <School size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Education</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Top Rated School</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> 12 min drive
                  </p>
                </div>
              </div>

              {/* Main Insight Box */}
              <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">AI Summary</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{prediction}"
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all"
                >
                  New Query
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-all cursor-pointer"
                >
                  Close Engine
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