
import { User } from "./userTypes";

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
  login?: (email: string, password: string) => Promise<void>;
  logout?: () => Promise<void>;
  updateUser?: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any;
  hasPrivilege: (privilege: string) => boolean;
  hasPrivilegeWithContext: (privilege: string, resourceContext?: ResourceContext) => boolean;
}

export interface ResourceContext {
  resourceType?: string;
  resourceId?: string;
  companyId?: string;
  ownerId?: string;
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
