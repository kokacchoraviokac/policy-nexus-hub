
import { DashboardRoutes } from "./DashboardRoutes";
import { PolicyRoutes } from "./PolicyRoutes";
import { SalesRoutes } from "./SalesRoutes";
import { ClaimsRoutes } from "./ClaimsRoutes";
import { FinancesRoutes } from "./FinancesRoutes";
import { CodebookRoutes } from "./CodebookRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import { ReportsRoutes } from "./ReportsRoutes";
import { AgentRoutes } from "./AgentRoutes";

export const ModuleRoutes = [
  ...DashboardRoutes,
  ...PolicyRoutes,
  ...SalesRoutes,
  ...ClaimsRoutes,
  ...FinancesRoutes,
  ...CodebookRoutes,
  ...AgentRoutes,
  ...ReportsRoutes,
  ...SettingsRoutes
];
