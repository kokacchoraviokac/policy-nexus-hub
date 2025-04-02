
export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error';

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type Notification = {
  id: string;
  title: string;
  description?: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  entityType?: string;
  entityId?: string;
  action?: NotificationAction;
};

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}
