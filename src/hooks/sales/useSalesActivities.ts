
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { ActivityType, SalesActivity, ActivityStatus } from "@/types/sales/activities";

export const useSalesActivities = (
  leadId?: string,
  salesProcessId?: string,
  filterStatus: ActivityStatus | "all" = "all"
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const { t } = useLanguage();
  const { user } = useAuth();

  const fetchActivities = async () => {
    if (!user?.companyId) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('sales_activities')
        .select('*')
        .eq('company_id', user.companyId)
        .order('due_date', { ascending: true });

      if (leadId) {
        query = query.eq('lead_id', leadId);
      } else if (salesProcessId) {
        query = query.eq('sales_process_id', salesProcessId);
      }

      if (filterStatus !== "all") {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivities(data as SalesActivity[]);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error(t("errorFetchingActivities"));
    } finally {
      setIsLoading(false);
    }
  };

  const createActivity = async (activity: Omit<SalesActivity, 'id' | 'created_at' | 'updated_at' | 'company_id' | 'created_by'>) => {
    if (!user?.companyId) return null;
    
    try {
      const newActivity = {
        ...activity,
        company_id: user.companyId,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('sales_activities')
        .insert([newActivity])
        .select()
        .single();

      if (error) throw error;
      
      toast.success(t("activityCreated"));
      fetchActivities();
      return data as SalesActivity;
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error(t("errorCreatingActivity"));
      return null;
    }
  };

  const updateActivity = async (id: string, updates: Partial<SalesActivity>) => {
    try {
      const { error } = await supabase
        .from('sales_activities')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success(t("activityUpdated"));
      fetchActivities();
      return true;
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error(t("errorUpdatingActivity"));
      return false;
    }
  };

  const completeActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales_activities')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(t("activityCompleted"));
      fetchActivities();
      return true;
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error(t("errorCompletingActivity"));
      return false;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success(t("activityDeleted"));
      fetchActivities();
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error(t("errorDeletingActivity"));
      return false;
    }
  };

  return {
    activities,
    isLoading,
    fetchActivities,
    createActivity,
    updateActivity,
    completeActivity,
    deleteActivity,
  };
};
