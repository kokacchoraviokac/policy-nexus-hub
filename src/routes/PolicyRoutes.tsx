
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
  >
    <Route index element={<AllPolicies />} />
    <Route path="new" element={<NewPolicy />} />
    <Route path="detail/:id" element={<PolicyDetail />} />
    <Route path="addendums" element={<PolicyAddendums />} />
    <Route path="documents" element={<PolicyDocuments />} />
    <Route path="workflow" element={<PolicyWorkflow />} />
    <Route path="workflow/review/:id" element={<PolicyReview />} />
    <Route path="import" element={<PolicyImportPage />} />
  </Route>
];
