
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { BankStatement } from "@/types/finances";
import { 
  CalendarDays, 
  Building, 
  CreditCard, 
  CircleDollarSign,
  FileCheck,
  Loader2
} from "lucide-react";

interface BankStatementDetailsProps {
  statement: BankStatement | null;
  onProcess: () => void;
  onConfirm: () => void;
}

const BankStatementDetails: React.FC<BankStatementDetailsProps> = ({
  statement,
  onProcess,
  onConfirm,
}) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  
  if (!statement) {
    return <div className="text-muted-foreground">{t("statementNotFound")}</div>;
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      await onProcess();
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-start">
          <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t("statementDate")}</p>
            <p>{new Date(statement.statement_date).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Building className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t("bank")}</p>
            <p>{statement.bank_name}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t("accountNumber")}</p>
            <p>{statement.account_number}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CircleDollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t("balances")}</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">{t("opening")}</p>
                <p>{formatCurrency(statement.starting_balance)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("closing")}</p>
                <p>{formatCurrency(statement.ending_balance)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="space-y-2">
          {statement.status === "in_progress" && (
            <Button 
              className="w-full"
              onClick={handleProcess}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileCheck className="h-4 w-4 mr-2" />
              )}
              {t("processStatement")}
            </Button>
          )}
          
          {statement.status === "processed" && (
            <Button 
              className="w-full"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileCheck className="h-4 w-4 mr-2" />
              )}
              {t("confirmStatement")}
            </Button>
          )}
          
          {statement.status === "confirmed" && (
            <div className="text-center text-sm text-muted-foreground">
              {t("statementAlreadyConfirmed")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankStatementDetails;
