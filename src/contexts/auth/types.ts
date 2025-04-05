
import { User, UserRole, AuthState, CustomPrivilege } from "@/types/auth/user";
import { Session } from "@supabase/supabase-js";
import { ResourceContext } from "@/types/auth/contextTypes";

export interface AuthContextType {
  user: User | null;
  session?: Session | null;
  userProfile: User | null;
  role: UserRole | null;
  companyId: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  
  // Auth operations 
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (
    privilege: string, 
    context?: ResourceContext
  ) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  
  // Additional properties for custom privileges
  customPrivileges: CustomPrivilege[];
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  permissions?: string[];
}
