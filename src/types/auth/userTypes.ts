
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  AGENT = 'agent',
  CLIENT = 'client'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  company_id: string;
  // Alias properties for backward compatibility
  companyId?: string; 
  avatar?: string;
}

// Add CustomPrivilege interface
export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string | null;
  context?: string;
}
