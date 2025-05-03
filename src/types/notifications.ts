
export type NotificationType = 
  | 'activity_due'
  | 'activity_overdue'
  | 'lead_status_change'
  | 'sales_process_update';

export type NotificationStatus = 'unread' | 'read' | 'dismissed';

export interface Notification {
  id: string;
  user_id: string;
  company_id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  related_entity_type?: string;
  related_entity_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  company_id: string;
  activity_reminders: boolean;
  lead_updates: boolean;
  sales_process_updates: boolean;
  reminder_timing: {
    activity_due: string;
    lead_followup: string;
  };
  email_notifications: boolean;
  in_app_notifications: boolean;
  created_at: string;
  updated_at: string;
}
