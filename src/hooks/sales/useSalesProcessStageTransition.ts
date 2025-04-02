
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { SalesProcess, SalesProcessStage } from "@/hooks/sales/useSalesProcessData";
import { useNotificationsContext } from "@/contexts/NotificationsContext";

type StageMoveCallback = (process: SalesProcess) => void;

export const useSalesProcessStageTransition = (
  initialProcess: SalesProcess,
  onMoveToNextStage?: StageMoveCallback
) => {
  const { t } = useLanguage();
  const [process, setProcess] = useState<SalesProcess>(initialProcess);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const { addNotification } = useNotificationsContext();

  const handleQuoteSelected = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    
    if (process.stage === "quote") {
      toast.success(t("quoteSelectedReadyToMove"), {
        description: t("canProceedToNextStage"),
      });
      
      // Add a notification for quote selection
      addNotification(
        t("quoteSelected"),
        {
          description: t("quoteSelectedForProcess", { title: process.title }),
          type: "success",
          showToast: false,
          entityType: "sales_process",
          entityId: process.id
        }
      );
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
      
      const previousStage = process.stage;
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
      
      // Add a notification for stage transition
      addNotification(
        t("salesProcessStageChanged"), 
        {
          description: t("processMovedFromToStage", { 
            title: process.title,
            from: t(previousStage), 
            to: t(newStage) 
          }),
          type: "info",
          showToast: false,
          entityType: "sales_process",
          entityId: process.id
        }
      );
      
      if (newStage === "concluded" && newStatus === "completed") {
        toast.info(t("processReachedFinalStage"), {
          description: t("canNowImportPolicy"),
        });
        
        // Add a notification for process completion
        addNotification(
          t("salesProcessCompleted"),
          {
            description: t("processReadyForPolicyImport", { title: process.title }),
            type: "success",
            showToast: false,
            entityType: "sales_process",
            entityId: process.id
          }
        );
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
