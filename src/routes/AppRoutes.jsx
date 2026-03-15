import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Analysis from '../pages/Analysis';
import RiskAlerts from '../pages/RiskAlerts';
import Listings from '../pages/Listings'; 
import PropertyDetail from '../pages/PropertyDetail';

/**
 * PropheticAI Routing Engine
 * Handling dynamic analysis routes for 1,000+ property records
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* ১. মেইন ড্যাশবোর্ড: অ্যাপ ওপেন করলে এখানে যাবে */}
      <Route path="/" element={<Dashboard />} />
      
      {/* ২. প্রোপার্টি লিস্টিং: এখান থেকেই সব প্রোপার্টি দেখা যাবে */}
      <Route path="/listings" element={<Listings />} />
      
      {/* ৩. জেনারেল মার্কেট এনালাইসিস: সামগ্রিক মার্কেট ট্রেন্ড */}
      <Route path="/analysis" element={ <Analysis /> } />
      
      {/* ৪. নির্দিষ্ট প্রোপার্টির ডিটেইলড এনালাইসিস (Dynamic Route)
          Listings পেজ থেকে ক্লিক করলে এই রাউটে আসবে।
      */}
      <Route path="/analysis/:id" element={<PropertyDetail />} />
      
      {/* ৫. রিস্ক অ্যালার্ট পেজ */}
      <Route path="/risks" element={<RiskAlerts />} />

      {/* ভুল ইউআরএল দিলে ড্যাশবোর্ডে পাঠিয়ে দিবে (Optional) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;