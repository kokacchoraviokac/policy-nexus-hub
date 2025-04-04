
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Loading fallback component for module content
const ModuleLoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center p-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Import routes
import { DashboardRoutes } from './DashboardRoutes';
import { PolicyRoutes } from './PolicyRoutes';
import { SalesRoutes } from './SalesRoutes';
import { ClaimsRoutes } from './ClaimsRoutes';
import { FinancesRoutes } from './FinancesRoutes';
import { CodebookRoutes } from './CodebookRoutes';
import { AgentRoutes } from './AgentRoutes';
import { ReportsRoutes } from './ReportsRoutes';
import { SettingsRoutes } from './SettingsRoutes';
import { documentRoutes } from './documentRoutes';

// Wrapper component for routes
const RouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ModuleLoadingFallback />}>
    <ProtectedRoute>
      <AppLayout>
        {children}
      </AppLayout>
    </ProtectedRoute>
  </Suspense>
);

const LazyModuleRoutes: React.FC = () => (
  <Routes>
    <Route 
      path="/dashboard/*" 
      element={
        <RouteWrapper>
          <Routes>
            {DashboardRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />
    
    <Route 
      path="/policies/*" 
      element={
        <RouteWrapper>
          <Routes>
            <PolicyRoutes />
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/sales/*" 
      element={
        <RouteWrapper>
          <Routes>
            {SalesRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/claims/*" 
      element={
        <RouteWrapper>
          <Routes>
            {ClaimsRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/finances/*" 
      element={
        <RouteWrapper>
          <Routes>
            {FinancesRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/codebook/*" 
      element={
        <RouteWrapper>
          <Routes>
            {CodebookRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/agent/*" 
      element={
        <RouteWrapper>
          <Routes>
            {AgentRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/reports/*" 
      element={
        <RouteWrapper>
          <Routes>
            {ReportsRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />

    <Route 
      path="/settings/*" 
      element={
        <RouteWrapper>
          <Routes>
            {SettingsRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />
    
    <Route 
      path="/documents/*" 
      element={
        <RouteWrapper>
          <Routes>
            {documentRoutes}
          </Routes>
        </RouteWrapper>
      } 
    />
    
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default LazyModuleRoutes;
