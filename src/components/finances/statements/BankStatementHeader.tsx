
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Play, Check } from "lucide-react";

interface BankStatementHeaderProps {
  backLink: string;
  statementStatus: "in_progress" | "processed" | "confirmed";
  onDownload: () => void;
  onProcess: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  isConfirming: boolean;
}

const BankStatementHeader: React.FC<BankStatementHeaderProps> = ({
  backLink,
  statementStatus,
  onDownload,
  onProcess,
  onConfirm,
  isProcessing,
  isConfirming,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4" 
          onClick={() => navigate(backLink)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("backToStatements")}
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{t("statementDetails")}</h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDownload}
        >
          <FileDown className="h-4 w-4 mr-1" />
          {t("downloadStatement")}
        </Button>
        
        {statementStatus === "in_progress" && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onProcess}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            {t("processStatement")}
          </Button>
        )}
        
        {statementStatus === "processed" && (
          <Button 
            size="sm" 
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            {t("confirmStatement")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BankStatementHeader;
