
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface BankStatementHeaderProps {
  backLink: string;
  statementStatus: 'in_progress' | 'processed' | 'confirmed';
  onDownload: () => void;
  onProcess: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
  isConfirming?: boolean;
}

const BankStatementHeader: React.FC<BankStatementHeaderProps> = ({
  backLink,
  statementStatus,
  onDownload,
  onProcess,
  onConfirm,
  isProcessing = false,
  isConfirming = false
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-fit"
        onClick={() => navigate(backLink)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("backToStatements")}
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          {t("downloadStatement")}
        </Button>
        
        {statementStatus === "in_progress" && (
          <Button
            size="sm"
            onClick={onProcess}
            disabled={isProcessing}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("processStatement")}
          </Button>
        )}
        
        {statementStatus === "processed" && (
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {t("confirmStatement")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BankStatementHeader;
