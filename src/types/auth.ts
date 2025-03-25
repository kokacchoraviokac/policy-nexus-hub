
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyId?: string;
}

export type UserRole = 'superAdmin' | 'admin' | 'employee';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
    
    // Reports
    'reports:view',
    
    // Granular permissions
    'policies.own:view', 'policies.own:edit',
    'claims.own:view', 'claims.own:edit',
    'policies.status:view',
    'claims.status:view',
  ]
};

// Enhanced permission checking function to support granular checks
export const checkGranularPrivilege = (
  role: UserRole | undefined,
  privilege: string,
  resourceContext?: {
    ownerId?: string;
    currentUserId?: string;
    companyId?: string;
    currentUserCompanyId?: string;
    resourceType?: string;
    resourceValue?: any;
    [key: string]: any;
  }
): boolean => {
  if (!role) return false;
  
  const userPrivileges = rolePrivileges[role];
  
  // Check for exact privilege match first
  if (userPrivileges.includes(privilege)) return true;
  
  // Check for module-level privilege (backward compatibility)
  const moduleLevelPrivilege = privilege.split('.')[0];
  if (userPrivileges.includes(`${moduleLevelPrivilege}:view`) && privilege.endsWith(':view')) return true;
  if (userPrivileges.includes(`${moduleLevelPrivilege}:edit`) && privilege.endsWith(':edit')) return true;
  if (userPrivileges.includes(`${moduleLevelPrivilege}:create`) && privilege.endsWith(':create')) return true;
  if (userPrivileges.includes(`${moduleLevelPrivilege}:delete`) && privilege.endsWith(':delete')) return true;
  
  // Context-based checks
  if (resourceContext) {
    // Own resource check
    if (
      privilege.includes('.own:') && 
      resourceContext.ownerId === resourceContext.currentUserId &&
      userPrivileges.includes(privilege)
    ) {
      return true;
    }
    
    // Company resource check
    if (
      privilege.includes('.company:') && 
      resourceContext.companyId === resourceContext.currentUserCompanyId &&
      userPrivileges.includes(privilege)
    ) {
      return true;
    }
    
    // Value-based checks (like highValue claims)
    if (
      privilege.includes('.highValue:') && 
      resourceContext.resourceType === 'amount' && 
      resourceContext.resourceValue < 10000 && // Example threshold
      userPrivileges.includes(privilege.replace('highValue', 'all'))
    ) {
      return true;
    }
  }
  
  return false;
};
