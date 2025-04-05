
import { User, UserRole, AuthState, CustomPrivilege } from "@/types/auth/user";
import { Session } from "@supabase/supabase-js";

export interface ResourceContext {
  ownerId?: string;
  currentUserId?: string;
  companyId?: string;
  currentUserCompanyId?: string;
  resourceType?: string;
  resourceValue?: any;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  userProfile: any | null;
  role: UserRole | null;
  companyId: string | null;
  permissions: string[];
  customPrivileges: CustomPrivilege[];
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  // User management methods
  updateUser: (data: Partial<User>) => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  
  // Password management
  initiatePasswordReset: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  
  // Privilege checks
  hasPrivilege: (privilege: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPrivilegeWithContext: (
    privilege: string, 
    context?: ResourceContext
  ) => boolean;
  
  refreshSession: () => Promise<void>;
}
