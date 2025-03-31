
import { UserRole } from './user';

// Basic module-level privileges (backward compatible)
export const rolePrivileges = {
  superAdmin: [
    // Dashboard
    'dashboard:view',
    
    // Policies
    'policies:view', 'policies:create', 'policies:edit', 'policies:delete',
    
    // Sales
    'sales:view', 'sales:create', 'sales:edit', 'sales:delete',
    
    // Claims
    'claims:view', 'claims:create', 'claims:edit', 'claims:delete',
    
    // Finances
    'finances:view', 'finances:create', 'finances:edit', 'finances:delete',
    
    // Codebook
    'codebook:view', 'codebook:create', 'codebook:edit', 'codebook:delete',
    'codebook.clients:view', 'codebook.clients:create', 'codebook.clients:edit', 'codebook.clients:delete',
    'codebook.companies:view', 'codebook.companies:create', 'codebook.companies:edit', 'codebook.companies:delete',
    'codebook.insurers:view', 'codebook.insurers:create', 'codebook.insurers:edit', 'codebook.insurers:delete',
    'codebook.insurers.import', 'codebook.insurers.export',
    'codebook.codes:view', 'codebook.codes:create', 'codebook.codes:edit', 'codebook.codes:delete',
    
    // Agent
    'agent:view', 'agent:create', 'agent:edit', 'agent:delete',
    
    // Reports
    'reports:view', 'reports:create', 'reports:export',
    
    // Settings
    'settings:view', 'settings:edit',
    
    // User Management
    'users:manage', 'users:view',
    
    // Company Management
    'company:manage',
    
    // Granular permissions
    'policies.all:view', 'policies.all:edit',
    'policies.premium:edit', 'policies.dates:edit', 'policies.status:edit',
    'policies.company:view', 'policies.company:edit',
    'policies.own:view', 'policies.own:edit', 'policies.own:delete',
    
    'claims.all:view', 'claims.all:edit',
    'claims.status:edit', 'claims.amount:edit',
    'claims.highValue:view', 'claims.highValue:edit',
    'claims.own:view', 'claims.own:edit', 'claims.own:delete',
    
    'finances.commissions.all:view', 'finances.commissions.all:edit',
    'finances.invoicing.all:view', 'finances.invoicing.all:edit',
    'finances.statements.all:view', 'finances.statements.all:edit',
    
    'agent.commissions.all:view', 'agent.commissions.all:edit',
    'agent.payouts.all:view', 'agent.payouts.all:edit',
  ],
  admin: [
    // Dashboard
    'dashboard:view',
    
    // Policies
    'policies:view', 'policies:create', 'policies:edit', 'policies:delete',
    
    // Sales
    'sales:view', 'sales:create', 'sales:edit', 'sales:delete',
    
    // Claims
    'claims:view', 'claims:create', 'claims:edit', 'claims:delete',
    
    // Finances
    'finances:view', 'finances:create', 'finances:edit',
    
    // Codebook
    'codebook:view', 'codebook:create', 'codebook:edit',
    'codebook.clients:view', 'codebook.clients:create', 'codebook.clients:edit',
    'codebook.companies:view', 'codebook.companies:create', 'codebook.companies:edit',
    'codebook.codes:view', 'codebook.codes:create', 'codebook.codes:edit',
    
    // Agent
    'agent:view',
    
    // Reports
    'reports:view', 'reports:export',
    
    // Settings
    'settings:view',
    
    // User Management
    'users:manage', 'users:view',
    
    // Granular permissions
    'policies.company:view', 'policies.company:edit',
    'policies.premium:edit', 'policies.dates:edit', 'policies.status:edit',
    'policies.own:view', 'policies.own:edit', 'policies.own:delete',
    
    'claims.company:view', 'claims.company:edit',
    'claims.status:edit', 'claims.amount:edit',
    'claims.own:view', 'claims.own:edit', 'claims.own:delete',
    
    'finances.commissions.company:view', 'finances.commissions.company:edit',
    'finances.invoicing.company:view', 'finances.invoicing.company:edit',
    'finances.statements.company:view', 'finances.statements.company:edit',
    
    'agent.commissions.company:view',
    'agent.payouts.company:view',
  ],
  employee: [
    // Dashboard
    'dashboard:view',
    
    // Policies
    'policies:view', 'policies:create', 
    
    // Sales
    'sales:view', 'sales:create',
    
    // Claims
    'claims:view', 'claims:create',
    
    // Codebook
    'codebook:view',
    'codebook.clients:view',
    'codebook.companies:view',
    'codebook.codes:view',
    
    // Reports
    'reports:view',
    
    // Granular permissions
    'policies.own:view', 'policies.own:edit',
    'claims.own:view', 'claims.own:edit',
    'policies.status:view',
    'claims.status:view',
  ]
};
