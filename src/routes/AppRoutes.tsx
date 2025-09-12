
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardRoutes } from './DashboardRoutes';
import { PolicyRoutes } from './PolicyRoutes';
import { SalesRoutes } from './SalesRoutes';
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
import DebugDatabase from '@/components/DebugDatabase';
import QuoteWorkflowTest from '@/components/sales/quotes/QuoteWorkflowTest';
import AgentPayoutTest from '@/components/agent/AgentPayoutTest';
import SettingsTest from '@/components/settings/SettingsTest';
import DocumentsHub from '@/pages/documents/DocumentsHub';

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
      
      {/* Redirect from old production route to new one */}
      <Route path="/reports/production" element={<Navigate to="/reports/policies" replace />} />
      
      {/* Settings Routes */}
      {SettingsRoutes}

      {/* Debug Routes */}
      <Route
        path="/debug/database"
        element={
          <AppLayout>
            <DebugDatabase />
          </AppLayout>
        }
      />
      
      {/* Quote Workflow Test Route */}
      <Route
        path="/test/quote-workflow"
        element={
          <AppLayout>
            <QuoteWorkflowTest />
          </AppLayout>
        }
      />
      
      {/* Agent Payout Test Route */}
      <Route
        path="/test/agent-payout"
        element={
          <AppLayout>
            <AgentPayoutTest />
          </AppLayout>
        }
      />
      
      {/* Settings Test Route */}
      <Route
        path="/test/settings"
        element={
          <AppLayout>
            <SettingsTest />
          </AppLayout>
        }
      />
      
      {/* Documents Hub Route */}
      <Route
        path="/documents"
        element={
          <AppLayout>
            <DocumentsHub />
          </AppLayout>
        }
      />

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
