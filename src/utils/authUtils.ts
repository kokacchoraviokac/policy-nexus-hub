
import { supabase } from "@/integrations/supabase/client";
import { ResourceContext, UserPrivilege } from "@/types/auth/contextTypes";
import { CustomPrivilege } from "@/types/auth/userTypes";

// Helper to fetch a user's privileges from the database
export const fetchUserPrivileges = async (userId: string): Promise<UserPrivilege[]> => {
  try {
    const { data, error } = await supabase
      .from('user_privileges')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user privileges:', error);
      return [];
    }
    
    return data || [];
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
