
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

export const PolicyRoutes = {
  path: "policies",
  children: [
    { index: true, element: <Policies /> },
    { path: "new", element: <NewPolicy /> },
    { path: ":policyId", element: <PolicyDetailPage /> },
    { path: ":policyId/edit", element: <NewPolicy /> },
    { path: ":policyId/review", element: <PolicyReviewPage /> },
    { path: "workflow", element: <PolicyWorkflow /> },
    { path: "addendums", element: <PolicyAddendums /> },
    { path: "unlinked-payments", element: <UnlinkedPayments /> },
    { path: "documents", element: <PolicyDocuments /> }
  ]
};
