
import React from "react";
import { Route } from "react-router-dom";
import Leads from "@/pages/sales/Leads";
import PipelineOverview from "@/pages/sales/PipelineOverview";
import SalesProcesses from "@/pages/sales/SalesProcesses";
import ResponsiblePersons from "@/pages/sales/ResponsiblePersons";
import ActivityCalendarPage from "@/pages/sales/ActivityCalendarPage";
import EmailTemplates from "@/pages/sales/EmailTemplates";

const SalesRoutes = () => {
  return (
    <>
      <Route path="/sales/leads" element={<Leads />} />
      <Route path="/sales/pipeline" element={<PipelineOverview />} />
      <Route path="/sales/processes" element={<SalesProcesses />} />
      <Route path="/sales/responsible-persons" element={<ResponsiblePersons />} />
      <Route path="/sales/activities" element={<ActivityCalendarPage />} />
      <Route path="/sales/email-templates" element={<EmailTemplates />} />
    </>
  );
};

export default SalesRoutes;
