
import { User, UserRole, CustomPrivilege } from "./userTypes";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any; // Session information
}

export interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Additional methods
  login: (email: string, password: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any;
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (privilege: string, resourceContext?: ResourceContext) => boolean;
  hasRole: (role: string | string[]) => boolean;
  role?: string;
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  customPrivileges?: CustomPrivilege[];
  userProfile?: User | null;
  companyId?: string | null;
  isInitialized?: boolean;
  refreshSession?: () => Promise<void>;
  updateUserProfile?: (profile: Partial<User>) => Promise<void>;
  permissions?: string[];
}

export interface ResourceContext {
  resourceType?: string;
  resourceId?: string;
  companyId?: string;
  ownerId?: string;
  currentUserId?: string;
  currentUserCompanyId?: string;
  resourceValue?: any;
  [key: string]: any;
}

export interface UserPrivilege {
  id: string;
  name: string;
  description?: string;
}

export interface RolePrivilege {
  role: string;
  privileges: UserPrivilege[];
}
