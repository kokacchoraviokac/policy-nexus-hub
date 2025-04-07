
// Update the UserTypes to include CustomPrivilege

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  SUPER_ADMIN = 'superAdmin',  // Keep this as 'superAdmin' to match existing code
  AGENT = 'agent',
  CLIENT = 'client'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  avatar?: string;
  companyId?: string; // Alias for company_id to maintain compatibility
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string;
}

// Export the UserRole for use in other modules
export { UserRole as default };
