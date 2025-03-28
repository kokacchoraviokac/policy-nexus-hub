
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Policies from "@/pages/Policies";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyDetailPage from "@/pages/policies/PolicyDetailPage";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";

export const PolicyRoutes = [
  // Policies Module - Main Page (All Policies)
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
  
  // Policies Workflow
  <Route 
    key="policies-workflow"
    path="/policies/workflow" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyWorkflow />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Addendums (List)
  <Route 
    key="policy-addendums"
    path="/policies/addendums" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyAddendums />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Unlinked Payments
  <Route 
    key="unlinked-payments"
    path="/policies/unlinked-payments" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <UnlinkedPayments />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Documents
  <Route 
    key="policy-documents"
    path="/policies/documents" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyDocuments />
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
