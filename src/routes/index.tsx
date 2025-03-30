
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';
import AuthProtected from '@/components/auth/AuthProtected';
import GuestOnly from '@/components/auth/GuestOnly';
import { RouterProvider } from '@/contexts/RouterContext';
import AppRoutes from './routes';

const Router = () => {
  return (
    <RouterProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route element={<GuestOnly />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>
        
        <Route element={<AuthProtected />}>
          <Route element={<DashboardLayout />}>
            {/* Use a React Fragment to render a group of routes */}
            {React.createElement(React.Fragment, null, AppRoutes)}
          </Route>
        </Route>
      </Routes>
    </RouterProvider>
  );
};

export default Router;
