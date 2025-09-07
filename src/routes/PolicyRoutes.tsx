
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Policies from "@/pages/Policies";
import AllPolicies from "@/pages/policies/AllPolicies";
import PolicyDetail from "@/pages/policies/PolicyDetail";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyReview from "@/pages/policies/workflow/PolicyReview";
import PolicyImportPage from "@/pages/policies/PolicyImportPage";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyWorkflowPage from "@/pages/policies/PolicyWorkflowPage";
import PolicyReviewPage from "@/pages/policies/PolicyReviewPage";
import NewAddendumPage from "@/pages/policies/addendums/NewAddendumPage";

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
    key="policies-detail"
    path="/policies/:id"
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
          <PolicyWorkflowPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-workflow-review"
    path="/policies/:id/review"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyReview />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="policies-workflow-review-id"
    path="/policies/workflow/review/:id"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyReviewPage />
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
    key="policies-addendums-new"
    path="/policies/addendums/new"
    element={
      <ProtectedRoute>
        <AppLayout>
          <NewAddendumPage />
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
