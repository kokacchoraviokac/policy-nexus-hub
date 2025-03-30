
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface ClaimHeaderProps {
  claimNumber: string;
  status: string;
  createdAt: string;
  isEditMode: boolean;
  claimId: string;
}

const ClaimHeader: React.FC<ClaimHeaderProps> = ({
  claimNumber,
  status,
  createdAt,
  isEditMode,
  claimId
}) => {
  const navigate = useNavigate();
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClaim = () => {
    navigate(`/claims/${claimId}/edit`);
  };

  const handleExportClaim = () => {
    toast({
      title: t("exportStarted"),
      description: t("claimExportInProgress")
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackClick}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToClaims")}
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("claim")} {claimNumber}</h1>
          <div className="flex items-center gap-2 mt-1">
            <ClaimStatusBadge status={status} />
            <span className="text-sm text-muted-foreground">
              {t("createdOn")}: {formatDate(createdAt)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {!isEditMode && (
            <Button variant="outline" size="sm" onClick={handleEditClaim}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("editClaim")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportClaim}>
            <Download className="mr-2 h-4 w-4" />
            {t("exportClaim")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ClaimHeader;
