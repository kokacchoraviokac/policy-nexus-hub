
import React, { createContext, useContext } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification, NotificationType } from "@/types/notifications";

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string, 
    options?: {
      description?: string;
      type?: NotificationType;
      showToast?: boolean;
      entityType?: string;
      entityId?: string;
      action?: { label: string; onClick: () => void };
    }
  ) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationsData = useNotifications();
  
  return (
    <NotificationsContext.Provider value={notificationsData}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};
