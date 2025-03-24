
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

// Define privileges by role
export const rolePrivileges: Record<UserRole, string[]> = {
  superAdmin: [
    "dashboard:view", 
    "policies:view", "policies:create", "policies:edit", "policies:delete",
    "sales:view", "sales:create", "sales:edit", "sales:delete", 
    "claims:view", "claims:create", "claims:edit", "claims:delete",
    "finances:view", "finances:create", "finances:edit", "finances:delete", 
    "codebook:view", "codebook:create", "codebook:edit", "codebook:delete",
    "agent:view", "agent:create", "agent:edit", "agent:delete",
    "reports:view", "reports:generate", "reports:export",
    "settings:view", "settings:edit", "users:manage", "companies:manage"
  ],
  admin: [
    "dashboard:view", 
    "policies:view", "policies:create", "policies:edit", "policies:delete",
    "sales:view", "sales:create", "sales:edit", "sales:delete", 
    "claims:view", "claims:create", "claims:edit", "claims:delete",
    "finances:view", "finances:create", "finances:edit", "finances:delete", 
    "codebook:view", "codebook:create", "codebook:edit", "codebook:delete",
    "agent:view", "agent:create", "agent:edit", "agent:delete",
    "reports:view", "reports:generate", "reports:export",
    "settings:view", "settings:edit", "users:manage"
  ],
  employee: [
    "dashboard:view", 
    "policies:view", "policies:create", "policies:edit",
    "sales:view", "sales:create", 
    "claims:view", "claims:create",
    "finances:view", 
    "codebook:view",
    "agent:view",
    "reports:view"
  ]
};
