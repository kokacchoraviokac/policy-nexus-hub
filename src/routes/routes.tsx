
import React from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes"; 
import { SalesRoutes } from "./SalesRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { FinancesRoutes } from "./FinancesRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { ReportsRoutes } from "./ReportsRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import { AuthRoutes } from "./AuthRoutes";
import AppLayout from "@/components/layout/AppLayout";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      {AuthRoutes}
      
      {/* Dashboard Routes */}
      {DashboardRoutes}
      
      {/* Policies Routes */}
      {PolicyRoutes}
      
      {/* Sales Routes */}
      {SalesRoutes}
      
      {/* Claims Routes */}
      {ClaimsRoutes}
      
      {/* Finances Routes */}
      {FinancesRoutes}
      
      {/* Codebook Routes */}
      {CodebookRoutes}
      
      {/* Reports Routes */}
      {ReportsRoutes}
      
      {/* Settings Routes */}
      {SettingsRoutes}
      
      {/* 404 */}
      <Route
        path="*"
        element={
          <AppLayout>
            <NotFound />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
