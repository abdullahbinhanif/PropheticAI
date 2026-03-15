import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md border-t-8 border-blue-500">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
          Prophetic<span className="text-blue-600">AI</span>
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Tailwind CSS ইজ ওয়ার্কিং! আপনার প্রজেক্ট এখন ডিজাইনের জন্য রেডি।
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg active:scale-95">
            Dashboard
          </button>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium transition-all">
            Risk Analysis
          </button>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            System Online: Ready for 24th March
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;