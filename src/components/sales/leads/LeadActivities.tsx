
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

interface LeadActivitiesProps {
  leadId: string;
}

const LeadActivities: React.FC<LeadActivitiesProps> = ({ leadId }) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-center text-muted-foreground">
          {t("activitiesModuleInDevelopment")}
        </p>
      </CardContent>
    </Card>
  );
};

export default LeadActivities;
