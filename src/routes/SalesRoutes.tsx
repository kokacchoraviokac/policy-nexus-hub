
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Sales from "@/pages/Sales";
import PipelineOverview from "@/pages/sales/PipelineOverview";
import Leads from "@/pages/sales/Leads";
import SalesProcesses from "@/pages/sales/SalesProcesses";
import ResponsiblePersons from "@/pages/sales/ResponsiblePersons";
import ActivityCalendarPage from "@/pages/sales/ActivityCalendarPage";

export const SalesRoutes = [
  <Route
    key="sales"
    path="/sales"
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <Sales />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="sales-pipeline"
    path="/sales/pipeline"
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <PipelineOverview />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="sales-leads"
    path="/sales/leads"
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <Leads />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="sales-processes"
    path="/sales/processes"
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <SalesProcesses />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="sales-responsible"
    path="/sales/responsible"
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <ResponsiblePersons />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="sales-calendar"
    path="/sales/calendar"
    element={
      <ProtectedRoute requiredPrivilege="sales:view">
        <AppLayout>
          <ActivityCalendarPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
