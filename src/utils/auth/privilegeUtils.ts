
import { supabase } from "@/integrations/supabase/client";
import { UserRole, CustomPrivilege } from "@/types/auth";
import { ResourceContext } from "@/types/auth/contextTypes";
import { rolePrivileges } from "@/types/auth/roles";
import { checkGranularPrivilege } from "@/types/auth/privileges";

// Simple privilege check (backward compatible)
export const checkPrivilege = (
  role: UserRole | undefined,
  privilege: string
): boolean => {
  if (!role) {
    console.log("No role provided in checkPrivilege");
    return false;
  }
  
  // For superadmin, grant all permissions
  if (role === 'superAdmin') {
    console.log(`Superadmin automatically granted privilege: ${privilege}`);
    return true;
  }
  
  const userPrivileges = rolePrivileges[role];
  if (!userPrivileges) {
    console.log(`No privileges found for role: ${role}`);
    return false;
  }
  
  const hasPrivilege = userPrivileges.includes(privilege);
  console.log(`Checking if role '${role}' has privilege '${privilege}': ${hasPrivilege}`);
  return hasPrivilege;
};

// Enhanced check with context
export const checkPrivilegeWithContext = (
  role: UserRole | undefined,
  privilege: string,
  context?: ResourceContext
): boolean => {
  // For superadmin, grant all permissions
  if (role === 'superAdmin') {
    return true;
  }
  
  return checkGranularPrivilege(role, privilege, context);
};

// Custom privilege management for the user_custom_privileges table
export const fetchUserCustomPrivileges = async (userId: string): Promise<CustomPrivilege[]> => {
  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .select('*')
      .eq('user_id', userId)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
      
    if (error) {
      console.error("Error fetching user custom privileges:", error);
      return [];
    }
    
    if (!data) return [];
    
    return data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      privilege: item.privilege,
      granted_by: item.granted_by,
      granted_at: item.granted_at,
      expires_at: item.expires_at || undefined,
      context: item.context
    }));
  } catch (error) {
    console.error("Error in custom privileges fetch:", error);
    return [];
  }
};

export const grantCustomPrivilege = async (
  userId: string,
  privilege: string,
  grantedBy: string,
  expiresAt?: Date
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_custom_privileges')
      .insert({
        user_id: userId,
        privilege,
        granted_by: grantedBy,
        expires_at: expiresAt?.toISOString()
      });
      
    if (error) {
      console.error("Error granting custom privilege:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in custom privilege grant:", error);
    return false;
  }
};

export const revokeCustomPrivilege = async (privilegeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_custom_privileges')
      .delete()
      .eq('id', privilegeId);
      
    if (error) {
      console.error("Error revoking custom privilege:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in custom privilege revocation:", error);
    return false;
  }
};
