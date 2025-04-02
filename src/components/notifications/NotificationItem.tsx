
import React from "react";
import { 
  Info, AlertCircle, CheckCircle, AlertTriangle, 
  X, ExternalLink 
} from "lucide-react";
import { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { t } = useLanguage();
  const { markAsRead, removeNotification } = useNotificationsContext();
  const navigate = useNavigate();

  // Icon based on notification type
  const NotificationIcon = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: AlertCircle,
  }[notification.type];

  // Color based on notification type
  const iconColorClass = {
    info: "text-blue-500",
    warning: "text-amber-500",
    success: "text-green-500",
    error: "text-red-500",
  }[notification.type];

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // If there's an entityType and entityId, navigate to that entity
    if (notification.entityType && notification.entityId) {
      switch (notification.entityType) {
        case "sales_process":
          navigate(`/sales/processes?id=${notification.entityId}`);
          break;
        // Add other entity types as needed
        default:
          break;
      }
    }
    
    // If there's a custom action, execute it
    if (notification.action) {
      notification.action.onClick();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-md cursor-pointer hover:bg-accent mb-1",
        !notification.read && "bg-accent/50"
      )}
      onClick={handleClick}
    >
      <div className={cn("mt-1", iconColorClass)}>
        <NotificationIcon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">
          {notification.title}
        </div>
        {notification.description && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {notification.description}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={handleDelete}
        >
          <X className="h-3 w-3" />
        </Button>
        
        {(notification.entityType && notification.entityId) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
