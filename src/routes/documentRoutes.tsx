
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load the DocumentManagement component
const DocumentManagement = React.lazy(() => import('@/pages/DocumentManagement'));

// Export the Routes component for documentRoutes
export const DocumentRoutes = () => (
  <Routes>
    <Route 
      path="/"
      element={
        <ProtectedRoute>
          <React.Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
            <DocumentManagement />
          </React.Suspense>
        </ProtectedRoute>
      } 
    />
  </Routes>
);

// Export the Route components for direct inclusion in other route files
export const documentRoutes = (
  <Route 
    path="/" 
    element={
      <ProtectedRoute>
        <React.Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
          <DocumentManagement />
        </React.Suspense>
        </ProtectedRoute>
    } 
  />
);

export default DocumentRoutes;
