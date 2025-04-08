
// Import type so we're not re-exporting it
import type { ResourceContext } from "./contextTypes";

// User roles
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  AGENT = 'agent',
  CLIENT = 'client',
  USER = 'user'
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  user_metadata?: Record<string, any>;
}

// Interfaces for authentication providers
export interface AuthProvider {
  id: string;
  name: string;
  icon: string;
  // Additional provider-specific properties here
}

// User authentication request
export interface AuthRequest {
  email: string;
  password: string;
  remember?: boolean;
}

// User registration request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// User invitation data
export interface InvitationData {
  email: string;
  role: UserRole;
  company_id?: string;
  expires_at?: string | Date;
}

// User invitation create request
export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  company_id?: string;
}

// User invitation
export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  company_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

// Auth error
export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

// Custom privilege for users
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  context?: string | Record<string, any>;
  expires_at?: string;
  granted_by?: string;
  granted_at?: string;
  created_at: string;
  updated_at: string;
}

// Re-export type to avoid circular dependency
export type { ResourceContext };
