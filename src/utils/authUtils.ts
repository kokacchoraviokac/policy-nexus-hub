
import { supabase } from "@/integrations/supabase/client";
import { CustomPrivilege } from "@/types/auth/userTypes";

/**
 * Fetch custom privileges for a user
 */
export const fetchUserCustomPrivileges = async (userId: string): Promise<CustomPrivilege[]> => {
  const { data, error } = await supabase
    .from("user_custom_privileges")
    .select("*")
    .eq("user_id", userId);
  
  if (error) {
    console.error("Error fetching user privileges:", error);
    return [];
  }
  
  return data as CustomPrivilege[];
};

/**
 * Grant a custom privilege to a user
 */
export const grantCustomPrivilege = async (userId: string, privilege: string, grantedBy: string, expiresAt?: string, context?: string): Promise<CustomPrivilege> => {
  const { data, error } = await supabase
    .from("user_custom_privileges")
    .insert({
      user_id: userId,
      privilege,
      granted_by: grantedBy,
      granted_at: new Date().toISOString(),
      expires_at: expiresAt,
      context
    })
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to grant privilege: ${error.message}`);
  }
  
  return data as CustomPrivilege;
};

/**
 * Revoke a custom privilege from a user
 */
export const revokeCustomPrivilege = async (privilegeId: string): Promise<void> => {
  const { error } = await supabase
    .from("user_custom_privileges")
    .delete()
    .eq("id", privilegeId);
  
  if (error) {
    throw new Error(`Failed to revoke privilege: ${error.message}`);
  }
};

/**
 * Check if a privilege is valid (not expired)
 */
export const isValidPrivilege = (privilege: CustomPrivilege): boolean => {
  if (!privilege.expires_at) return true;
  
  const expiryDate = new Date(privilege.expires_at);
  const now = new Date();
  
  return expiryDate > now;
};

/**
 * Format a date for display
 */
export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return date;
  }
};
