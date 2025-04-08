
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ApprovalStatus } from "@/types/common";

interface ApprovalActionsProps {
  onApprove: () => void;
  onReject: () => void;
  onNeedsReview: () => void;
  currentStatus: ApprovalStatus | string;
  isPending: boolean;
}

export const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  onApprove,
  onReject,
  onNeedsReview,
  currentStatus,
  isPending
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <Button 
        variant="default" 
        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        onClick={onApprove}
        disabled={isPending || currentStatus === ApprovalStatus.APPROVED}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
        {t("approve")}
      </Button>
      <Button 
        variant="default"
        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600"
        onClick={onNeedsReview}
        disabled={isPending || currentStatus === ApprovalStatus.NEEDS_REVIEW}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
        {t("needsReview")}
      </Button>
      <Button 
        variant="destructive"
        className="w-full sm:w-auto"
        onClick={onReject}
        disabled={isPending || currentStatus === ApprovalStatus.REJECTED}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
        {t("reject")}
      </Button>
    </>
  );
};
