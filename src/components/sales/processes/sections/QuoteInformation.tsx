
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { SalesProcess } from "@/types/sales/salesProcesses";

interface QuoteInformationProps {
  process: SalesProcess;
}

const QuoteInformation: React.FC<QuoteInformationProps> = ({ process }) => {
  const { t } = useLanguage();

  return (
    <>
      <Separator />
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("quoteInformation")}</h4>
        <p className="text-sm text-muted-foreground italic">
          {process.stage === "quote" 
            ? t("noQuotesYet") 
            : t("quotesInProgress")}
        </p>
      </div>
    </>
  );
};

export default QuoteInformation;
