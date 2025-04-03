
import React from 'react';
import { Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load the DocumentManagement component
const DocumentManagement = React.lazy(() => import('@/pages/DocumentManagement'));

export const documentRoutes = [
  <Route 
    key="documents" 
    path="/documents" 
    element={
      <ProtectedRoute>
        <AppLayout>
          <React.Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
            <DocumentManagement />
          </React.Suspense>
        </AppLayout>
      </ProtectedRoute>
    } 
  />
];

export default documentRoutes;
