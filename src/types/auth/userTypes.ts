
import { BaseEntity } from '../common';

// User roles in the system
export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  AGENT = 'agent',
  CLIENT = 'client',
  USER = 'user'
}

// Basic user interface
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  company_id: string;
  avatar_url?: string;
  user_metadata?: Record<string, any>;
  companyId?: string; // Keeping for backward compatibility
  avatar?: string; // Keeping for backward compatibility
}

// Custom privilege for users
export interface CustomPrivilege extends BaseEntity {
  user_id: string;
  privilege: string;
  context?: string | Record<string, any>;
  expires_at?: string;
  granted_by?: string;
  granted_at?: string;
}

// User state with session info
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: Error | null;
}

// Resource context for authorization
export interface ResourceContext {
  companyId?: string;
  organizationId?: string;
  [key: string]: any;
}

// Registration data
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  companyName?: string;
  role?: UserRole;
  company_id?: string;
}

// User profile update data
export interface UserProfileUpdate {
  name?: string;
  email?: string;
  avatar_url?: string;
  avatar?: string; // Backward compatibility
}
