
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User, UserRole, CustomPrivilege } from "@/types/auth/userTypes";
import { ResourceContext } from "@/types/common";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  customPrivileges: CustomPrivilege[];
  checkPrivilege: (privilege: string, resource?: ResourceContext) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// We need a mapper from Supabase User to our User type
export const mapSupabaseUserToUser = (supabaseUser: SupabaseUser | null, existingUser?: Partial<User>): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    name: existingUser?.name || supabaseUser.user_metadata?.name || "User",
    email: supabaseUser.email || "",
    role: (existingUser?.role || supabaseUser.user_metadata?.role || UserRole.USER) as UserRole,
    avatar_url: existingUser?.avatar_url || supabaseUser.user_metadata?.avatar_url,
    company_id: existingUser?.company_id || supabaseUser.user_metadata?.company_id,
    user_metadata: supabaseUser.user_metadata || {},
    isAuthenticated: true
  };
};
