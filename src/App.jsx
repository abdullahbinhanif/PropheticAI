import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lenis from '@studio-freight/lenis'; 
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

/**
 * @component App
 * @description Root component that handles global layouts, smooth scrolling, and routing.
 */
function App() {
  
  /**
   * Effect: Smooth Scrolling Initialization
   * Uses Lenis for a high-performance, inertia-based scrolling experience.
   */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });


    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function to prevent memory leaks on component unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    /* Router:*/
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100 selection:text-blue-600 antialiased">
        
        {/* Persistent Navigation: Sidebar remains fixed or relative based on viewport */}
        <Sidebar />

        {/* Main Content Area: */}
        <main className="flex-1 w-full ml-0 lg:ml-64 p-5 md:p-10 pt-20 lg:pt-10 transition-all duration-300 ease-in-out">
          <div className="max-w-[1400px] mx-auto">
            
            {/* Dynamic View Injection: 
              Routes handle the rendering of Explorer (1,000+ assets), Analysis, and Risk modules.
            */}
            <AppRoutes />
            
          </div>
        </main>

      </div>
    </Router>
  );
}

export default App;