
import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Reports from "@/pages/Reports";
import PolicyProductionReport from "@/pages/reports/PolicyProductionReport";

export const ReportsRoutes = [
  <Route
    key="reports"
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  >
    <Route index element={<Reports />} />
    <Route path="policies" element={<PolicyProductionReport />} />
  </Route>
];
