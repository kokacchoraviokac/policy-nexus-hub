
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ModuleRoutes } from './ModuleRoutes';
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
      
      {/* Module Routes */}
      {ModuleRoutes}
      
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
