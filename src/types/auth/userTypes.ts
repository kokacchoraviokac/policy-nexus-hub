
// Define available user roles
export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
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
  companyId?: string; // For backward compatibility
  avatar_url?: string;
  avatar?: string; // For backward compatibility
  avatarUrl?: string; // For backward compatibility
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
  context?: string; // Added context property
}

// Auth state representation
export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}
