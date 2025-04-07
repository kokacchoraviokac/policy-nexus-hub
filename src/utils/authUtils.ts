
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
