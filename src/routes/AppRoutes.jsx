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
      {/* 1. Main Dashboard - সিস্টেম ওভারভিউ */}
      <Route path="/" element={<Dashboard />} />
      
      {/* 2. Property Listings - সকল ইনভেন্টরি তালিকা */}
      <Route path="/listings" element={<Listings />} />
      
      {/* 3. Global & Individual Market Analysis */}
      {/* সাধারণ মার্কেট এনালাইসিস ভিউ */}
      <Route path="/analysis" element={<Analysis />} />
      {/* নির্দিষ্ট প্রপার্টি ভিত্তিক ফিন্যান্সিয়াল ব্রেকডাউন (Insights বাটন) */}
      <Route path="/analysis/:id" element={<Analysis />} /> 
      
      {/* 4. Dynamic Property Detail View */}
      {/* বেসিক প্রপার্টি ডিটেইলস (কার্ডে ক্লিক করলে এখানে যাবে) */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      
      {/* 5. Risk Alerts & Audit Nodes */}
      {/* নির্দিষ্ট প্রপার্টির রিস্ক অডিট (Audit বাটন) */}
      <Route path="/risks/:id" element={<RiskAlerts />} />
      {/* জেনারেল রিস্ক ওভারভিউ */}
      <Route path="/risks" element={<RiskAlerts />} />

      {/* 6. Fallback/Safety Route */}
      {/* ভুল পাথে গেলে সরাসরি ড্যাশবোর্ডে রিডাইরেক্ট করবে */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;