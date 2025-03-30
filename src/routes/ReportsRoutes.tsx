
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
  >
    <Route index element={<Reports />} />
    <Route path="policies" element={<PolicyProductionReport />} />
    <Route path="clients" element={<ClientsReport />} />
    <Route path="agents" element={<AgentsReport />} />
    <Route path="claims" element={<ClaimsReport />} />
    <Route path="financial" element={<FinancialReport />} />
  </Route>
];
