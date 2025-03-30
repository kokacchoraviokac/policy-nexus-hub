
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Policies from "@/pages/Policies";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyDetailPage from "@/pages/policies/PolicyDetailPage";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyReviewPage from "@/pages/policies/PolicyReviewPage";
import PolicyImportPage from "@/pages/policies/PolicyImportPage";

export const PolicyRoutes = [
  // Main policies page
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
  
  // New policy page
  <Route 
    key="policies-new"
    path="/policies/new" 
    element={
      <ProtectedRoute requiredPrivilege="policies:create">
        <AppLayout>
          <NewPolicy />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy detail page
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
  
  // Policy review page
  <Route 
    key="policy-review"
    path="/policies/:policyId/review" 
    element={
      <ProtectedRoute requiredPrivilege="policies:edit">
        <AppLayout>
          <PolicyReviewPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy workflow page
  <Route 
    key="policy-workflow"
    path="/policies/workflow" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyWorkflow />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy addendums page
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
  
  // Unlinked payments page
  <Route 
    key="policy-unlinked-payments"
    path="/policies/unlinked-payments" 
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <UnlinkedPayments />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy documents page
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
  
  // Policy import/export page
  <Route 
    key="policy-import"
    path="/policies/import" 
    element={
      <ProtectedRoute requiredPrivilege="policies:edit">
        <AppLayout>
          <PolicyImportPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
