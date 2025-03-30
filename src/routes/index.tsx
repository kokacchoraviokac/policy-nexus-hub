
import React from "react";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { ModuleRoutes } from "./ModuleRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";

// Combine all routes into a single array
// Now all route groups are consistent in how they're structured
export const AppRoutes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  ...PolicyRoutes,
  ...ClaimsRoutes,
  ...ModuleRoutes,
  ...CodebookRoutes,
  ...SettingsRoutes
];
