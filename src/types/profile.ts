
import { User } from "@/types/auth/userTypes";

export interface ProfileEditFormProps {
  user: User;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export interface ProfileTabsProps {
  user: User;
}

export interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}
