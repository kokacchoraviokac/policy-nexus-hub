
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Calendar, Edit, MoreHorizontal } from "lucide-react";
import ClaimStatusBadge from "../ClaimStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { t, formatDate } = useLanguage();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/claims");
  };
  
  const handleEdit = () => {
    navigate(`/claims/${claimId}/edit`);
  };
  
  const handleExport = () => {
    // This will be implemented in a future iteration
    console.log("Export claim data for:", claimId);
  };
  
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="pl-0 mb-1 text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("backToClaims")}
        </Button>
        
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">{claimNumber}</h1>
          <ClaimStatusBadge status={status} />
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>
            {t("createdOn")}: {formatDate(createdAt)}
          </span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        {!isEditMode && (
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {t("editClaim")}
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              {t("exportClaim")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClaimHeader;
