
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface PolicyClaimsCardProps {
  policyId: string;
  claimsCount: number;
  activeClaimsCount?: number;
  totalClaimedAmount?: number;
}

const PolicyClaimsCard: React.FC<PolicyClaimsCardProps> = ({
  policyId,
  claimsCount,
  activeClaimsCount = 0,
  totalClaimedAmount = 0,
}) => {
  const { t, formatCurrency } = useLanguage();
  const navigate = useNavigate();

  const handleViewClaims = () => {
    // Navigate to claims tab
    const claimsTab = document.querySelector('[data-value="claims"]');
    if (claimsTab instanceof HTMLElement) {
      claimsTab.click();
    }
  };

  const handleNewClaim = () => {
    // Navigate to new claim form
    navigate(`/claims/new?policyId=${policyId}`);
  };

  // Calculate the percentage of active claims
  const activeClaimsPercentage = claimsCount > 0 
    ? Math.round((activeClaimsCount / claimsCount) * 100)
    : 0;

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

          {claimsCount > 0 && (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t("activeClaims")}</span>
                  <span>{activeClaimsCount} / {claimsCount}</span>
                </div>
                <Progress value={activeClaimsPercentage} className="h-2" />
              </div>

              {totalClaimedAmount > 0 && (
                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="text-muted-foreground">{t("totalClaimedAmount")}</span>
                  <span className="font-medium">{formatCurrency(totalClaimedAmount)}</span>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col space-y-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewClaims}
              disabled={claimsCount === 0}
            >
              <FileText className="mr-2 h-4 w-4" />
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
