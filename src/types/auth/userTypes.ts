
export interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  companyId?: string;
  company_id?: string; // For backward compatibility
  avatar?: string;
  user_metadata?: Record<string, any>;
}

export interface CustomPrivilege {
  id: string;
  user_id: string;
  privilege: string;
  granted_at: string;
  granted_by: string;
  expires_at?: string;
  context?: Record<string, any>;
}
