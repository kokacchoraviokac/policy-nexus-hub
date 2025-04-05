
import { Session } from "@supabase/supabase-js";

// Define UserRole
export type UserRole = 'superAdmin' | 'admin' | 'employee' | 'agent' | 'client';

// Define User interface
export interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  companyId?: string;
  avatar?: string;
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
