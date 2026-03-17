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
      
      {/* 3. Global Market Analysis (General View) */}
      <Route path="/analysis" element={<Analysis />} />
      
      {/* 4. Dynamic Property Routes 
          FIXED: /analysis/:id now correctly points to the Analysis component
      */}
      {/* Basic details view */}
      <Route path="/property/:id" element={<PropertyDetail />} />
      
      {/* Deep financial breakdown - এটা আগে PropertyDetail ছিল, এখন Analysis করা হয়েছে */}
      <Route path="/analysis/:id" element={<Analysis />} /> 
      
      {/* 5. Dynamic Risk Alerts */}
      <Route path="/risks/:id" element={<RiskAlerts />} />
      
      {/* Static Risk Route (Optional) */}
      <Route path="/risks" element={<RiskAlerts />} />

      {/* 6. Fallback/Safety Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;