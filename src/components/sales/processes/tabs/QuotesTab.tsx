
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SalesProcess } from "@/types/salesProcess";
import QuoteManagementPanel from "@/components/sales/quotes/QuoteManagementPanel";

interface QuotesTabProps {
  process: SalesProcess;
  onQuoteSelected: (quoteId: string) => void;
}

const QuotesTab: React.FC<QuotesTabProps> = ({ process, onQuoteSelected }) => {
  const { t } = useLanguage();
  
  return (
    <div className="pt-4">
      <QuoteManagementPanel 
        process={process}
        onQuoteSelected={onQuoteSelected}
      />
    </div>
  );
};

export default QuotesTab;
