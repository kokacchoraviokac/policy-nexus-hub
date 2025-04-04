
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Send, FileText } from "lucide-react";
import { Quote } from "@/types/quotes";

interface QuotesListProps {
  quotes: Quote[];
  isLoading: boolean;
  onSelectQuote: (quoteId: string) => void;
  onSendReminder: (quoteId: string) => void;
}

const QuotesList: React.FC<QuotesListProps> = ({
  quotes,
  isLoading,
  onSelectQuote,
  onSendReminder
}) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("pending")}</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("received")}</Badge>;
      case 'selected':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("selected")}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t("rejected")}</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{t("expired")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map(quote => (
        <Card key={quote.id} className={`border ${quote.status === "selected" ? "border-green-300 bg-green-50/30" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{quote.insurerName}</CardTitle>
              {getStatusBadge(quote.status)}
            </div>
            <CardDescription>{new Date(quote.createdAt).toLocaleDateString()}</CardDescription>
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
            {(quote.status === "draft" || quote.status === "pending") && (
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default QuotesList;
