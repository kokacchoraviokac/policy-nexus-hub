
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Sales from "@/pages/Sales";
import Claims from "@/pages/Claims";
import Finances from "@/pages/Finances";
import Agent from "@/pages/Agent";
import Reports from "@/pages/Reports";

export const ModuleRoutes = [
  // Sales Module
  <Route 
    key="sales"
    path="/sales" 
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <Sales />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Claims Module
  <Route 
    key="claims"
    path="/claims" 
    element={
      <ProtectedRoute requiredPrivilege="claims:view">
        <AppLayout>
          <Claims />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Finances Module
  <Route 
    key="finances"
    path="/finances" 
    element={
      <ProtectedRoute requiredPrivilege="finances:view">
        <AppLayout>
          <Finances />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Agent Module
  <Route 
    key="agent"
    path="/agent" 
    element={
      <ProtectedRoute requiredPrivilege="agent:view">
        <AppLayout>
          <Agent />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Reports Module
  <Route 
    key="reports"
    path="/reports" 
    element={
      <ProtectedRoute requiredPrivilege="reports:view">
        <AppLayout>
          <Reports />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
