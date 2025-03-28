
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import PrivilegeTestPage from "@/pages/PrivilegeTestPage";

export const SettingsRoutes = [
  // Settings Module
  <Route 
    key="settings"
    path="/settings" 
    element={
      <ProtectedRoute requiredPrivilege="settings:view">
        <AppLayout>
          <Settings />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // User Management
  <Route 
    key="user-management"
    path="/settings/users" 
    element={
      <ProtectedRoute requiredPrivilege="users:manage">
        <AppLayout>
          <UserManagement />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Privilege Test Page
  <Route 
    key="privilege-test"
    path="/settings/privileges/test" 
    element={
      <ProtectedRoute requiredPrivilege="settings:view">
        <AppLayout>
          <PrivilegeTestPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
