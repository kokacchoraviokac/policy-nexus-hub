
export type UserRole = "superAdmin" | "admin" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Define privileges by role with more granularity for sub-modules
export const rolePrivileges: Record<UserRole, string[]> = {
  superAdmin: [
    // Dashboard
    "dashboard:view", 
    
    // Policies module and sub-modules
    "policies:view", "policies:create", "policies:edit", "policies:delete",
    "policies.all:view", "policies.all:export",
    "policies.workflow:view", "policies.workflow:create", "policies.workflow:edit",
    "policies.addendums:view", "policies.addendums:create", "policies.addendums:edit",
    "policies.unlinked:view", "policies.unlinked:link",
    "policies.documents:view", "policies.documents:upload", "policies.documents:delete",
    
    // Sales module and sub-modules
    "sales:view", "sales:create", "sales:edit", "sales:delete", 
    "sales.pipeline:view",
    "sales.leads:view", "sales.leads:create", "sales.leads:edit", "sales.leads:delete", "sales.leads:convert",
    "sales.processes:view", "sales.processes:create", "sales.processes:edit", "sales.processes:update-status",
    "sales.persons:view", "sales.persons:assign", "sales.persons:reassign",
    
    // Claims module
    "claims:view", "claims:create", "claims:edit", "claims:delete", "claims:update-status",
    
    // Finances module and sub-modules
    "finances:view", "finances:create", "finances:edit", "finances:delete", 
    "finances.commissions:view", "finances.commissions:calculate", "finances.commissions:adjust",
    "finances.invoicing:view", "finances.invoicing:create", "finances.invoicing:edit", "finances.invoicing:mark-paid",
    "finances.statements:view", "finances.statements:import", "finances.statements:process", "finances.statements:match",
    
    // Codebook module and sub-modules
    "codebook:view", "codebook:create", "codebook:edit", "codebook:delete",
    "codebook.clients:view", "codebook.clients:create", "codebook.clients:edit", "codebook.clients:delete",
    "codebook.companies:view", "codebook.companies:create", "codebook.companies:edit", "codebook.companies:delete",
    "codebook.codes:view", "codebook.codes:create", "codebook.codes:edit", "codebook.codes:delete",
    
    // Agent module and sub-modules
    "agent:view", "agent:create", "agent:edit", "agent:delete",
    "agent.fixed-commissions:view", "agent.fixed-commissions:create", "agent.fixed-commissions:edit", 
    "agent.client-commissions:view", "agent.client-commissions:create", "agent.client-commissions:edit",
    "agent.manual-commissions:view", "agent.manual-commissions:create", "agent.manual-commissions:edit",
    "agent.calculate-payouts:view", "agent.calculate-payouts:calculate", "agent.calculate-payouts:finalize",
    "agent.payout-reports:view", "agent.payout-reports:export",
    
    // Reports module and sub-modules
    "reports:view", "reports:generate", "reports:export",
    "reports.production:view", "reports.production:generate", "reports.production:export",
    "reports.clients:view", "reports.clients:generate", "reports.clients:export",
    "reports.agents:view", "reports.agents:generate", "reports.agents:export",
    "reports.claims:view", "reports.claims:generate", "reports.claims:export",
    
    // Settings module and sub-modules
    "settings:view", "settings:edit", 
    "users:manage", "users:create", "users:edit", "users:delete",
    "companies:manage", "companies:create", "companies:edit", "companies:delete",
    "settings.company-data:view", "settings.company-data:edit",
    "settings.instructions:view", "settings.instructions:create", "settings.instructions:edit", "settings.instructions:delete",
    "settings.email:view", "settings.email:edit"
  ],
  
  admin: [
    // Dashboard
    "dashboard:view", 
    
    // Policies module and sub-modules
    "policies:view", "policies:create", "policies:edit", "policies:delete",
    "policies.all:view", "policies.all:export",
    "policies.workflow:view", "policies.workflow:create", "policies.workflow:edit",
    "policies.addendums:view", "policies.addendums:create", "policies.addendums:edit",
    "policies.unlinked:view", "policies.unlinked:link",
    "policies.documents:view", "policies.documents:upload", "policies.documents:delete",
    
    // Sales module and sub-modules
    "sales:view", "sales:create", "sales:edit", "sales:delete", 
    "sales.pipeline:view",
    "sales.leads:view", "sales.leads:create", "sales.leads:edit", "sales.leads:delete", "sales.leads:convert",
    "sales.processes:view", "sales.processes:create", "sales.processes:edit", "sales.processes:update-status",
    "sales.persons:view", "sales.persons:assign", "sales.persons:reassign",
    
    // Claims module
    "claims:view", "claims:create", "claims:edit", "claims:delete", "claims:update-status",
    
    // Finances module and sub-modules
    "finances:view", "finances:create", "finances:edit", "finances:delete", 
    "finances.commissions:view", "finances.commissions:calculate", "finances.commissions:adjust",
    "finances.invoicing:view", "finances.invoicing:create", "finances.invoicing:edit", "finances.invoicing:mark-paid",
    "finances.statements:view", "finances.statements:import", "finances.statements:process", "finances.statements:match",
    
    // Codebook module and sub-modules
    "codebook:view", "codebook:create", "codebook:edit", "codebook:delete",
    "codebook.clients:view", "codebook.clients:create", "codebook.clients:edit", "codebook.clients:delete",
    "codebook.companies:view", "codebook.companies:create", "codebook.companies:edit", "codebook.companies:delete",
    "codebook.codes:view", "codebook.codes:create", "codebook.codes:edit", "codebook.codes:delete",
    
    // Agent module and sub-modules
    "agent:view", "agent:create", "agent:edit", "agent:delete",
    "agent.fixed-commissions:view", "agent.fixed-commissions:create", "agent.fixed-commissions:edit", 
    "agent.client-commissions:view", "agent.client-commissions:create", "agent.client-commissions:edit",
    "agent.manual-commissions:view", "agent.manual-commissions:create", "agent.manual-commissions:edit",
    "agent.calculate-payouts:view", "agent.calculate-payouts:calculate", "agent.calculate-payouts:finalize",
    "agent.payout-reports:view", "agent.payout-reports:export",
    
    // Reports module and sub-modules
    "reports:view", "reports:generate", "reports:export",
    "reports.production:view", "reports.production:generate", "reports.production:export",
    "reports.clients:view", "reports.clients:generate", "reports.clients:export",
    "reports.agents:view", "reports.agents:generate", "reports.agents:export",
    "reports.claims:view", "reports.claims:generate", "reports.claims:export",
    
    // Settings module and sub-modules - limited for admins
    "settings:view", "settings:edit", 
    "users:manage", "users:create", "users:edit", "users:delete", // But only for their company
    "settings.company-data:view", "settings.company-data:edit",
    "settings.instructions:view", "settings.instructions:create", "settings.instructions:edit", "settings.instructions:delete",
    "settings.email:view", "settings.email:edit"
    // No companies:manage privileges
  ],
  
  employee: [
    // Dashboard - view only
    "dashboard:view", 
    
    // Policies module - limited permissions
    "policies:view", "policies:create", "policies:edit",
    "policies.all:view",
    "policies.workflow:view", "policies.workflow:create", "policies.workflow:edit",
    "policies.addendums:view", "policies.addendums:create",
    "policies.unlinked:view",
    "policies.documents:view", "policies.documents:upload",
    
    // Sales module - limited permissions
    "sales:view", "sales:create", 
    "sales.pipeline:view",
    "sales.leads:view", "sales.leads:create", "sales.leads:edit",
    "sales.processes:view", "sales.processes:create", "sales.processes:update-status",
    "sales.persons:view",
    
    // Claims module - limited permissions
    "claims:view", "claims:create",
    
    // Finances module - view only
    "finances:view", 
    "finances.commissions:view",
    "finances.invoicing:view",
    
    // Codebook module - view only
    "codebook:view",
    "codebook.clients:view",
    "codebook.companies:view",
    "codebook.codes:view",
    
    // Agent module - view only
    "agent:view",
    "agent.fixed-commissions:view", 
    "agent.client-commissions:view",
    "agent.manual-commissions:view",
    "agent.payout-reports:view",
    
    // Reports module - view only, basic reports
    "reports:view",
    "reports.production:view",
    "reports.clients:view"
    // No settings privileges
  ]
};
