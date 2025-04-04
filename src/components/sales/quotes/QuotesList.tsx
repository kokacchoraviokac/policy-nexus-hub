
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Quote, QuoteStatus } from "@/types/quotes";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Send, AlertTriangle, FileText, RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface QuotesListProps {
  quotes: Quote[];
  onSelectQuote: (quoteId: string) => void;
  onSendReminder: (quoteId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const QuotesList: React.FC<QuotesListProps> = ({
  quotes,
  onSelectQuote,
  onSendReminder,
  isLoading = false,
  className
}) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{t("draft")}</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("pending")}</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("received")}</Badge>;
      case 'selected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("selected")}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t("rejected")}</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{t("expired")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mt-1"></div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card className="border border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">{t("noQuotesYet")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {quotes.map((quote) => (
        <Card key={quote.id} className={`border ${quote.status === "selected" ? "border-green-300 bg-green-50/30" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="font-medium">{quote.insurerName}</div>
              {getStatusBadge(quote.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              {quote.sentAt ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {t("sentOn", { date: formatDate(quote.sentAt) })}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {t("createdOn", { date: formatDate(quote.createdAt) })}
                </span>
              )}
            </p>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t("amount")}:</span>
                <span className="text-sm font-medium">{quote.amount}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">{t("coverage")}:</span>
                <p className="text-sm mt-1">{quote.coverageDetails}</p>
              </div>
              {quote.expiresAt && (
                <div className="flex items-center text-sm">
                  {new Date(quote.expiresAt) < new Date() ? (
                    <span className="flex items-center text-red-600">
                      <AlertTriangle className="h-3 w-3 mr-1" /> {t("expired")}
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <Clock className="h-3 w-3 mr-1" /> {t("expiresOn", { date: formatDate(quote.expiresAt) })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {quote.status === "received" && (
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                onClick={() => onSelectQuote(quote.id)}
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
                onClick={() => onSendReminder(quote.id)}
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
            {quote.status === "draft" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onSendReminder(quote.id)}
              >
                <Send className="h-4 w-4 mr-1.5" />
                {t("sendToInsurer")}
              </Button>
            )}
            {quote.status === "rejected" && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
                disabled
              >
                <Check className="h-4 w-4 mr-1.5" />
                {t("rejected")}
              </Button>
            )}
            {quote.status === "expired" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onSendReminder(quote.id)}
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                {t("requestRenewal")}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default QuotesList;
