import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const RiskAlerts = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 animate-in fade-in duration-700">
      <div className="p-4 bg-red-50 rounded-full">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Early Warning Signals</h2>
      <p className="text-slate-500 max-w-md">
        This section will identify patterns like industry concentration and demand fragility 
        to highlight potential market instability.
      </p>
      <div className="mt-6 px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
        Coming Soon for March 24th Poster
      </div>
    </div>
  );
};

export default RiskAlerts; // এই লাইনটি মিসিং ছিল