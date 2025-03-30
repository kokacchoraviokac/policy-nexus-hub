
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface PolicyClaimsTabProps {
  policyId: string;
}

const PolicyClaimsTab: React.FC<PolicyClaimsTabProps> = ({ policyId }) => {
  const { t } = useLanguage();
  
  // This is a placeholder component - will be implemented fully later
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("policyClaimsHistory")}</CardTitle>
            <CardDescription>{t("claimsRelatedToPolicy")}</CardDescription>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("registerClaim")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6 text-muted-foreground">
          <p>{t("noClaimsForPolicy")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyClaimsTab;
