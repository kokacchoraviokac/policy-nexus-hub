
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

export const ModuleRoutes = [
  ...(Array.isArray(DashboardRoutes) ? DashboardRoutes : [DashboardRoutes]),
  ...(Array.isArray(PolicyRoutes) ? PolicyRoutes : [PolicyRoutes]),
  ...(Array.isArray(SalesRoutes) ? SalesRoutes : [SalesRoutes]),
  ...(Array.isArray(ClaimsRoutes) ? ClaimsRoutes : [ClaimsRoutes]),
  ...(Array.isArray(FinancesRoutes) ? FinancesRoutes : [FinancesRoutes]),
  ...(Array.isArray(CodebookRoutes) ? CodebookRoutes : [CodebookRoutes]),
  ...(Array.isArray(AgentRoutes) ? AgentRoutes : [AgentRoutes]),
  ...(Array.isArray(ReportsRoutes) ? ReportsRoutes : [ReportsRoutes]),
  ...(Array.isArray(SettingsRoutes) ? SettingsRoutes : [SettingsRoutes]),
  ...(Array.isArray(documentRoutes) ? documentRoutes : [documentRoutes])
];
