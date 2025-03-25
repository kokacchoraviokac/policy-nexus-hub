
import { User, UserRole, AuthState } from "@/types/auth";

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPrivilege: (privilege: string) => boolean;
  updateUser: (user: Partial<User>) => void;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
}
