import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#f8fafc] font-sans">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Dynamic Page Content */}
        <main className="flex-1 ml-72 p-10">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;