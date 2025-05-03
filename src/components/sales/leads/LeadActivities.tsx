
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useSalesActivities } from "@/hooks/sales/useSalesActivities";
import ActivityList from "../activities/ActivityList";
import NewActivityDialog from "../activities/NewActivityDialog";
import { SalesActivity } from "@/types/sales/activities";

interface LeadActivitiesProps {
  leadId: string;
}

const LeadActivities: React.FC<LeadActivitiesProps> = ({ leadId }) => {
  const { t } = useLanguage();
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false);
  
  const {
    activities,
    isLoading,
    fetchActivities,
    createActivity,
    completeActivity,
    deleteActivity,
  } = useSalesActivities(leadId);

  useEffect(() => {
    if (leadId) {
      fetchActivities();
    }
  }, [leadId]);

  const handleActivityCreated = async (activityData: any) => {
    await createActivity(activityData);
  };

  const handleCompleteActivity = async (id: string) => {
    await completeActivity(id);
  };

  const handleDeleteActivity = async (id: string) => {
    if (window.confirm(t("confirmDeleteActivity"))) {
      await deleteActivity(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t("scheduledActivities")}</h3>
        <Button 
          size="sm" 
          onClick={() => setShowNewActivityDialog(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" /> {t("scheduleActivity")}
        </Button>
      </div>

      <ActivityList
        activities={activities}
        isLoading={isLoading}
        onCompleteActivity={handleCompleteActivity}
        onDeleteActivity={handleDeleteActivity}
      />

      <NewActivityDialog
        open={showNewActivityDialog}
        onOpenChange={setShowNewActivityDialog}
        onActivityCreated={handleActivityCreated}
        leadId={leadId}
      />
    </div>
  );
};

export default LeadActivities;
