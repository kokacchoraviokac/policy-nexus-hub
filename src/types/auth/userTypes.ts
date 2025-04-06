
// Define available user roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  AGENT = 'agent',
  CLIENT = 'client'
}

// Base user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  is_active?: boolean;
}

// Custom privileges for users
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  expires_at?: string;
  granted_by: string;
}

// Auth state representation
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}
