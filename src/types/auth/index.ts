
export { UserRole } from './userTypes';

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
  phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  privileges?: string[];
}

export * from './userTypes';
