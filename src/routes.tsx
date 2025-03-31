
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Policies from "./pages/Policies";
import PolicyDetailPage from "./pages/policies/PolicyDetail";
import PolicyDocuments from "./pages/policies/PolicyDocuments";
import PolicyWorkflow from "./pages/policies/workflow/PolicyWorkflow";
import PolicyReview from "./pages/policies/workflow/PolicyReview";
import PolicyImportPage from "./pages/policies/PolicyImportPage";
import ClaimsPage from "./pages/claims/Claims";
import ClaimDetailPage from "./pages/claims/ClaimDetailPage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
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
            element: <Policies />,
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
                element: <PolicyWorkflow />,
              },
              {
                path: ":policyId",
                element: <PolicyDetailPage />,
              },
              {
                path: ":policyId/review",
                element: <PolicyReview />,
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
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
