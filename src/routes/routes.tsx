
import React from "react";
import { Route } from "react-router-dom";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes"; 
import { SalesRoutes } from "./SalesRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { FinancesRoutes } from "./FinancesRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { ReportsRoutes } from "./ReportsRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import AppLayout from "@/components/layout/AppLayout";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// This file now returns an array of route elements
const AppRoutes = [
  // Spread all route arrays - they're already arrays of React elements
  ...(Array.isArray(DashboardRoutes) ? DashboardRoutes : [DashboardRoutes]),
  ...(Array.isArray(PolicyRoutes) ? PolicyRoutes : [PolicyRoutes]),
  ...(Array.isArray(SalesRoutes) ? SalesRoutes : [SalesRoutes]),
  ...(Array.isArray(ClaimsRoutes) ? ClaimsRoutes : [ClaimsRoutes]),
  ...(Array.isArray(FinancesRoutes) ? FinancesRoutes : [FinancesRoutes]),
  ...(Array.isArray(CodebookRoutes) ? CodebookRoutes : [CodebookRoutes]),
  ...(Array.isArray(ReportsRoutes) ? ReportsRoutes : [ReportsRoutes]),
  ...(Array.isArray(SettingsRoutes) ? SettingsRoutes : [SettingsRoutes]),
  
  // 404
  <Route
    key="not-found"
    path="*"
    element={
      <AppLayout>
        <NotFound />
      </AppLayout>
    }
  />
];

export default AppRoutes;
