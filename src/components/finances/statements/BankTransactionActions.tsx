
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BankTransaction } from "@/types/finances";
import MatchTransactionDialog from "./MatchTransactionDialog";

interface BankTransactionActionsProps {
  transaction: BankTransaction;
  onMatchTransaction: (transactionId: string, policyId: string) => void;
  onIgnoreTransaction: (transactionId: string) => void;
  onResetStatus?: (transactionId: string) => void;
  isMatching: boolean;
  isIgnoring: boolean;
  isResetting?: boolean;
}

const BankTransactionActions: React.FC<BankTransactionActionsProps> = ({
  transaction,
  onMatchTransaction,
  onIgnoreTransaction,
  onResetStatus,
  isMatching,
  isIgnoring,
  isResetting = false
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  
  if (transaction.status === "unmatched") {
    return (
      <>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMatchDialog(true)}
            disabled={isMatching}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            {t("linkToPolicy")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onIgnoreTransaction(transaction.id)}
            disabled={isIgnoring}
          >
            {t("ignore")}
          </Button>
        </div>
        
        <MatchTransactionDialog
          open={showMatchDialog}
          onOpenChange={setShowMatchDialog}
          onConfirm={(transactionId, policyId) => {
            onMatchTransaction(transactionId, policyId);
            setShowMatchDialog(false);
          }}
          transaction={transaction}
          isLoading={isMatching}
        />
      </>
    );
  }
  
  if (transaction.status === "matched" && transaction.matched_policy_id) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          navigate(`/policies/${transaction.matched_policy_id}`);
        }}
      >
        {t("viewPolicy")}
      </Button>
    );
  }
  
  if (transaction.status === "ignored" && onResetStatus) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onResetStatus(transaction.id)}
        disabled={isResetting}
      >
        {t("resetStatus")}
      </Button>
    );
  }
  
  return null;
};

export default BankTransactionActions;
