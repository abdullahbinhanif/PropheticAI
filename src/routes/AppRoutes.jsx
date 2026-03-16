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
      <Route path="/analysis" element={<Analysis />} />
      
      {/* ৪. ডাইনামিক রাউট: নির্দিষ্ট প্রোপার্টির ডিটেইলড এনালাইসিস 
          Listing পেজ থেকে ক্লিক করলে /property/:id অথবা /analysis/:id এ যাবে।
          আপনার Listings.jsx এ navigate(`/property/${prop.id}`) দেওয়া আছে, তাই পাথে /property/:id রাখছি।
      */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      <Route path="/analysis/:id" element={<PropertyDetail />} />
      
      {/* ৫. রিস্ক অ্যালার্ট পেজ */}
      <Route path="/risks" element={<RiskAlerts />} />

      {/* ৬. ফালব্যাক রাউট: ভুল ইউআরএল বা রিলোড দিলে যেন হোমে চলে যায়। 
          এটি ৪MD৪ এরর ঠেকাতে সাহায্য করবে। */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;