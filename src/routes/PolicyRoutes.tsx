
import React from "react";
import { Route } from "react-router-dom";
import Policies from "@/pages/Policies";
import PolicyDetailPage from "@/pages/policies/PolicyDetailPage";
import NewPolicy from "@/pages/policies/NewPolicy";
import PolicyWorkflow from "@/pages/policies/PolicyWorkflow";
import PolicyAddendums from "@/pages/policies/PolicyAddendums";
import UnlinkedPayments from "@/pages/policies/UnlinkedPayments";
import PolicyDocuments from "@/pages/policies/PolicyDocuments";
import PolicyReviewPage from "@/pages/policies/PolicyReviewPage";

export const PolicyRoutes = (
  <Route path="policies">
    <Route index element={<Policies />} />
    <Route path="new" element={<NewPolicy />} />
    <Route path=":policyId" element={<PolicyDetailPage />} />
    <Route path=":policyId/edit" element={<NewPolicy />} />
    <Route path=":policyId/review" element={<PolicyReviewPage />} />
    <Route path="workflow" element={<PolicyWorkflow />} />
    <Route path="addendums" element={<PolicyAddendums />} />
    <Route path="unlinked-payments" element={<UnlinkedPayments />} />
    <Route path="documents" element={<PolicyDocuments />} />
  </Route>
);
