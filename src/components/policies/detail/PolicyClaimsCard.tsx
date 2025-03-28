
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PolicyClaimsCardProps {
  policyId: string;
  claimsCount: number;
}

const PolicyClaimsCard: React.FC<PolicyClaimsCardProps> = ({
  policyId,
  claimsCount,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleViewClaims = () => {
    // Navigate to claims tab
    const claimsTab = document.querySelector('[data-value="claims"]');
    if (claimsTab instanceof HTMLElement) {
      claimsTab.click();
    }
  };

  const handleNewClaim = () => {
    // To be implemented - navigate to new claim form
    navigate(`/claims/new?policyId=${policyId}`);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <AlertCircle className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("claimsManagement")}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("totalClaims")}</span>
            <Badge variant={claimsCount > 0 ? "secondary" : "outline"}>
              {claimsCount}
            </Badge>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewClaims}
              disabled={claimsCount === 0}
            >
              {t("viewClaims")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleNewClaim}
            >
              {t("registerClaim")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyClaimsCard;
