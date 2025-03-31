
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import ReportsPage from "@/pages/Reports";
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
          <ReportsPage />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="production-report"
    path="/reports/production"
    element={
      <ProtectedRoute>
        <AppLayout>
          <PolicyProductionReport />
        </AppLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="clients-report"
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
    key="agents-report"
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
    key="claims-report"
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
    key="financial-report"
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
