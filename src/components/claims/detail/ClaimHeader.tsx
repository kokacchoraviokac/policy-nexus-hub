
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  claimId
}) => {
  const { t, formatDate } = useLanguage();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/claims");
  };
  
  const handleEdit = () => {
    navigate(`/claims/${claimId}/edit`);
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 mb-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToClaims")}
          </Button>
          <ClaimStatusBadge status={status} />
        </div>
        <h1 className="text-2xl font-bold">
          {t("claim")}: {claimNumber}
        </h1>
        <p className="text-muted-foreground">
          {t("createdOn")} {formatDate(createdAt)}
        </p>
      </div>
      
      {!isEditMode && (
        <Button onClick={handleEdit} className="self-start sm:self-auto">
          <FileEdit className="mr-2 h-4 w-4" />
          {t("editClaim")}
        </Button>
      )}
    </div>
  );
};

export default ClaimHeader;
