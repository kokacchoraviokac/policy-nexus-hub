
import { User, UserRole, AuthState, CustomPrivilege } from "@/types/auth";
import { Session } from "@supabase/supabase-js";

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
  
  // Auth operations renamed from original context
  login: (email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (
    privilege: string, 
    context?: {
      ownerId?: string;
      currentUserId?: string;
      companyId?: string;
      currentUserCompanyId?: string;
      resourceType?: string;
      resourceValue?: any;
      [key: string]: any;
    }
  ) => boolean;
  
  // Additional properties for custom privileges
  customPrivileges: CustomPrivilege[];
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}
