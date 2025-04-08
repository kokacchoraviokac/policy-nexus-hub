
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserRole, CustomPrivilege } from "@/types/auth/userTypes";
import { ResourceContext } from "@/types/auth/contextTypes";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  customPrivileges: CustomPrivilege[];
  role: UserRole | null;
  companyId: string | null;
  
  // Auth operations
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  
  // Alternative operation names for backward compatibility
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  
  // Password management
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  
  // Authorization and privilege checking
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (privilege: string, context?: ResourceContext) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  checkPrivilege: (privilege: string, resource?: ResourceContext) => boolean;
}

// Map Supabase User to our User type
export const mapSupabaseUserToUser = (supabaseUser: SupabaseUser | null, existingUser?: Partial<User>): User | null => {
  if (!supabaseUser) return null;
  
  const user: User = {
    id: supabaseUser.id,
    name: existingUser?.name || supabaseUser.user_metadata?.name || "User",
    email: supabaseUser.email || "",
    role: (existingUser?.role || supabaseUser.user_metadata?.role || UserRole.USER) as UserRole,
    avatar_url: existingUser?.avatar_url || supabaseUser.user_metadata?.avatar_url,
    company_id: existingUser?.company_id || supabaseUser.user_metadata?.company_id,
    user_metadata: supabaseUser.user_metadata || {},
    created_at: supabaseUser.created_at,
    updated_at: supabaseUser.updated_at || supabaseUser.created_at,
    
    // Add backward compatibility aliases
    companyId: existingUser?.company_id || supabaseUser.user_metadata?.company_id,
    avatar: existingUser?.avatar_url || supabaseUser.user_metadata?.avatar_url
  };
  
  return user;
};
