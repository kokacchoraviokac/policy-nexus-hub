
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Claims from "@/pages/Claims";
import Agent from "@/pages/Agent";

export const ModuleRoutes = [
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
  />
];
