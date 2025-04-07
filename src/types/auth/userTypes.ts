
import { Session } from "@supabase/supabase-js";

export enum UserRole {
  SUPER_ADMIN = "superAdmin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  AGENT = "agent",
  CLIENT = "client"
}

export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  companyId?: string;
  company_id?: string;
  avatar?: string;
  user_metadata?: Record<string, any>;
}

export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  expires_at?: string;
  granted_by: string;
  context?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: User | null;
  role: UserRole | null;
  companyId: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  updateUser: (profile: Partial<User>) => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (privilege: string, context?: any) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  customPrivileges: CustomPrivilege[];
}

export interface ResourceContext {
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name?: string;
  companyId?: string;
  role?: UserRole;
}
