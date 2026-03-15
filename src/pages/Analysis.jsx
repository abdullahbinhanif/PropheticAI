import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analysis = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-700">
      <div className="p-4 bg-blue-50 rounded-full">
        <BarChart3 size={48} className="text-blue-500" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Market Analysis</h2>
      <p className="text-slate-500 max-w-md">
        Detailed multi-factor evaluation models prioritizing interpretability 
        over predictive accuracy.
      </p>
      <div className="mt-6 px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
        Under Development
      </div>
    </div>
  );
};

export default Analysis; // এই লাইনটিও নিশ্চিত করুন