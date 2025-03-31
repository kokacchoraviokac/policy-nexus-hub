
import { supabase } from "@/integrations/supabase/client";

// Redefine EntityType to be compatible with documents.EntityType
export type EntityType = 
  | 'policy' 
  | 'claim' 
  | 'client' 
  | 'invoice' 
  | 'addendum' 
  | 'sales_process' 
  | 'agent' 
  | 'insurer'
  | 'policy_document'
  | 'claim_document'
  | 'client_document'
  | 'invoice_document'
  | 'addendum_document'
  | 'sales_document'
  | 'agent_document'
  | 'insurer_document';

export interface ActivityLog {
  entity_type: EntityType;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  details?: any;
}

export const useActivityLogger = () => {
  const logActivity = async (activity: ActivityLog) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Cannot log activity: No authenticated user");
        return;
      }
      
      // Insert activity log
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          entity_type: activity.entity_type,
          entity_id: activity.entity_id,
          action: activity.action,
          details: activity.details || {},
          user_id: user.id,
          company_id: user.user_metadata?.company_id
        });
      
      if (error) {
        console.error("Error logging activity:", error);
      }
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };
  
  return { logActivity };
};
