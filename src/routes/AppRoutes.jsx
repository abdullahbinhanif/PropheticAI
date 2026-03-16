import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Analysis from '../pages/Analysis';
import RiskAlerts from '../pages/RiskAlerts';
import Listings from '../pages/Listings'; 
import PropertyDetail from '../pages/PropertyDetail';

/**
 * PropheticAI Routing Engine
 * Optimized for dynamic data mapping and institutional audits
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Main Dashboard */}
      <Route path="/" element={<Dashboard />} />
      
      {/* 2. Property Listings */}
      <Route path="/listings" element={<Listings />} />
      
      {/* 3. Global Market Analysis */}
      <Route path="/analysis" element={<Analysis />} />
      
      {/* 4. Dynamic Property Routes 
         - /property/:id: Basic details view
         - /analysis/:id: Deep financial breakdown
      */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/analysis/:id" element={<PropertyDetail />} />
      
      {/* 5. Dynamic Risk Alerts
         নিচে :id যোগ করা হয়েছে যাতে নির্দিষ্ট প্রোপার্টির 
         Fragility Index এবং CSV ডাটা লোড হতে পারে।
      */}
      <Route path="/risks/:id" element={<RiskAlerts />} />
      
      {/* Static Risk Route (Optional)
         যদি আইডি ছাড়া জেনারেল কোনো রিস্ক পেজ থাকে তবে এটি কাজে লাগবে 
      */}
      <Route path="/risks" element={<RiskAlerts />} />

      {/* 6. Fallback/Safety Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;