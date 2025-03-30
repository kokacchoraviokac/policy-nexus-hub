
import React from "react";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { ModuleRoutes } from "./ModuleRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import { FinancesRoutes } from "./FinancesRoutes";

// Combine all routes into a single array
export const AppRoutes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  ...PolicyRoutes,
  ...ClaimsRoutes,
  ...ModuleRoutes,
  ...CodebookRoutes,
  ...SettingsRoutes,
  ...FinancesRoutes
];
