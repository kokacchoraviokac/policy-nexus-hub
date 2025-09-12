
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { SalesProcess } from "@/types/sales/salesProcesses";
import QuoteManagement from "../../quotes/QuoteManagement";
import { toast } from "sonner";

interface QuoteInformationProps {
  process: SalesProcess;
}

const QuoteInformation: React.FC<QuoteInformationProps> = ({ process }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleQuoteSent = () => {
    console.log("Quote sent for sales process:", process.id);
    
    // Update sales process status to indicate quotes are being processed
    toast.info(t("quoteSentToInsurers"), {
      description: t("waitingForInsurerResponses"),
    });
    
    // Could trigger a refresh of the sales process data
    // In a real app, this would update the sales process status in the database
  };

  const handleQuoteResponded = () => {
    console.log("Quote responded for sales process:", process.id);
    
    // Notify that quotes are ready for client review
    toast.success(t("quotesReadyForReview"), {
      description: t("clientCanNowSelectQuote"),
    });
    
    // Could trigger a refresh of the sales process data
  };

  const handleClientSelection = async () => {
    console.log("Client selected quote for sales process:", process.id);
    
    try {
      // Update sales process status to "quote_selected"
      console.log("Updating sales process status to 'quote_selected'");
      
      // Show success message
      toast.success(t("quoteSelectionComplete"), {
        description: t("initiatingPolicyImport"),
      });

      // Simulate a delay for the insurer to create the policy
      setTimeout(() => {
        toast.info(t("policyBeingCreated"), {
          description: t("insurerCreatingPolicy"),
        });
        
        // After another delay, simulate policy import
        setTimeout(() => {
          toast.success(t("policyReadyForImport"), {
            description: t("clickToStartImport"),
            action: {
              label: t("importPolicy"),
              onClick: () => {
                // Navigate to policy import with pre-filled data from the quote
                navigate("/policies/import", {
                  state: {
                    fromQuote: true,
                    salesProcessId: process.id,
                    // In a real app, this would include the actual policy data from the insurer
                  }
                });
              }
            }
          });
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error("Error handling client selection:", error);
      toast.error(t("errorProcessingSelection"));
    }
  };

  return (
    <>
      <Separator />
      <QuoteManagement
        process={process}
        onQuoteSent={handleQuoteSent}
        onQuoteResponded={handleQuoteResponded}
        onClientSelection={handleClientSelection}
      />
    </>
  );
};

export default QuoteInformation;
