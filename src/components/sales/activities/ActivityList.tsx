
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesActivity } from "@/types/sales/activities";
import { formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Mail, Phone, Calendar, CheckCircle, FileText, Clock, CheckCheck, XCircle } from "lucide-react";

interface ActivityListProps {
  activities: SalesActivity[];
  isLoading?: boolean;
  onCompleteActivity?: (id: string) => void;
  onEditActivity?: (activity: SalesActivity) => void;
  onDeleteActivity?: (id: string) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isLoading = false,
  onCompleteActivity,
  onEditActivity,
  onDeleteActivity,
}) => {
  const { t } = useLanguage();

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "follow_up":
        return <CalendarClock className="h-4 w-4" />;
      case "task":
        return <CheckCircle className="h-4 w-4" />;
      case "note":
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200"><Clock className="h-3 w-3 mr-1" />{t("pending")}</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">{t("inProgress")}</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><CheckCheck className="h-3 w-3 mr-1" />{t("completed")}</Badge>;
      case "canceled":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200"><XCircle className="h-3 w-3 mr-1" />{t("canceled")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="border rounded-md p-3 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
            <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center py-6 text-muted-foreground border rounded-md">
        <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>{t("noScheduledActivities")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="border rounded-md p-3 bg-card">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              {getActivityTypeIcon(activity.activity_type)}
              <span className="ml-2 font-medium">{t(activity.activity_type)}</span>
            </div>
            {getStatusBadge(activity.status)}
          </div>
          <p className="text-sm mb-2">{activity.description}</p>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div>
              {activity.due_date && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(activity.due_date)}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {activity.status !== "completed" && activity.status !== "canceled" && onCompleteActivity && (
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onCompleteActivity(activity.id)}>
                  <CheckCircle className="h-3.5 w-3.5" />
                </Button>
              )}
              
              {onEditActivity && (
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => onEditActivity(activity)}>
                  {t("edit")}
                </Button>
              )}
              
              {onDeleteActivity && (
                <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive" onClick={() => onDeleteActivity(activity.id)}>
                  {t("delete")}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
