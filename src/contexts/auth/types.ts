
import { User, UserRole, AuthState, CustomPrivilege } from "@/types/auth";

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  updateUser: (user: Partial<User>) => void;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  // New properties
  customPrivileges: CustomPrivilege[];
  initiatePasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}
