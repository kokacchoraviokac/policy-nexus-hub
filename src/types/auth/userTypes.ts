
// User roles enum
export enum UserRole {
  ADMIN = "admin",
  SUPER_ADMIN = "superAdmin",
  EMPLOYEE = "employee",
  AGENT = "agent",
  CLIENT = "client",
  USER = "user"
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
  role: UserRole;
  company_id?: string;
  companyId?: string;
  user_metadata?: Record<string, any>;
  isAuthenticated?: boolean;
}

// Custom privilege interface
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  expires_at?: string;
  granted_by: string;
  context?: string | Record<string, any>;
}

// Interface for useAuth hook return type
export interface AuthState {
  user: User | null;
  session: any | null;
  isInitialized: boolean;
  isLoading: boolean;
  customPrivileges: CustomPrivilege[];
  isAuthenticated?: boolean;
}

// Export types without redundant declarations
