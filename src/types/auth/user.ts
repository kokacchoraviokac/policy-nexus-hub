
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
  user_metadata?: Record<string, any>; // Added for compatibility
}

// Define AuthState interface
export interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

// Define CustomPrivilege interface
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string;
  context?: string;
}
