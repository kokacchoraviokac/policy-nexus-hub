
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";

export const DashboardRoutes = [
  // Dashboard - homepage
  <Route 
    key="dashboard"
    path="/" 
    element={
      <ProtectedRoute requiredPrivilege="dashboard:view">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </ProtectedRoute>
    } 
  />,
  
  // User Profile - accessible to all authenticated users
  <Route 
    key="profile"
    path="/profile" 
    element={
      <ProtectedRoute>
        <AppLayout>
          <Profile />
        </AppLayout>
      </ProtectedRoute>
    } 
  />
];
