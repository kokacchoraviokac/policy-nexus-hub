
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  USER = "user",
  AGENT = "agent",
  CLIENT = "client"
}

export interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
  companyId?: string;
  role?: UserRole;
  avatar_url?: string;
  avatar?: string; // Avatar alias for backward compatibility
  phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  privileges?: string[];
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

// Import ResourceContext from common.ts
import { ResourceContext } from '../common';
export { ResourceContext };
