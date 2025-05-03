
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Notification, NotificationStatus } from '@/types/notifications';
import { useLanguage } from '@/contexts/LanguageContext';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter(n => n.status === 'unread').length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: t('errorFetchingNotifications'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, t]);
  
  const updateNotificationStatus = useCallback(async (
    id: string, 
    status: NotificationStatus
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.id === id 
          ? { ...notification, status, updated_at: new Date().toISOString() } 
          : notification
      ));
      
      if (status !== 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
      toast({
        title: t('errorUpdatingNotification'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  }, [toast, t]);
  
  const markAsRead = useCallback((id: string) => {
    return updateNotificationStatus(id, 'read');
  }, [updateNotificationStatus]);
  
  const dismissNotification = useCallback((id: string) => {
    return updateNotificationStatus(id, 'dismissed');
  }, [updateNotificationStatus]);
  
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read', 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .eq('status', 'unread');
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.status === 'unread' 
          ? { ...notification, status: 'read', updated_at: new Date().toISOString() } 
          : notification
      ));
      
      setUnreadCount(0);
      
      toast({
        title: t('allNotificationsMarkedAsRead')
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: t('errorUpdatingNotifications'),
        description: error instanceof Error ? error.message : t('unknownError'),
        variant: 'destructive'
      });
    }
  }, [user, toast, t]);
  
  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    
    fetchNotifications();
    
    // Subscribe to changes
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch notifications when changes occur
          fetchNotifications();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    dismissNotification,
    markAllAsRead
  };
}
