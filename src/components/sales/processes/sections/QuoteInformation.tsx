
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { SalesProcess } from "@/types/sales/salesProcesses";
import QuoteManagement from "../../quotes/QuoteManagement";

interface QuoteInformationProps {
  process: SalesProcess;
}

const QuoteInformation: React.FC<QuoteInformationProps> = ({ process }) => {
  const { t } = useLanguage();

  const handleQuoteSent = () => {
    console.log("Quote sent for sales process:", process.id);
    // Could trigger a refresh of the sales process data
  };

  const handleQuoteResponded = () => {
    console.log("Quote responded for sales process:", process.id);
    // Could trigger a refresh of the sales process data
  };

  const handleClientSelection = () => {
    console.log("Client selected quote for sales process:", process.id);
    // Could trigger navigation to policy import or update sales process status
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
