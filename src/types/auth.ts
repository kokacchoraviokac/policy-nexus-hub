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
    'company:manage'
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
    'users:manage', 'users:view'
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
    'reports:view'
  ]
};
