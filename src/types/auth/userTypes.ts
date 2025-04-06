
import { Session } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'employee' | 'superAdmin' | 'agent' | string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
  company_id?: string; // For backward compatibility
  avatar?: string;
  avatarUrl?: string; // For backward compatibility
  avatar_url?: string; // For backward compatibility
}

export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  expires_at?: string | null;
  granted_by: string;
  context?: string | Record<string, any>;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  customPrivileges: CustomPrivilege[];
}
