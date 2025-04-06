
import { Session } from "@supabase/supabase-js";

// Define UserRole
export type UserRole = 'superAdmin' | 'admin' | 'employee' | 'agent' | 'client' | 'super_admin';

// Define User interface
export interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  companyId?: string;
  company_id?: string; // For backward compatibility
  avatar?: string;
  avatarUrl?: string; // For backward compatibility
  avatar_url?: string; // For backward compatibility
  user_metadata?: Record<string, any>;
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

// Define CustomPrivilege interface
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string; // Changed from string | Record<string, any> to just string
}

// Export old types for backward compatibility
export * from './userTypes';
export * from './user';
