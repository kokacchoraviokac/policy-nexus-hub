
import { supabase } from "@/integrations/supabase/client";

export type EntityType = 
  | "policy" 
  | "claim" 
  | "client" 
  | "insurer" 
  | "sales_process" 
  | "agent" 
  | "policy_document"
  | "lead";

interface ActivityLogParams {
  entityType: EntityType;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'view' | string;
  details?: Record<string, any>;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: Record<string, any>;
}

export const useActivityLogger = () => {
  // We need to create a proper hook for authentication
  const user = useAuth();
  
  const logActivity = async (params: ActivityLogParams) => {
    if (!user) {
      console.warn("Cannot log activity: No authenticated user");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          entity_type: params.entityType,
          entity_id: params.entityId,
          action: params.action,
          details: params.details || {},
          company_id: user.company_id
        });
      
      if (error) {
        console.error("Error logging activity:", error);
      }
    } catch (error) {
      console.error("Exception while logging activity:", error);
    }
  };
  
  return { logActivity };
};

// Helper function to get the authenticated user
function useAuth() {
  // Simple implementation just for the activity logger
  // This should be replaced with proper authentication hook
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
  return storedUser ? JSON.parse(storedUser) : null;
}

// Function to fetch activity logs for an entity
export const fetchActivityLogs = async (entityType: EntityType, entityId: string): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        created_at,
        user_id,
        details
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transform the data to match the ActivityLog interface
    // Parse or ensure details is a proper object and not a string
    return (data || []).map(item => ({
      id: item.id,
      action: item.action,
      timestamp: item.created_at,
      user: item.user_id,
      details: typeof item.details === 'string' 
        ? JSON.parse(item.details)
        : item.details || {}
    }));
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};
