
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ActivityLogParams {
  entityType: string;
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
