
import { supabase } from "@/integrations/supabase/client";
import { CustomPrivilege } from "@/types/auth/userTypes";

export const fetchUserCustomPrivileges = async (userId: string): Promise<CustomPrivilege[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from("user_custom_privileges")
      .select("*")
      .eq("user_id", userId);
      
    if (error) {
      console.error("Error fetching user privileges:", error);
      return [];
    }
    
    return data as CustomPrivilege[];
  } catch (error) {
    console.error("Unexpected error fetching privileges:", error);
    return [];
  }
};

export const isValidPrivilege = (privilege: CustomPrivilege): boolean => {
  // Check if the privilege has expired
  if (privilege.expires_at && new Date(privilege.expires_at) < new Date()) {
    return false;
  }
  
  return true;
};

export const grantCustomPrivilege = async (userId: string, privilege: string, expiresAt?: Date): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_custom_privileges")
      .insert({
        user_id: userId,
        privilege,
        granted_at: new Date().toISOString(),
        expires_at: expiresAt ? expiresAt.toISOString() : null
      });
      
    if (error) {
      console.error("Error granting privilege:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error granting privilege:", error);
    return false;
  }
};

export const revokeCustomPrivilege = async (userId: string, privilege: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("user_custom_privileges")
      .delete()
      .match({ user_id: userId, privilege });
      
    if (error) {
      console.error("Error revoking privilege:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Unexpected error revoking privilege:", error);
    return false;
  }
};
