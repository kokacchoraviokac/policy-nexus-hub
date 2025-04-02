
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { SalesProcess, SalesProcessStage } from "@/hooks/sales/useSalesProcessData";

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
    
    if (process.stage === "quote") {
      toast.success(t("quoteSelectedReadyToMove"), {
        description: t("canProceedToNextStage"),
      });
    }
  };

  const handleMoveToNextStage = () => {
    const nextStage: Record<SalesProcessStage, SalesProcessStage> = {
      "quote": "authorization",
      "authorization": "proposal",
      "proposal": "signed",
      "signed": "concluded",
      "concluded": "concluded"
    };
    
    if (nextStage[process.stage]) {
      const newStage = nextStage[process.stage];
      
      if (process.stage === "quote" && !selectedQuoteId) {
        toast.warning(t("noSelectedQuote"), {
          description: t("selectQuoteBeforeProceeding"),
        });
        return;
      }
      
      const newStatus = newStage === "concluded" ? "completed" : process.status;
      
      const updated: SalesProcess = {
        ...process,
        stage: newStage,
        status: newStatus
      };
      
      setProcess(updated);
      
      if (onMoveToNextStage) {
        onMoveToNextStage(updated);
      }
      
      toast.success(t("stageUpdated"), {
        description: t("processMovedToStage", { stage: t(newStage) }),
      });
      
      if (newStage === "concluded" && newStatus === "completed") {
        toast.info(t("processReachedFinalStage"), {
          description: t("canNowImportPolicy"),
        });
      }
    }
  };

  const isReadyForPolicyImport = process.stage === "concluded" && process.status === "completed";

  return {
    process,
    selectedQuoteId,
    isReadyForPolicyImport,
    handleQuoteSelected,
    handleMoveToNextStage
  };
};
