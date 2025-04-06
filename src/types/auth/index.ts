
import { Session } from "@supabase/supabase-js";

// Define UserRole as an enum with all possible values
export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  AGENT = 'agent',
  CLIENT = 'client'
}

// Define User interface with consistent property types
export interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole | string;
  companyId?: string;
  company_id?: string; // For backward compatibility 
  avatar?: string;
  avatarUrl?: string; // For backward compatibility
  avatar_url?: string; // For backward compatibility
  user_metadata?: Record<string, any>;
}

// Define CustomPrivilege with string-only context
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string; // Only string type to resolve conflicts
}

// Define AuthState interface
export interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  isInitialized?: boolean;
  customPrivileges: CustomPrivilege[];
}

// Export the types
export type { User, CustomPrivilege, AuthState };
export { UserRole };

// Export type definitions from other auth modules
export * from './userTypes';
export * from './user';
