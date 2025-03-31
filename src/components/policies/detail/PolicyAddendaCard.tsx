
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePolicyAddendums } from "@/hooks/usePolicyAddendums";
import { Badge } from "@/components/ui/badge";

interface PolicyAddendaCardProps {
  policyId: string;
}

const PolicyAddendaCard: React.FC<PolicyAddendaCardProps> = ({
  policyId,
}) => {
  const { t, formatDate } = useLanguage();
  const navigate = useNavigate();
  
  const { addendums, isLoading, addendumCount } = usePolicyAddendums(policyId);
  
  const handleViewAddenda = () => {
    const addendaTab = document.querySelector('[data-value="addenda"]');
    if (addendaTab instanceof HTMLElement) {
      addendaTab.click();
    }
  };
  
  const handleCreateAddendum = () => {
    navigate(`/policies/addendums/new?policyId=${policyId}`);
  };
  
  const getLatestAddendum = () => {
    if (!addendums || addendums.length === 0) return null;
    return addendums[0]; // Assuming they're ordered by date
  };
  
  const latestAddendum = getLatestAddendum();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <FileArchive className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("policyAddenda")}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("totalAddenda")}</span>
            <Badge variant={addendumCount > 0 ? "secondary" : "outline"}>
              {addendumCount}
            </Badge>
          </div>

          {latestAddendum && (
            <div className="border-t pt-3 mt-3">
              <h4 className="text-sm font-medium">{t("latestAddendum")}</h4>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("addendumNumber")}:</span>
                  <span>{latestAddendum.addendum_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("effectiveDate")}:</span>
                  <span>{formatDate(latestAddendum.effective_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("status")}:</span>
                  <Badge variant="outline">{latestAddendum.status}</Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewAddenda}
              disabled={!addendumCount || addendumCount === 0}
            >
              <Clock className="mr-2 h-4 w-4" />
              {t("viewAddenda")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleCreateAddendum}
            >
              {t("createAddendum")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyAddendaCard;
