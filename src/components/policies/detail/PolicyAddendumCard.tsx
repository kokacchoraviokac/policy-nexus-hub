
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyAddendumCardProps {
  policyId: string;
  onCreateAddendum: () => void;
  addendumCount: number;
  latestAddendum?: {
    id: string;
    addendum_number: string;
    effective_date: string;
    status: string;
    workflow_status: string;
    premium_adjustment?: number;
  };
}

const PolicyAddendumCard: React.FC<PolicyAddendumCardProps> = ({
  policyId,
  onCreateAddendum,
  addendumCount,
  latestAddendum,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "default";
      case 'pending':
      case 'in_progress':
        return "secondary";
      case 'rejected':
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const getWorkflowStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return "outline";
      case 'in_review':
        return "secondary";
      case 'ready':
        return "default";
      case 'complete':
        return "default"; // Changed from "success" to "default"
      default:
        return "outline";
    }
  };
  
  const getWorkflowStatusLabel = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return t("draft");
      case 'in_review':
        return t("inReview");
      case 'ready':
        return t("ready");
      case 'complete':
        return t("complete");
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <FileEdit className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("policyAddendums")}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-muted-foreground">{t("totalAddendums")}: {addendumCount}</span>
            
            {latestAddendum ? (
              <div className="border rounded-md p-3 bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">{t("latestAddendum")}: {latestAddendum.addendum_number}</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant={getStatusVariant(latestAddendum.status)}>
                        {latestAddendum.status}
                      </Badge>
                      {latestAddendum.workflow_status && (
                        <Badge variant={getWorkflowStatusVariant(latestAddendum.workflow_status)}>
                          {getWorkflowStatusLabel(latestAddendum.workflow_status)}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(latestAddendum.effective_date)}
                      </span>
                    </div>
                  </div>
                  {latestAddendum.premium_adjustment && (
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {latestAddendum.premium_adjustment > 0 ? "+" : ""}
                        {formatCurrency(latestAddendum.premium_adjustment)}
                      </span>
                      <div className="text-xs text-muted-foreground">{t("premiumAdjustment")}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {t("noAddendums")}
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onCreateAddendum}
          >
            {t("createAddendum")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyAddendumCard;
