
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AllPolicies from "@/pages/policies/AllPolicies";
import PolicyDetail from "@/pages/policies/PolicyDetail";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyImportPage from "@/pages/policies/PolicyImportPage";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyReview from "@/pages/policies/workflow/PolicyReview";

export const PolicyRoutes = () => {
  return (
    <Routes>
      <Route index element={<AllPolicies />} />
      <Route path="new" element={<NewPolicy />} />
      <Route path="import" element={<PolicyImportPage />} />
      <Route path="workflow" element={<PolicyWorkflow />} />
      <Route path="review/:id" element={<PolicyReview />} />
      <Route path="addendums" element={<PolicyAddendums />} />
      <Route path="documents" element={<PolicyDocuments />} />
      <Route path="unlinked-payments" element={<UnlinkedPayments />} />
      <Route path=":id" element={<PolicyDetail />} />
      <Route path="*" element={<Navigate to="/policies" replace />} />
    </Routes>
  );
};
