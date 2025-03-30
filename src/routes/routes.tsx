
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
  // Dashboard Routes
  ...React.Children.toArray(DashboardRoutes.props.children),
  
  // Policies Routes
  ...React.Children.toArray(PolicyRoutes.props.children),
  
  // Sales Routes
  ...React.Children.toArray(SalesRoutes.props.children),
  
  // Claims Routes
  ...React.Children.toArray(ClaimsRoutes.props.children),
  
  // Finances Routes
  ...React.Children.toArray(FinancesRoutes.props.children),
  
  // Codebook Routes
  ...React.Children.toArray(CodebookRoutes.props.children),
  
  // Reports Routes
  ...React.Children.toArray(ReportsRoutes.props.children),
  
  // Settings Routes
  ...React.Children.toArray(SettingsRoutes.props.children),
  
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
