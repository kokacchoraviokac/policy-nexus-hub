
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

// Export types - use export type to avoid conflicts with isolatedModules
export type { User, CustomPrivilege, AuthState };

// Export enum
export { UserRole };

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

// Define auth context related types
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
