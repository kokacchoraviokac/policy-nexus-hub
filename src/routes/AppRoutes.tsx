
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardRoutes } from './DashboardRoutes';
import { PolicyRoutes } from './PolicyRoutes';
import { SalesRoutes } from './SalesRoutes'; // Changed to named import
import { ClaimsRoutes } from './ClaimsRoutes';
import { FinancesRoutes } from './FinancesRoutes';
import { CodebookRoutes } from './CodebookRoutes';
import { ReportsRoutes } from './ReportsRoutes';
import { SettingsRoutes } from './SettingsRoutes';
import { AgentRoutes } from './AgentRoutes';
import AppLayout from '@/components/layout/AppLayout';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Dashboard Routes */}
      {DashboardRoutes}
      
      {/* Policies Routes */}
      {PolicyRoutes}
      
      {/* Sales Routes */}
      {SalesRoutes}
      
      {/* Claims Routes */}
      {ClaimsRoutes}
      
      {/* Finances Routes */}
      {Array.isArray(FinancesRoutes) ? FinancesRoutes : [FinancesRoutes]}
      
      {/* Codebook Routes */}
      {CodebookRoutes}
      
      {/* Agent Routes */}
      {AgentRoutes}
      
      {/* Reports Routes */}
      {ReportsRoutes}
      
      {/* Settings Routes */}
      {SettingsRoutes}
      
      {/* 404 */}
      <Route
        path="*"
        element={
          <AppLayout>
            <NotFound />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
