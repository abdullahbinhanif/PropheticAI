import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lenis from '@studio-freight/lenis'; 
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

/**
 * PropheticAI - Main Application Component
 * Handling Smooth Scroll (Lenis) and Global Layout Logic
 */
function App() {
  
  // 1. Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function to destroy lenis instance on unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-600 antialiased">
        
        {/* Sidebar Component 
          - এটি ডেস্কটপে ফিক্সড থাকবে (lg:ml-64 logic targets this)
        */}
        <Sidebar />

        {/* Main Content Area 
          - ml-0 (মোবাইলে ফুল উইডথ)
          - lg:ml-64 (ডেস্কটপে সাইডবারের জন্য জায়গা ছেড়ে দিবে)
          - pt-20 (মোবাইল টপ বার স্পেসিং)
        */}
        <main className="flex-1 w-full ml-0 lg:ml-64 p-5 md:p-10 pt-20 lg:pt-10 transition-all duration-300 ease-in-out">
          <div className="max-w-[1400px] mx-auto">
            
            {/* AppRoutes: এখানে আপনার Listing এবং Analysis পেজগুলো রেন্ডার হবে।
               আপনার dataset.csv থেকে ডাটা নিয়ে আসার লজিক এই রাউটগুলোর ভেতরে থাকবে।
            */}
            <AppRoutes />
            
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;