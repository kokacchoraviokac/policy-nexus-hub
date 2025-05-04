import React from "react";
import { Route } from "react-router-dom";
import Leads from "@/pages/sales/Leads";
import PipelineOverview from "@/pages/sales/PipelineOverview";
import SalesProcesses from "@/pages/sales/SalesProcesses";
import ResponsiblePersons from "@/pages/sales/ResponsiblePersons";
import ActivityCalendarPage from "@/pages/sales/ActivityCalendarPage";
import EmailTemplates from "@/pages/sales/EmailTemplates";

// Export the routes directly to be used in AppRoutes.tsx
export const SalesRoutes = [
  <Route key="leads" path="/sales/leads" element={<Leads />} />,
  <Route key="pipeline" path="/sales/pipeline" element={<PipelineOverview />} />,
  <Route key="processes" path="/sales/processes" element={<SalesProcesses />} />,
  <Route key="responsible-persons" path="/sales/responsible-persons" element={<ResponsiblePersons />} />,
  <Route key="activities" path="/sales/activities" element={<ActivityCalendarPage />} />,
  <Route key="email-templates" path="/sales/email-templates" element={<EmailTemplates />} />,
];

// Keep default export for backward compatibility
export default function SalesRoutesComponent() {
  return <>{SalesRoutes}</>;
}
