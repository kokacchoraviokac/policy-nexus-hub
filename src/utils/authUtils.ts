
import { supabase } from "@/integrations/supabase/client";
import { ResourceContext, UserPrivilege } from "@/types/auth/contextTypes";
import { CustomPrivilege } from "@/types/auth/userTypes";

// Helper to fetch a user's privileges from the database
export const fetchUserPrivileges = async (userId: string): Promise<UserPrivilege[]> => {
  try {
    // We need to handle the table name type correctly
    const { data, error } = await supabase
      .from('user_privileges' as any)
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user privileges:', error);
      return [];
    }
    
    // Use type assertion to handle possible unknown types
    return (data || []) as unknown as UserPrivilege[];
  } catch (error) {
    console.error('Exception fetching user privileges:', error);
    return [];
  }
};

// Helper to fetch a user's custom privileges from the database
export const fetchUserCustomPrivileges = async (userId: string): Promise<CustomPrivilege[]> => {
  try {
    const { data, error } = await supabase
      .from('user_custom_privileges')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user custom privileges:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching user custom privileges:', error);
    return [];
  }
};

// Helper to grant a custom privilege to a user
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
      console.error('Error granting custom privilege:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception granting custom privilege:', error);
    return false;
  }
};

// Helper to revoke a custom privilege
export const revokeCustomPrivilege = async (privilegeId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_custom_privileges')
      .delete()
      .eq('id', privilegeId);
      
    if (error) {
      console.error('Error revoking custom privilege:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception revoking custom privilege:', error);
    return false;
  }
};

// Check if user has a specific privilege with context 
export const hasPrivilegeWithContext = (
  privilege: string,
  userPrivileges: CustomPrivilege[],
  context?: ResourceContext
): boolean => {
  if (!userPrivileges?.length) return false;
  
  return userPrivileges.some(p => {
    if (p.privilege !== privilege) return false;
    
    if (!p.context && !context) return true;
    
    if (!p.context || !context) return false;
    
    // Parse context if it's a string
    const privilegeContext = typeof p.context === 'string' 
      ? JSON.parse(p.context) 
      : p.context;
    
    // Handle company context match
    if (context.companyId && privilegeContext.companyId) {
      if (privilegeContext.companyId !== context.companyId) return false;
    }
    
    // Handle owner context match
    if (context.ownerId && privilegeContext.ownerId) {
      if (privilegeContext.ownerId !== context.ownerId) return false;
    }
    
    // Handle resource type context match
    if (context.resourceType && privilegeContext.resourceType) {
      if (privilegeContext.resourceType !== context.resourceType) return false;
    }
    
    // Handle resource ID context match
    if (context.resourceId && privilegeContext.resourceId) {
      if (privilegeContext.resourceId !== context.resourceId) return false;
    }
    
    // Handle current user context match
    if (context.currentUserId && privilegeContext.currentUserId) {
      if (privilegeContext.currentUserId !== context.currentUserId) return false;
    }
    
    return true;
  });
};

// Simple function to check if a user has a specific privilege
export const hasPrivilege = (
  privilege: string,
  userPrivileges: CustomPrivilege[]
): boolean => {
  if (!userPrivileges?.length) return false;
  
  return userPrivileges.some(p => p.privilege === privilege);
};
