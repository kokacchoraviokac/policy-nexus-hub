import { supabase } from "@/integrations/supabase/client";
import { User, UserRole, rolePrivileges, checkGranularPrivilege } from "@/types/auth";
import { ResourceContext } from "@/types/auth/contextTypes";
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
      // Validate role - ensure it's a valid role type
      const role = profile.role as UserRole;
      if (!Object.keys(rolePrivileges).includes(role)) {
        console.warn(`User has invalid role "${role}", defaulting to "employee"`);
        profile.role = 'employee';
      }
      
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

// Ensure profile creation with proper defaults when needed
export const ensureUserProfile = async (userId: string, userData: Partial<User>): Promise<boolean> => {
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      // Some error other than "not found"
      console.error("Error checking for existing profile:", checkError);
      return false;
    }
    
    // If profile exists, no need to create
    if (existingProfile) {
      return true;
    }
    
    // Profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: userData.name || 'User',
        email: userData.email || '',
        role: userData.role || 'employee',
        avatar_url: userData.avatar,
        company_id: userData.companyId,
      });
      
    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return false;
    }
    
    console.log("Profile created successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in profile creation process:", error);
    return false;
  }
};

// Simple privilege check (backward compatible)
export const checkPrivilege = (
  role: UserRole | undefined,
  privilege: string
): boolean => {
  if (!role) return false;
  const userPrivileges = rolePrivileges[role];
  return userPrivileges.includes(privilege);
};

// Enhanced check with context
export const checkPrivilegeWithContext = (
  role: UserRole | undefined,
  privilege: string,
  context?: ResourceContext
): boolean => {
  return checkGranularPrivilege(role, privilege, context);
};
