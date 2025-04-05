
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyId?: string;
}

export type UserRole = 'superAdmin' | 'admin' | 'employee' | 'agent';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CustomPrivilege {
  id: string;
  privilege: string;
  context?: Record<string, any>;
  description?: string;
  grantedBy?: string;
  grantedAt?: Date;
  expiresAt?: Date;
  userId?: string;
}
