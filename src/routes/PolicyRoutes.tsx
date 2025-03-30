
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Policies from "@/pages/Policies";
import PolicyDetailPage from "@/pages/policies/PolicyDetailPage";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyReviewPage from "@/pages/policies/PolicyReviewPage";

export const PolicyRoutes = [
  // Main Policies page
  <Route 
    key="policies-main"
    path="/policies" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <Policies />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // New Policy
  <Route 
    key="policies-new"
    path="/policies/new" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <NewPolicy />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Detail
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
  
  // Policy Edit
  <Route 
    key="policy-edit"
    path="/policies/:policyId/edit" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <NewPolicy />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Review
  <Route 
    key="policy-review"
    path="/policies/:policyId/review" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyReviewPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Workflow
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
  
  // Policy Addendums
  <Route 
    key="policies-addendums"
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
    key="policies-unlinked-payments"
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
    key="policies-documents"
    path="/policies/documents" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyDocuments />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
