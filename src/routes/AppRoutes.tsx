
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';

// Lazy loaded module routes
const ModuleRoutes = React.lazy(() => import('./LazyModuleRoutes'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Lazily loaded Module Routes with Suspense */}
      <Route
        path="/*"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ModuleRoutes />
          </Suspense>
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
