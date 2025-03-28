
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Policies from "@/pages/Policies";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyDetailPage from "@/pages/policies/PolicyDetailPage";

export const PolicyRoutes = [
  // Policies Module
  <Route
    key="policies"
    path="/policies" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <Policies />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Creation Route
  <Route 
    key="new-policy"
    path="/policies/new" 
    element={
      <ProtectedRoute requiredPrivilege="policies:create">
        <AppLayout>
          <NewPolicy />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Detail Route
  <Route 
    key="policy-detail"
    path="/policies/:policyId" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyDetailPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  <Route 
    key="policy-edit"
    path="/policies/:policyId/edit" 
    element={
      <ProtectedRoute requiredPrivilege="policies:edit">
        <AppLayout>
          <div>Policy Edit Page - To be implemented</div>
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
