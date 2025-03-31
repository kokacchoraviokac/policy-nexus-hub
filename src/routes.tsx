
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PoliciesPage from "./pages/policies/PoliciesPage";
import PolicyDetailPage from "./pages/policies/PolicyDetailPage";
import PolicyDocuments from "./pages/policies/PolicyDocuments";
import PolicyWorkflowPage from "./pages/policies/PolicyWorkflowPage";
import PolicyReviewPage from "./pages/policies/PolicyReviewPage";
import PolicyImportPage from "./pages/policies/PolicyImportPage";
import ClaimsPage from "./pages/claims/ClaimsPage";
import ClaimDetailPage from "./pages/claims/ClaimDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "policies",
        children: [
          {
            index: true,
            element: <PoliciesPage />,
          },
          {
            path: ":policyId",
            element: <PolicyDetailPage />,
          },
          {
            path: "workflow",
            children: [
              {
                index: true,
                element: <PolicyWorkflowPage />,
              },
              {
                path: ":policyId",
                element: <PolicyDetailPage />,
              },
              {
                path: ":policyId/review",
                element: <PolicyReviewPage />,
              },
            ],
          },
          {
            path: "import",
            element: <PolicyImportPage />,
          },
          {
            path: "documents",
            element: <PolicyDocuments />,
          },
        ],
      },
      {
        path: "claims",
        children: [
          {
            index: true,
            element: <ClaimsPage />,
          },
          {
            path: ":claimId",
            element: <ClaimDetailPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
