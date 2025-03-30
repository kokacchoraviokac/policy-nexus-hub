
import React from "react";
import { Route, Routes } from "react-router-dom";
import { DashboardRoutes } from "./DashboardRoutes";
import { PoliciesRoutes } from "./PoliciesRoutes";
import { SalesRoutes } from "./SalesRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { FinancesRoutes } from "./FinancesRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { AgentPortalRoutes } from "./AgentPortalRoutes";
import { ReportsRoutes } from "./ReportsRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import { AuthRoutes } from "./AuthRoutes";
import AppLayout from "@/components/layout/AppLayout";
import NotFoundPage from "@/pages/NotFoundPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      {AuthRoutes}
      
      {/* Dashboard Routes */}
      {DashboardRoutes}
      
      {/* Policies Routes */}
      {PoliciesRoutes}
      
      {/* Sales Routes */}
      {SalesRoutes}
      
      {/* Claims Routes */}
      {ClaimsRoutes}
      
      {/* Finances Routes */}
      {FinancesRoutes}
      
      {/* Codebook Routes */}
      {CodebookRoutes}
      
      {/* Agent Portal Routes */}
      {AgentPortalRoutes}
      
      {/* Reports Routes */}
      {ReportsRoutes}
      
      {/* Settings Routes */}
      {SettingsRoutes}
      
      {/* 404 */}
      <Route
        path="*"
        element={
          <AppLayout>
            <NotFoundPage />
          </AppLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
