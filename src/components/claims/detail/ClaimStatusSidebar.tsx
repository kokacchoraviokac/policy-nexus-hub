
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface ClaimStatusSidebarProps {
  claim: any;
  onUpdateStatusClick: () => void;
}

const ClaimStatusSidebar: React.FC<ClaimStatusSidebarProps> = ({
  claim,
  onUpdateStatusClick
}) => {
  const { t, formatDate } = useLanguage();

  return (
    <>
      <CardHeader>
        <CardTitle>{t("claimStatus")}</CardTitle>
        <CardDescription>{t("claimStatusDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{t("currentStatus")}</h3>
              <ClaimStatusBadge status={claim.status} />
            </div>
            
            <div className="space-y-4 mt-4">
              <Button 
                className="w-full" 
                onClick={onUpdateStatusClick}
              >
                {t("updateStatus")}
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">{t("claimTimeline")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{t("claimCreated")}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(claim.created_at)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{t("statusUpdated")}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(claim.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ClaimStatusSidebar;
