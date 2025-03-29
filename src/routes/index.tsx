
import React from "react";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { ModuleRoutes } from "./ModuleRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";

// Combine all routes into a single array
// This will include both React.ReactElement objects (Route components)
// and route configuration objects with children
export const AppRoutes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  PolicyRoutes,
  ...ModuleRoutes,
  ...CodebookRoutes,
  ...SettingsRoutes
];
