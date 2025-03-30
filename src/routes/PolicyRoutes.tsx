
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Policies from "@/pages/Policies";
import AllPolicies from "@/pages/policies/AllPolicies";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyDetail from "@/pages/policies/PolicyDetail";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyReview from "@/pages/policies/workflow/PolicyReview";
import PolicyImportPage from "@/pages/policies/PolicyImportPage";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";

export const PolicyRoutes = [
  <Route
    key="policies"
    path="/policies"
    element={
      <ProtectedRoute>
        <AppLayout>
          <Policies />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-index"
    path="/policies"
    element={
      <ProtectedRoute>
        <AppLayout>
          <AllPolicies />
        </AppLayout>
      </ProtectedRoute>
    }
    index
  />,
  <Route
    key="policies-new"
    path="/policies/new"
    element={
      <ProtectedRoute>
        <AppLayout>
          <NewPolicy />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-detail"
    path="/policies/detail/:id"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyDetail />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-workflow"
    path="/policies/workflow"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyWorkflow />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-workflow-review"
    path="/policies/workflow/review/:id"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyReview />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-addendums"
    path="/policies/addendums"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyAddendums />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-documents"
    path="/policies/documents"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyDocuments />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-import"
    path="/policies/import"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyImportPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-unlinked-payments"
    path="/policies/unlinked-payments"
    element={
      <ProtectedRoute>
        <AppLayout>
          <UnlinkedPayments />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
