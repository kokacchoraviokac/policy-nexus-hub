
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Settings from "@/pages/Settings";
import UserManagement from "@/pages/UserManagement";
import PrivilegeTestPage from "@/pages/PrivilegeTestPage";
import EmployeesPage from "@/pages/settings/EmployeesPage";
import NotFound from "@/pages/NotFound";

export const SettingsRoutes = [
  // Settings Module - Main Settings Page
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
  
  // Employees Management
  <Route 
    key="settings-employees"
    path="/settings/employees" 
    element={
      <ProtectedRoute requiredPrivilege="settings:view">
        <AppLayout>
          <EmployeesPage />
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
  />,
  
  // Additional Settings Routes (currently pointing to NotFound until implemented)
  <Route 
    key="settings-privileges"
    path="/settings/privileges" 
    element={
      <ProtectedRoute requiredPrivilege="settings:view">
        <AppLayout>
          <NotFound />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route 
    key="settings-company"
    path="/settings/company" 
    element={
      <ProtectedRoute requiredPrivilege="settings:view">
        <AppLayout>
          <NotFound />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route 
    key="settings-instructions"
    path="/settings/instructions" 
    element={
      <ProtectedRoute requiredPrivilege="settings:view">
        <AppLayout>
          <NotFound />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
