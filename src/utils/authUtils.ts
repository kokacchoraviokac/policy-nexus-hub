
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, rolePrivileges } from "@/types/auth";
import { toast } from "sonner";

export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('name, email, role, avatar_url, company_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (profile) {
      return {
        id: userId,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        avatar: profile.avatar_url,
        companyId: profile.company_id,
      };
    }
    
    return null;
  } catch (err) {
    console.error("Error in profile fetch:", err);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  userData: Partial<User>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: userData.name,
        avatar_url: userData.avatar,
        ...(userData.role && { role: userData.role }),
        ...(userData.companyId && { company_id: userData.companyId }),
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
      return false;
    }
    
    toast.success("Profile updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Failed to update profile");
    return false;
  }
};

export const checkPrivilege = (
  role: UserRole | undefined,
  privilege: string
): boolean => {
  if (!role) return false;
  const userPrivileges = rolePrivileges[role];
  return userPrivileges.includes(privilege);
};
