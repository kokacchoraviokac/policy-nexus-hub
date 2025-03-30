
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BankTransactionActionsProps {
  status: string;
  transactionId: string;
  matchedPolicyId?: string;
  onMatchTransaction: (transactionId: string) => void;
  onIgnoreTransaction: (transactionId: string) => void;
  onResetStatus?: (transactionId: string) => void;
  isMatching: boolean;
  isIgnoring: boolean;
  isResetting?: boolean;
}

const BankTransactionActions: React.FC<BankTransactionActionsProps> = ({
  status,
  transactionId,
  matchedPolicyId,
  onMatchTransaction,
  onIgnoreTransaction,
  onResetStatus,
  isMatching,
  isIgnoring,
  isResetting = false
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (status === "unmatched") {
    return (
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMatchTransaction(transactionId)}
          disabled={isMatching}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          {t("linkToPolicy")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onIgnoreTransaction(transactionId)}
          disabled={isIgnoring}
        >
          {t("ignore")}
        </Button>
      </div>
    );
  }
  
  if (status === "matched" && matchedPolicyId) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          navigate(`/policies/${matchedPolicyId}`);
        }}
      >
        {t("viewPolicy")}
      </Button>
    );
  }
  
  if (status === "ignored" && onResetStatus) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onResetStatus(transactionId)}
        disabled={isResetting}
      >
        {t("resetStatus")}
      </Button>
    );
  }
  
  return null;
};

export default BankTransactionActions;
