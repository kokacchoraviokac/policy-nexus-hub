
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from './NotificationItem';

const NotificationsPopover: React.FC = () => {
  const { t } = useLanguage();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    dismissNotification,
    markAllAsRead
  } = useNotifications();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">{t('notifications')}</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-medium">{t('notifications')}</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => markAllAsRead()}
            >
              {t('markAllAsRead')}
            </Button>
          )}
        </div>
        
        <Separator />
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">{t('loading')}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
            </div>
          ) : (
            <div>
              {notifications
                .filter(n => n.status !== 'dismissed')
                .map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={dismissNotification}
                  />
                ))}
            </div>
          )}
        </ScrollArea>
        
        <Separator />
        
        <div className="p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
          >
            {t('seeAllNotifications')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
