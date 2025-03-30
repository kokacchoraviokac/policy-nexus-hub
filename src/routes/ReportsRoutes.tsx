
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Reports from "@/pages/Reports";
import PolicyProductionReport from "@/pages/reports/PolicyProductionReport";
import ClientsReport from "@/pages/reports/ClientsReport";
import AgentsReport from "@/pages/reports/AgentsReport";
import ClaimsReport from "@/pages/reports/ClaimsReport";
import FinancialReport from "@/pages/reports/FinancialReport";

export const ReportsRoutes = [
  <Route
    key="reports"
    path="/reports"
    element={
      <ProtectedRoute>
        <AppLayout>
          <Reports />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="reports-policies"
    path="/reports/policies"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyProductionReport />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="reports-clients"
    path="/reports/clients"
    element={
      <ProtectedRoute>
        <AppLayout>
          <ClientsReport />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="reports-agents"
    path="/reports/agents"
    element={
      <ProtectedRoute>
        <AppLayout>
          <AgentsReport />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="reports-claims"
    path="/reports/claims"
    element={
      <ProtectedRoute>
        <AppLayout>
          <ClaimsReport />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="reports-financial"
    path="/reports/financial"
    element={
      <ProtectedRoute>
        <AppLayout>
          <FinancialReport />
        </AppLayout>
      </ProtectedRoute>
    }
  />
];
