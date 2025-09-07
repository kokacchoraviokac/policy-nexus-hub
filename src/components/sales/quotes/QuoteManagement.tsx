import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Send, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { SalesProcess } from "@/types/sales/salesProcesses";
import { Quote, QuoteStatus } from "@/types/sales/quotes";
import CreateQuoteDialog from "./CreateQuoteDialog";
import SendQuoteDialog from "./SendQuoteDialog";
import QuoteResponseDialog from "./QuoteResponseDialog";
import ClientQuoteSelectionDialog from "./ClientQuoteSelectionDialog";

interface QuoteManagementProps {
  process: SalesProcess;
  onQuoteSent?: () => void;
  onQuoteResponded?: () => void;
  onClientSelection?: () => void;
}

const QuoteManagement: React.FC<QuoteManagementProps> = ({
  process,
  onQuoteSent,
  onQuoteResponded,
  onClientSelection
}) => {
  const { t } = useLanguage();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    // Simulate fetching quotes for this sales process
    const mockQuotes: Quote[] = [
      {
        id: "quote-1",
        sales_process_id: process.id,
        insurer_id: "insurer-1",
        insurer_name: "ABC Insurance",
        quote_number: "Q-2024-001",
        coverage_details: "Comprehensive coverage including liability, property damage, and personal injury",
        premium_amount: 1250.00,
        currency: "EUR",
        validity_period_days: 30,
        special_conditions: "Valid for 6 months coverage period",
        status: "sent",
        sent_at: "2024-01-15T10:00:00Z",
        created_at: "2024-01-15T09:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
      },
      {
        id: "quote-2",
        sales_process_id: process.id,
        insurer_id: "insurer-2",
        insurer_name: "XYZ Insurance",
        quote_number: "Q-2024-002",
        coverage_details: "Standard coverage with optional add-ons available",
        premium_amount: 1180.00,
        currency: "EUR",
        validity_period_days: 30,
        status: "responded",
        sent_at: "2024-01-15T10:00:00Z",
        responded_at: "2024-01-16T14:00:00Z",
        response_notes: "Quote accepted with minor modifications",
        created_at: "2024-01-15T09:00:00Z",
        updated_at: "2024-01-16T14:00:00Z"
      }
    ];
    setQuotes(mockQuotes);
  }, [process.id]);

  const getStatusBadge = (status: QuoteStatus) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, icon: Clock, label: t("draft") },
      sent: { variant: "default" as const, icon: Send, label: t("sent") },
      responded: { variant: "outline" as const, icon: Eye, label: t("responded") },
      accepted: { variant: "default" as const, icon: CheckCircle, label: t("accepted") },
      rejected: { variant: "destructive" as const, icon: XCircle, label: t("rejected") },
      expired: { variant: "secondary" as const, icon: Clock, label: t("expired") }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleCreateQuote = () => {
    setCreateDialogOpen(true);
  };

  const handleSendQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setSendDialogOpen(true);
  };

  const handleQuoteResponse = (quote: Quote) => {
    setSelectedQuote(quote);
    setResponseDialogOpen(true);
  };

  const handleClientSelection = () => {
    setSelectionDialogOpen(true);
  };

  const hasRespondedQuotes = quotes.some(quote => quote.status === 'responded');
  const hasAcceptedQuote = quotes.some(quote => quote.status === 'accepted');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t("quoteManagement")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("manageQuotesForSalesProcess")}
          </p>
        </div>
        <div className="flex gap-2">
          {hasRespondedQuotes && !hasAcceptedQuote && (
            <Button onClick={handleClientSelection} variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              {t("clientSelection")}
            </Button>
          )}
          <Button onClick={handleCreateQuote}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("createQuote")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {quotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="text-center">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {t("noQuotesYet")}
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {t("createFirstQuoteToGetStarted")}
                </p>
                <Button onClick={handleCreateQuote} size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("createFirstQuote")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {quote.insurer_name} - {quote.quote_number}
                    </CardTitle>
                    <CardDescription>
                      {t("premium")}: {quote.premium_amount} {quote.currency}
                    </CardDescription>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {quote.coverage_details}
                  </p>

                  {quote.special_conditions && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        {t("specialConditions")}:
                      </p>
                      <p className="text-sm">{quote.special_conditions}</p>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {t("validFor")} {quote.validity_period_days} {t("days")}
                      {quote.sent_at && (
                        <span className="ml-2">
                          • {t("sent")}: {new Date(quote.sent_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {quote.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendQuote(quote)}
                        >
                          <Send className="mr-1 h-3 w-3" />
                          {t("send")}
                        </Button>
                      )}

                      {quote.status === 'sent' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuoteResponse(quote)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          {t("viewResponse")}
                        </Button>
                      )}

                      {quote.status === 'responded' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuoteResponse(quote)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          {t("reviewResponse")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <CreateQuoteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        salesProcessId={process.id}
        onQuoteCreated={(quote) => {
          setQuotes(prev => [...prev, quote]);
          onQuoteSent?.();
        }}
      />

      <SendQuoteDialog
        open={sendDialogOpen}
        onOpenChange={setSendDialogOpen}
        quote={selectedQuote}
        onQuoteSent={(updatedQuote) => {
          setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
          onQuoteSent?.();
        }}
      />

      <QuoteResponseDialog
        open={responseDialogOpen}
        onOpenChange={setResponseDialogOpen}
        quote={selectedQuote}
        onResponseHandled={(updatedQuote) => {
          setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q));
          onQuoteResponded?.();
        }}
      />

      <ClientQuoteSelectionDialog
        open={selectionDialogOpen}
        onOpenChange={setSelectionDialogOpen}
        quotes={quotes.filter(q => q.status === 'responded')}
        salesProcessId={process.id}
        onQuoteSelected={(selectedQuoteId) => {
          // Update the selected quote status to 'accepted'
          setQuotes(prev => prev.map(q =>
            q.id === selectedQuoteId
              ? { ...q, status: 'accepted' as QuoteStatus }
              : q.status === 'responded'
                ? { ...q, status: 'rejected' as QuoteStatus }
                : q
          ));
          onClientSelection?.();
        }}
      />
    </div>
  );
};

export default QuoteManagement;