
import { Session } from "@supabase/supabase-js";

// Define UserRole as an enum
export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  AGENT = 'agent',
  CLIENT = 'client'
}

// Define User interface
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

// Define CustomPrivilege interface
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string;
}

// Define AuthState interface
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  customPrivileges: CustomPrivilege[];
}

// Define SignupFormValues
export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  companyOption: 'new' | 'existing' | 'invitation';
  companyId?: string;
  companyName?: string;
  invitationToken?: string;
}
