
import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Pencil, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface ClaimHeaderProps {
  claimNumber: string;
  status: string;
  createdAt: string;
  isEditMode?: boolean;
  claimId: string;
}

const ClaimHeader: React.FC<ClaimHeaderProps> = ({
  claimNumber,
  status,
  createdAt,
  isEditMode = false,
  claimId,
}) => {
  const navigate = useNavigate();
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();

  const handleBack = () => {
    navigate("/claims");
  };

  const handleEdit = () => {
    navigate(`/claims/${claimId}/edit`);
  };

  const handleExport = () => {
    // In a real application, this would trigger an API call to generate a PDF
    toast({
      title: t("exportStarted"),
      description: t("claimExportInProgress"),
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToClaims")}
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {claimNumber}
            </h1>
            <ClaimStatusBadge status={status} />
          </div>
          <p className="text-muted-foreground text-sm">
            {t("createdOn")} {formatDate(createdAt)}
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 gap-2">
          {!isEditMode && (
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("editClaim")}
            </Button>
          )}
          <Button variant="outline" onClick={handleExport}>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            {t("exportClaim")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClaimHeader;
