
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { NotificationType } from '@/types/notifications';
import { SalesActivity } from '@/types/sales/activities';
import { Lead } from '@/types/sales/leads';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

export function useNotificationService() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const createNotification = useCallback(async ({
    title,
    message,
    type,
    relatedEntityType,
    relatedEntityId,
    dueDate
  }: {
    title: string,
    message: string,
    type: NotificationType,
    relatedEntityType?: string,
    relatedEntityId?: string,
    dueDate?: Date | string
  }) => {
    if (!user?.id || !user.companyId) return null;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type,
          user_id: user.id,
          company_id: user.companyId,
          related_entity_type: relatedEntityType,
          related_entity_id: relatedEntityId,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          status: 'unread'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }, [user]);
  
  const createActivityDueNotification = useCallback(async (activity: SalesActivity) => {
    if (!activity.due_date) return null;
    
    const formattedDate = format(new Date(activity.due_date), 'PPp');
    const title = t('activityDueReminder');
    const message = t('activityDueMessage', { 
      type: t(activity.activity_type), 
      date: formattedDate 
    });
    
    return createNotification({
      title,
      message,
      type: 'activity_due',
      relatedEntityType: 'sales_activity',
      relatedEntityId: activity.id,
      dueDate: activity.due_date
    });
  }, [createNotification, t]);
  
  const createActivityOverdueNotification = useCallback(async (activity: SalesActivity) => {
    if (!activity.due_date) return null;
    
    const formattedDate = format(new Date(activity.due_date), 'PPp');
    const title = t('activityOverdueAlert');
    const message = t('activityOverdueMessage', { 
      type: t(activity.activity_type), 
      date: formattedDate 
    });
    
    return createNotification({
      title,
      message,
      type: 'activity_overdue',
      relatedEntityType: 'sales_activity',
      relatedEntityId: activity.id,
      dueDate: activity.due_date
    });
  }, [createNotification, t]);
  
  const createLeadStatusChangeNotification = useCallback(async (lead: Lead, previousStatus?: string) => {
    const title = t('leadStatusChanged');
    const message = previousStatus 
      ? t('leadStatusChangedFromTo', { 
          name: lead.name, 
          from: t(previousStatus), 
          to: t(lead.status) 
        })
      : t('leadStatusChangedTo', { 
          name: lead.name, 
          status: t(lead.status) 
        });
    
    return createNotification({
      title,
      message,
      type: 'lead_status_change',
      relatedEntityType: 'lead',
      relatedEntityId: lead.id
    });
  }, [createNotification, t]);
  
  return {
    createNotification,
    createActivityDueNotification,
    createActivityOverdueNotification,
    createLeadStatusChangeNotification
  };
}
