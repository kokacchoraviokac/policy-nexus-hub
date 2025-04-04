
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus, FileText, ArrowRight, RefreshCw } from "lucide-react";
import { SalesProcess } from "@/types/salesProcess";
import { Quote, QuoteRequest } from "@/types/quotes";
import { useQuoteManagement } from "@/hooks/useQuoteManagement";
import AddQuoteDialog from "@/components/sales/processes/AddQuoteDialog";
import ImportPolicyFromQuoteDialog from "@/components/sales/processes/ImportPolicyFromQuoteDialog";
import QuotesList from "@/components/sales/quotes/QuotesList";
import SelectedQuoteCard from "@/components/sales/quotes/SelectedQuoteCard";
import { toast } from "sonner";

interface QuoteManagementPanelProps {
  process: SalesProcess;
  onQuoteSelected?: (quoteId: string) => void;
}

const QuoteManagementPanel: React.FC<QuoteManagementPanelProps> = ({ 
  process,
  onQuoteSelected
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [addQuoteOpen, setAddQuoteOpen] = useState(false);
  const [importPolicyOpen, setImportPolicyOpen] = useState(false);

  const {
    quotes,
    isLoading,
    error,
    selectedQuote,
    loadQuotes,
    addQuote,
    submitQuote,
    changeQuoteStatus,
    findSelectedQuote
  } = useQuoteManagement(process.id);
  
  // Load quotes on initial render
  useEffect(() => {
    loadQuotes();
    findSelectedQuote();
  }, [loadQuotes, findSelectedQuote]);

  const handleAddQuote = async (quoteData: any) => {
    // Convert the data to match the QuoteRequest interface
    const quoteRequest: QuoteRequest = {
      salesProcessId: process.id,
      insurerName: quoteData.insurerName,
      coverageDetails: quoteData.coverageDetails,
      requestedAmount: quoteData.amount,
      currency: quoteData.currency || 'EUR',
      notes: quoteData.notes,
      coverageStartDate: quoteData.coverageStartDate,
      coverageEndDate: quoteData.coverageEndDate
    };
    
    await addQuote(quoteRequest);
  };

  const handleSelectQuote = async (quoteId: string) => {
    const updated = await changeQuoteStatus(quoteId, "selected");
    if (updated && onQuoteSelected) {
      onQuoteSelected(quoteId);
    }
  };

  const handleSendReminder = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    
    if (quote?.status === 'draft') {
      await submitQuote(quoteId);
    } else {
      // Just show a toast for demo purposes
      toast.success(t("reminderSent"), {
        description: t("reminderSentDescription")
      });
    }
  };
  
  const handleRefreshQuotes = () => {
    loadQuotes();
    toast.success(t("quotesRefreshed"), {
      description: t("quotesRefreshedDescription")
    });
  };
  
  const handleImportPolicy = () => {
    setImportPolicyOpen(true);
  };
  
  // Check if the sales process is eligible for policy import
  const isPolicyImportReady = process.stage === "concluded" && process.status === "completed" && !!selectedQuote;
  
  if (error) {
    return (
      <Card className="border border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-700">
            <p>{t("errorLoadingQuotes")}</p>
            <Button 
              onClick={() => loadQuotes()} 
              variant="outline" 
              className="mt-4"
            >
              {t("tryAgain")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("quoteManagement")}</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefreshQuotes}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            {t("refresh")}
          </Button>
          <Button size="sm" onClick={() => setAddQuoteOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            {t("addQuote")}
          </Button>
        </div>
      </div>
      
      <QuotesList 
        quotes={quotes}
        onSelectQuote={handleSelectQuote}
        onSendReminder={handleSendReminder}
        isLoading={isLoading}
      />
      
      {selectedQuote && (
        <SelectedQuoteCard
          quote={selectedQuote}
          process={process}
          isPolicyImportReady={isPolicyImportReady}
          onImportClick={handleImportPolicy}
        />
      )}
      
      <AddQuoteDialog 
        open={addQuoteOpen} 
        onOpenChange={setAddQuoteOpen}
        onQuoteAdded={handleAddQuote}
      />
      
      {selectedQuote && (
        <ImportPolicyFromQuoteDialog
          open={importPolicyOpen}
          onOpenChange={setImportPolicyOpen}
          process={process}
          quote={{
            id: selectedQuote.id,
            insurer: selectedQuote.insurerName,
            amount: selectedQuote.amount,
            coverage: selectedQuote.coverageDetails,
            status: selectedQuote.status,
            date: selectedQuote.createdAt
          }}
        />
      )}
    </div>
  );
};

export default QuoteManagementPanel;
