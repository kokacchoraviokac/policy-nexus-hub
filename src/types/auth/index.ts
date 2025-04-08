
import { UserRole } from "./userTypes";

export * from "./userTypes";
export type { ResourceContext } from "./contextTypes";

// User state
export interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  customPrivileges: CustomPrivilege[];
  error?: Error | null;
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  user_metadata?: Record<string, any>;
  
  // Backward compatibility aliases
  companyId?: string; // Alias for company_id
  avatar?: string;    // Alias for avatar_url
}

// Custom privilege for users
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  context?: string | Record<string, any>;
  expires_at?: string;
  granted_by?: string;
  granted_at?: string;
  created_at: string;
  updated_at: string;
}
