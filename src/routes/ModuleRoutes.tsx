
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

// Export all routes for direct import
export const ModuleRoutes = [
  ...DashboardRoutes,
  ...PolicyRoutes,
  ...SalesRoutes,
  ...ClaimsRoutes,
  ...FinancesRoutes,
  ...CodebookRoutes,
  ...AgentRoutes,
  ...ReportsRoutes,
  ...SettingsRoutes,
  ...documentRoutes
];

// Default export for backwards compatibility
export default ModuleRoutes;
