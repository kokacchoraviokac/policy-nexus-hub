
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

export const useActivityLogger = () => {
  const { user } = useAuth();
  
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

// Function to fetch activity logs for an entity
export const fetchActivityLogs = async (entityType: EntityType, entityId: string) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        id,
        action,
        created_at as timestamp,
        user_id as user,
        details
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};
