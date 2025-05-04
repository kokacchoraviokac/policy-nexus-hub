
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseClient } from "./useSupabaseClient";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: 'read' | 'unread';
  related_entity_id?: string;
  related_entity_type?: string;
  created_at: string;
}

export const useNotificationService = () => {
  const { user } = useAuth();
  const supabase = useSupabaseClient();

  const createNotification = async ({
    title,
    message,
    type,
    relatedEntityId,
    relatedEntityType
  }: {
    title: string;
    message: string;
    type: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
  }) => {
    if (!user?.id || !user?.companyId) return null;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          company_id: user.companyId,
          title,
          message,
          type,
          status: 'unread',
          related_entity_id: relatedEntityId,
          related_entity_type: relatedEntityType
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  };

  const createActivityDueNotification = async (activity: any) => {
    if (!activity.due_date || !user?.id) return null;

    const dueDate = new Date(activity.due_date);
    const activityType = activity.activity_type || 'activity';
    
    return createNotification({
      title: `Upcoming ${activityType}`,
      message: `You have a ${activityType} scheduled on ${dueDate.toLocaleDateString()}`,
      type: 'activity_reminder',
      relatedEntityId: activity.id,
      relatedEntityType: 'sales_activity'
    });
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', user.id)
        .eq('status', 'unread');

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  };

  return {
    createNotification,
    createActivityDueNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
