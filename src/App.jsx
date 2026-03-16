import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lenis from '@studio-freight/lenis'; 
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

function App() {
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // যদি Vercel-এ সাব-ফোল্ডারে প্রজেক্ট থাকে তবে basename প্রয়োজন হয়। 
    // তবে আপনার ক্ষেত্রে ডিরেক্ট ডোমেইন হলে এটি এভাবেই ঠিক আছে।
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-600 antialiased">
        
        <Sidebar />

        <main className="flex-1 w-full ml-0 lg:ml-64 p-5 md:p-10 pt-20 lg:pt-10 transition-all duration-300 ease-in-out">
          <div className="max-w-[1400px] mx-auto">
            
            {/* আপনার ১,০০০ ডেটার লজিক AppRoutes এর ভেতরে Listings পেজে কাজ করবে */}
            <AppRoutes />
            
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;