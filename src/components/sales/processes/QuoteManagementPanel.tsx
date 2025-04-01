
import React, { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Send, Check, RefreshCw, ArrowRight } from "lucide-react";
import { SalesProcess } from "@/hooks/sales/useSalesProcessData";
import AddQuoteDialog from "./AddQuoteDialog";
import ImportPolicyFromQuoteDialog from "./ImportPolicyFromQuoteDialog";
import { toast } from "sonner";

interface InsuranceQuote {
  id: string;
  insurer: string;
  amount: string;
  coverage: string;
  status: "pending" | "received" | "selected" | "rejected";
  date: string;
}

// Mock data for insurance quotes
const mockQuotes: InsuranceQuote[] = [
  {
    id: "quote-1",
    insurer: "Alpha Insurance",
    amount: "€12,500",
    coverage: "Full coverage with additional cyber protection",
    status: "received",
    date: "2023-09-05"
  },
  {
    id: "quote-2",
    insurer: "Omega Assurance",
    amount: "€10,800",
    coverage: "Standard business package",
    status: "received",
    date: "2023-09-06"
  },
  {
    id: "quote-3",
    insurer: "Security First",
    amount: "€13,200",
    coverage: "Premium coverage with extended liability",
    status: "pending",
    date: "2023-09-04"
  }
];

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
  const [quotes, setQuotes] = useState<InsuranceQuote[]>(mockQuotes);
  const [addQuoteOpen, setAddQuoteOpen] = useState(false);
  const [importPolicyOpen, setImportPolicyOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const handleAddQuote = (quoteData: { insurer: string; amount: string; coverage: string }) => {
    const newQuote: InsuranceQuote = {
      id: `quote-${Date.now()}`,
      insurer: quoteData.insurer,
      amount: quoteData.amount,
      coverage: quoteData.coverage,
      status: "pending",
      date: new Date().toISOString().split('T')[0]
    };
    
    setQuotes([...quotes, newQuote]);
    toast.success(t("quoteAdded"), {
      description: t("quoteAddedDescription", { insurer: newQuote.insurer })
    });
  };
  
  const handleRefreshQuotes = () => {
    setRefreshing(true);
    // Simulate API refresh delay
    setTimeout(() => {
      // Simulate receiving updated quotes from insurers
      const updatedQuotes = [...quotes];
      updatedQuotes.forEach(quote => {
        if (quote.status === "pending") {
          // Random chance to change pending quotes to received
          if (Math.random() > 0.5) {
            quote.status = "received";
          }
        }
      });
      
      setQuotes(updatedQuotes);
      setRefreshing(false);
      toast.success(t("quotesRefreshed"), {
        description: t("quotesRefreshedDescription")
      });
    }, 1000);
  };
  
  const handleSelectQuote = (quoteId: string) => {
    setQuotes(quotes.map(quote => ({
      ...quote,
      status: quote.id === quoteId ? "selected" : 
              quote.status === "selected" ? "received" : quote.status
    })));
    
    setSelectedQuoteId(quoteId);
    
    if (onQuoteSelected) {
      onQuoteSelected(quoteId);
    }
    
    toast.success(t("quoteSelected"), {
      description: t("quoteSelectedDescription")
    });
  };
  
  const handleSendReminder = (quoteId: string) => {
    toast.success(t("reminderSent"), {
      description: t("reminderSentDescription")
    });
  };
  
  const handleImportPolicy = () => {
    setImportPolicyOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("pending")}</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("received")}</Badge>;
      case 'selected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("selected")}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t("rejected")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const selectedQuote = quotes.find(quote => quote.status === "selected");
  
  // Check if the sales process is eligible for policy import
  const isPolicyImportReady = process.stage === "concluded" && process.status === "completed" && selectedQuote;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("quoteManagement")}</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefreshQuotes}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            {t("refresh")}
          </Button>
          <Button size="sm" onClick={() => setAddQuoteOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            {t("addQuote")}
          </Button>
        </div>
      </div>
      
      {quotes.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">{t("noQuotesYet")}</p>
            <Button className="mt-4" onClick={() => setAddQuoteOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" />
              {t("addQuote")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map(quote => (
            <Card key={quote.id} className={`border ${quote.status === "selected" ? "border-green-300 bg-green-50/30" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{quote.insurer}</CardTitle>
                  {getStatusBadge(quote.status)}
                </div>
                <CardDescription>{quote.date}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t("amount")}:</span>
                    <span className="text-sm font-medium">{quote.amount}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{t("coverage")}:</span>
                    <p className="text-sm mt-1">{quote.coverage}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {quote.status === "received" && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSelectQuote(quote.id)}
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    {t("selectQuote")}
                  </Button>
                )}
                {quote.status === "pending" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleSendReminder(quote.id)}
                  >
                    <Send className="h-4 w-4 mr-1.5" />
                    {t("sendReminder")}
                  </Button>
                )}
                {quote.status === "selected" && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    disabled
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    {t("selected")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {selectedQuote && (
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
                <span className="text-sm">{selectedQuote.insurer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">{t("amount")}:</span>
                <span className="text-sm">{selectedQuote.amount}</span>
              </div>
              <div>
                <span className="text-sm font-medium">{t("coverage")}:</span>
                <p className="text-sm mt-1">{selectedQuote.coverage}</p>
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
              onClick={handleImportPolicy}
              disabled={!isPolicyImportReady}
            >
              <ArrowRight className="h-4 w-4 mr-1.5" />
              {t("importPolicy")}
            </Button>
          </CardFooter>
        </Card>
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
          quote={selectedQuote}
        />
      )}
    </div>
  );
};

export default QuoteManagementPanel;
