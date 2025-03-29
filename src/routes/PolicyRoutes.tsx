
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
  <>
    <Route path="/policies" element={<Policies />} />
    <Route path="/policies/new" element={<NewPolicy />} />
    <Route path="/policies/:policyId" element={<PolicyDetailPage />} />
    <Route path="/policies/:policyId/edit" element={<NewPolicy />} />
    <Route path="/policies/:policyId/review" element={<PolicyReviewPage />} />
    <Route path="/policies/workflow" element={<PolicyWorkflow />} />
    <Route path="/policies/addendums" element={<PolicyAddendums />} />
    <Route path="/policies/unlinked-payments" element={<UnlinkedPayments />} />
    <Route path="/policies/documents" element={<PolicyDocuments />} />
  </>
);
