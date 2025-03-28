
import React from "react";
import { AuthRoutes } from "./AuthRoutes";
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { ModuleRoutes } from "./ModuleRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";

export const AppRoutes = [
  ...AuthRoutes,
  ...DashboardRoutes,
  ...PolicyRoutes,
  ...ModuleRoutes,
  ...CodebookRoutes,
  ...SettingsRoutes
];
