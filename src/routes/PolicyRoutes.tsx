
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

// Policy Pages
import AllPolicies from "@/pages/policies/AllPolicies";
import PolicyDetail from "@/pages/policies/PolicyDetail";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyWorkflow from "@/pages/policies/workflow/PolicyWorkflow";
import PolicyReview from "@/pages/policies/workflow/PolicyReview";

export const PolicyRoutes = [
  // Policy Directory Routes
  <Route
    key="policies"
    path="/policies"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <AllPolicies />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policy-detail"
    path="/policies/:policyId"
    element={
      <ProtectedRoute requiredPrivilege="policies:view">
        <AppLayout>
          <PolicyDetail />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Workflow Routes
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
  <Route
    key="policy-review"
    path="/policies/workflow/:policyId"
    element={
      <ProtectedRoute requiredPrivilege="policies:edit">
        <AppLayout>
          <PolicyReview />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  
  // Policy Addendums Route
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
  
  // Policy Documents Route
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
  />
];

export default PolicyRoutes;
