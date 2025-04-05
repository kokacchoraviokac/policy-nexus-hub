
import React from 'react';
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { SalesRoutes } from "./SalesRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { FinancesRoutes } from "./FinancesRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import { ReportsRoutes } from "./ReportsRoutes";
import { AgentRoutes } from "./AgentRoutes";
import { documentRoutes } from "./documentRoutes";

// Convert all route objects/elements to arrays to ensure consistency
const ensureArray = (routes: any) => {
  if (!routes) return [];
  return Array.isArray(routes) ? routes : [routes];
};

export const ModuleRoutes = [
  ...ensureArray(DashboardRoutes),
  ...ensureArray(PolicyRoutes),
  ...ensureArray(SalesRoutes),
  ...ensureArray(ClaimsRoutes),
  ...ensureArray(FinancesRoutes),
  ...ensureArray(CodebookRoutes),
  ...ensureArray(AgentRoutes),
  ...ensureArray(ReportsRoutes),
  ...ensureArray(SettingsRoutes),
  ...ensureArray(documentRoutes)
];
