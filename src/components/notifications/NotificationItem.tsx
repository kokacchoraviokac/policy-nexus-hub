
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/types/notifications';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Generate notification icon based on type
  const renderIcon = () => {
    switch (notification.type) {
      case 'activity_due':
        return <div className="h-2 w-2 rounded-full bg-amber-500" />;
      case 'activity_overdue':
        return <div className="h-2 w-2 rounded-full bg-destructive" />;
      case 'lead_status_change':
        return <div className="h-2 w-2 rounded-full bg-blue-500" />;
      case 'sales_process_update':
        return <div className="h-2 w-2 rounded-full bg-green-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-primary" />;
    }
  };
  
  // Handle notification click
  const handleClick = () => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }
    
    // Navigate based on notification type and related entity
    if (notification.related_entity_type === 'sales_activity') {
      navigate('/sales/activities');
    } else if (notification.related_entity_type === 'lead' && notification.related_entity_id) {
      navigate('/sales/leads');
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-start gap-2 p-3 hover:bg-accent/50 cursor-pointer border-b last:border-b-0",
        notification.status === 'unread' ? "bg-accent/20" : ""
      )}
    >
      <div className="flex-shrink-0 mt-1">
        {renderIcon()}
      </div>
      
      <div className="flex-grow" onClick={handleClick}>
        <div className={cn(
          "text-sm font-medium",
          notification.status === 'unread' ? "font-semibold" : ""
        )}>
          {notification.title}
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">
          {notification.message}
        </p>
        
        <div className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </div>
      </div>
      
      <div className="flex flex-shrink-0 gap-1">
        {notification.status === 'unread' && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">{t('markAsRead')}</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notification.id);
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t('dismiss')}</span>
        </Button>
      </div>
    </div>
  );
};

export default NotificationItem;
