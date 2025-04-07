
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserRole, CustomPrivilege, ResourceContext } from "@/types/auth/userTypes";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: User | null;
  role: UserRole | null;
  companyId: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  updateUser: (profile: Partial<User>) => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (privilege: string, context?: ResourceContext) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  customPrivileges: CustomPrivilege[];
}
