
import { User, UserRole } from './user';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  userProfile: any | null; // The user profile from the database
  role: UserRole | null;
  companyId: string | null;
  permissions: string[];
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  initiatePasswordReset: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  hasPrivilege: (privilege: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  refreshSession: () => Promise<void>;
}
