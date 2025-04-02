
import React from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import NotificationItem from "./NotificationItem";

const NotificationsDropdown: React.FC = () => {
  const { t } = useLanguage();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearNotifications
  } = useNotificationsContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center text-[10px] px-1"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>{t("notifications")}</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} {t("new")}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {t("noNotifications")}
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="p-1">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          </ScrollArea>
        )}
        
        <DropdownMenuSeparator />
        <div className="flex justify-between p-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-1" />
            {t("markAllRead")}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t("clearAll")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
