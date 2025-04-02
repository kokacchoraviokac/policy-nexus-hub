
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { SalesProcess, SalesProcessStage } from "@/types/salesProcess";
import { 
  getNextStage, 
  validateTransition, 
  isReadyForPolicyImport,
  getStatusForStageTransition,
  isFinalStage
} from "@/utils/sales/stageTransitionConfig";

type StageMoveCallback = (process: SalesProcess) => void;

export const useSalesProcessStageTransition = (
  initialProcess: SalesProcess,
  onMoveToNextStage?: StageMoveCallback
) => {
  const { t } = useLanguage();
  const [process, setProcess] = useState<SalesProcess>(initialProcess);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);

  const handleQuoteSelected = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    
    // Only show toast notification if we're in the quote stage
    if (process.stage === "quote") {
      toast.success(t("quoteSelectedReadyToMove"), {
        description: t("canProceedToNextStage"),
      });
    }
  };

  const handleMoveToNextStage = () => {
    const currentStage = process.stage;
    const nextStage = getNextStage(currentStage);
    
    // No next stage available
    if (!nextStage) {
      toast.info(t("finalStageReached"));
      return;
    }
    
    // Validate the transition with any requirements
    const validation = validateTransition(currentStage, nextStage, { selectedQuoteId });
    
    if (!validation.valid) {
      toast.warning(t(validation.errorMessage || "transitionRequirementsFailed"), {
        description: validation.errorMessage === "noSelectedQuote" ? 
          t("selectQuoteBeforeProceeding") : t("cannotProgressToNextStage")
      });
      return;
    }
    
    // Determine if status should change (e.g., when reaching final stage)
    const newStatus = getStatusForStageTransition(currentStage, nextStage, process.status);
    
    // Update the process
    const updated: SalesProcess = {
      ...process,
      stage: nextStage,
      status: newStatus
    };
    
    setProcess(updated);
    
    // Notify parent component if callback provided
    if (onMoveToNextStage) {
      onMoveToNextStage(updated);
    }
    
    // Notify user of successful stage transition
    toast.success(t("stageUpdated"), {
      description: t("processMovedToStage", { stage: t(nextStage) }),
    });
    
    // Show special notification for final stage
    if (isFinalStage(nextStage) && newStatus === "completed") {
      toast.info(t("processReachedFinalStage"), {
        description: t("canNowImportPolicy"),
      });
    }
  };

  return {
    process,
    selectedQuoteId,
    isReadyForPolicyImport: isReadyForPolicyImport(process.stage, process.status),
    handleQuoteSelected,
    handleMoveToNextStage
  };
};
