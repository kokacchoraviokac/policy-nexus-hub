
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter } from "lucide-react";
import { ActivityCalendar } from "@/components/sales/activities/ActivityCalendar";
import NewActivityDialog from "@/components/sales/activities/NewActivityDialog";
import { useSalesActivities } from "@/hooks/sales/useSalesActivities";
import { SalesActivity } from "@/types/sales/activities";

const ActivityCalendarPage = () => {
  const { t } = useLanguage();
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  
  const {
    activities,
    isLoading,
    fetchActivities,
    createActivity
  } = useSalesActivities(undefined, undefined, statusFilter === "all" ? "all" : statusFilter as any);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, statusFilter]);

  const handleActivityCreated = async (activityData: any) => {
    await createActivity(activityData);
    setShowNewActivityDialog(false);
  };
  
  const filteredActivities = activities.filter(activity => {
    if (activityTypeFilter !== "all" && activity.activity_type !== activityTypeFilter) {
      return false;
    }
    return true;
  });

  const handleActivityClick = (activity: SalesActivity) => {
    // This would typically open a dialog to view/edit the activity
    console.log("Activity clicked:", activity);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("activityCalendar")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("activityCalendarDescription")}
          </p>
        </div>
        <Button onClick={() => setShowNewActivityDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> {t("scheduleActivity")}
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("filters")}:</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="in_progress">{t("inProgress")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
              <SelectItem value="canceled">{t("canceled")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("activityType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="call">{t("call")}</SelectItem>
              <SelectItem value="email">{t("email")}</SelectItem>
              <SelectItem value="meeting">{t("meeting")}</SelectItem>
              <SelectItem value="follow_up">{t("followUp")}</SelectItem>
              <SelectItem value="task">{t("task")}</SelectItem>
              <SelectItem value="note">{t("note")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <ActivityCalendar
          activities={filteredActivities}
          isLoading={isLoading}
          onActivityClick={handleActivityClick}
        />
      </Card>
      
      <NewActivityDialog
        open={showNewActivityDialog}
        onOpenChange={setShowNewActivityDialog}
        onActivityCreated={handleActivityCreated}
      />
    </div>
  );
};

export default ActivityCalendarPage;
