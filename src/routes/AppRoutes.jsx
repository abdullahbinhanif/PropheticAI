import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Analysis from '../pages/Analysis';
import RiskAlerts from '../pages/RiskAlerts';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/risks" element={<RiskAlerts />} />
    </Routes>
  );
};

export default AppRoutes;