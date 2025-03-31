
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";
import { useUserStore } from "@/stores/userStore";

interface ActivityLogData {
  entityType: string;
  entityId: string;
  action: string;
  details?: Record<string, any>;
}

export const useActivityLogger = () => {
  const { user } = useUserStore();
  
  const logActivity = useCallback(async (data: ActivityLogData) => {
    try {
      if (!user) {
        console.warn("Activity logging skipped: No authenticated user");
        return;
      }
      
      const { error } = await supabase.from('activity_logs').insert({
        entity_type: data.entityType,
        entity_id: data.entityId,
        action: data.action,
        details: data.details || {},
        user_id: user.id,
        company_id: user.company_id
      });
      
      if (error) {
        console.error("Failed to log activity:", error);
      }
    } catch (err) {
      console.error("Error in activity logging:", err);
    }
  }, [user]);
  
  return { logActivity };
};
