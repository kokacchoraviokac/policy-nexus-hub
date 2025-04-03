
import React from 'react';
import { Route } from 'react-router-dom';
import DocumentManagement from '@/pages/DocumentManagement';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const documentRoutes = [
  <Route 
    key="documents" 
    path="/documents" 
    element={
      <ProtectedRoute>
        <AppLayout>
          <DocumentManagement />
        </AppLayout>
      </ProtectedRoute>
    } 
  />
];
