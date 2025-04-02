
import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Notification, NotificationType } from "@/types/notifications";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// This would come from a database in a real app
const STORAGE_KEY = "policy_hub_notifications";

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    if (!user) return;
    
    try {
      const savedNotifications = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        })));
        
        setUnreadCount(parsed.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }, [user]);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    if (!user || notifications.length === 0) return;
    
    try {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(notifications));
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  }, [notifications, user]);

  // Add a new notification
  const addNotification = useCallback((
    title: string, 
    options: {
      description?: string;
      type?: NotificationType;
      showToast?: boolean;
      entityType?: string;
      entityId?: string;
      action?: { label: string; onClick: () => void };
    } = {}
  ) => {
    const { 
      description, 
      type = 'info', 
      showToast = true,
      entityType,
      entityId,
      action
    } = options;
    
    const newNotification: Notification = {
      id: uuidv4(),
      title,
      description,
      type,
      read: false,
      createdAt: new Date(),
      entityType,
      entityId,
      action
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Limit to 100 notifications
    setUnreadCount(prev => prev + 1);
    
    // Also show a toast if requested
    if (showToast) {
      toast[type](title, {
        description,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined
      });
    }
    
    return newNotification.id;
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      const newNotifications = prev.filter(n => n.id !== id);
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return newNotifications;
    });
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications
  };
};
