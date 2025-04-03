
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Loading fallback component for module content
const ModuleLoadingFallback = () => (
  <div className="flex h-full w-full items-center justify-center p-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Import routes directly instead of using dynamic imports
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

// Wrapper component for lazily loaded routes
const LazyRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
    <Route path="/dashboard/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <DashboardRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/policies/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <PolicyRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/sales/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <SalesRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/claims/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <ClaimsRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/finances/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <FinancesRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/codebook/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <CodebookRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/agent/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <AgentRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/reports/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <ReportsRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/settings/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          <SettingsRoutes />
        </Suspense>
      </LazyRouteWrapper>
    } />
    
    <Route path="/documents/*" element={
      <LazyRouteWrapper>
        <Suspense fallback={<ModuleLoadingFallback />}>
          {documentRoutes}
        </Suspense>
      </LazyRouteWrapper>
    } />
  </Routes>
);

export default LazyModuleRoutes;
