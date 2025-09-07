import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  FileText,
  Send,
  User,
  Building
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  category: 'sales' | 'policies' | 'claims' | 'system';
  priority: 'low' | 'medium' | 'high';
}

const NotificationCenter: React.FC = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Mock notifications - in real app this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "notif-1",
        type: "info",
        title: "Quote Sent to Insurer",
        message: "Quote Q-2024-001 has been sent to ABC Insurance for review",
        timestamp: "2024-01-15T14:30:00Z",
        read: false,
        actionUrl: "/sales/processes",
        actionLabel: "View Process",
        category: "sales",
        priority: "medium"
      },
      {
        id: "notif-2",
        type: "success",
        title: "Policy Finalized",
        message: "Policy POL-2024-001 has been successfully finalized and is now active",
        timestamp: "2024-01-16T09:15:00Z",
        read: false,
        actionUrl: "/policies/POL-2024-001",
        actionLabel: "View Policy",
        category: "policies",
        priority: "high"
      },
      {
        id: "notif-3",
        type: "warning",
        title: "Client Signature Required",
        message: "Policy POL-2024-002 is waiting for client signature",
        timestamp: "2024-01-16T11:00:00Z",
        read: true,
        actionUrl: "/policies/POL-2024-002",
        actionLabel: "Review Policy",
        category: "policies",
        priority: "high"
      },
      {
        id: "notif-4",
        type: "info",
        title: "New Claim Submitted",
        message: "A new claim has been submitted for policy POL-2024-001",
        timestamp: "2024-01-16T16:45:00Z",
        read: false,
        actionUrl: "/claims",
        actionLabel: "View Claims",
        category: "claims",
        priority: "medium"
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sales':
        return <Send className="h-3 w-3" />;
      case 'policies':
        return <FileText className="h-3 w-3" />;
      case 'claims':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success(t("allNotificationsMarkedAsRead"));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success(t("notificationDeleted"));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-base">{t("notifications")}</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              {t("markAllRead")}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t("noNotifications")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayedNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getCategoryIcon(notification.category)}
                              <span className="capitalize">{notification.category}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.timestamp).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {notification.actionUrl && notification.actionLabel && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to action URL
                                  console.log("Navigate to:", notification.actionUrl);
                                }}
                              >
                                {notification.actionLabel}
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {index < displayedNotifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 5 && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="w-full text-xs"
            >
              {showAll ? t("showLess") : t("showAllNotifications")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;