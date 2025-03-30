import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PolicyActivityTabProps {
  policyId: string;
}

const PolicyActivityTab: React.FC<PolicyActivityTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  
  // This is a placeholder component - will be implemented fully later
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("policyActivity")}</CardTitle>
        <CardDescription>{t("policyActivityDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6 text-muted-foreground">
          <p>{t("noActivityRecorded")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyActivityTab;
