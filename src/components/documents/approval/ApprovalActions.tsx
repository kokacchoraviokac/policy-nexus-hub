
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DocumentApprovalStatus } from "@/types/documents";

interface ApprovalActionsProps {
  onApprove: () => void;
  onReject: () => void;
  onNeedsReview: () => void;
  currentStatus: DocumentApprovalStatus;
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
        disabled={isPending || currentStatus === DocumentApprovalStatus.APPROVED}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
        {t("approve")}
      </Button>
      <Button 
        variant="default"
        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600"
        onClick={onNeedsReview}
        disabled={isPending || currentStatus === DocumentApprovalStatus.NEEDS_REVIEW}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
        {t("needsReview")}
      </Button>
      <Button 
        variant="destructive"
        className="w-full sm:w-auto"
        onClick={onReject}
        disabled={isPending || currentStatus === DocumentApprovalStatus.REJECTED}
      >
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
        {t("reject")}
      </Button>
    </>
  );
};
