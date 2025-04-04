
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Quote } from "@/types/quotes";
import { SalesProcess } from "@/types/salesProcess";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SelectedQuoteCardProps {
  quote: Quote;
  process: SalesProcess;
  isPolicyImportReady: boolean;
  onImportClick: () => void;
}

const SelectedQuoteCard: React.FC<SelectedQuoteCardProps> = ({
  quote,
  process,
  isPolicyImportReady,
  onImportClick
}) => {
  const { t } = useLanguage();

  return (
    <Card 
      className={`border-green-200 ${isPolicyImportReady ? 'bg-green-50 dark:bg-green-900/10' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200'}`}
    >
      <CardHeader>
        <CardTitle className="text-base">{t("selectedQuote")}</CardTitle>
        <CardDescription>
          {isPolicyImportReady 
            ? t("policyImportAvailable") 
            : t("salesProcessFinalizationNeeded")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{t("insurer")}:</span>
            <span className="text-sm">{quote.insurerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">{t("amount")}:</span>
            <span className="text-sm">{quote.amount}</span>
          </div>
          <div>
            <span className="text-sm font-medium">{t("coverage")}:</span>
            <p className="text-sm mt-1">{quote.coverageDetails}</p>
          </div>
          {!isPolicyImportReady && (
            <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-800/20 rounded text-sm">
              <p className="text-blue-700 dark:text-blue-300">
                {t("finalizeProcessBeforeImport")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default" 
          className="w-full"
          onClick={onImportClick}
          disabled={!isPolicyImportReady}
        >
          <ArrowRight className="h-4 w-4 mr-1.5" />
          {t("importPolicy")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SelectedQuoteCard;
