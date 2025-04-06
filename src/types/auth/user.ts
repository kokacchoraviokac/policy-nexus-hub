
import { Session } from "@supabase/supabase-js";
import { UserRole } from "./index";

// Define User interface
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

// Define AuthState interface
export interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  customPrivileges: CustomPrivilege[];
}

// Define CustomPrivilege interface - matched with index.ts
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string;
}
