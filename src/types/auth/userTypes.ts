
import { Session } from "@supabase/supabase-js";
import { UserRole } from "./index";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  companyId?: string;
  company_id?: string; // For backward compatibility
  avatar?: string;
  avatarUrl?: string; // For backward compatibility
  avatar_url?: string; // For backward compatibility
  user_metadata?: Record<string, any>;
}

export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  expires_at?: string | null;
  granted_by: string;
  context?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  customPrivileges: CustomPrivilege[];
}
