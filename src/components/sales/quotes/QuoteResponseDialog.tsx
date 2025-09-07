import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Edit, Clock } from "lucide-react";
import { Quote } from "@/types/sales/quotes";
import { toast } from "sonner";

interface QuoteResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote | null;
  onResponseHandled: (quote: Quote) => void;
}

const QuoteResponseDialog: React.FC<QuoteResponseDialogProps> = ({
  open,
  onOpenChange,
  quote,
  onResponseHandled,
}) => {
  const { t } = useLanguage();
  const [responseNotes, setResponseNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (quote?.response_notes) {
      setResponseNotes(quote.response_notes);
    }
  }, [quote]);

  const handleAcceptQuote = async () => {
    if (!quote) return;

    setIsProcessing(true);

    try {
      // Simulate processing the quote acceptance
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedQuote: Quote = {
        ...quote,
        status: "responded",
        responded_at: new Date().toISOString(),
        response_notes: responseNotes || "Quote accepted by insurer",
        updated_at: new Date().toISOString(),
      };

      console.log("Accepting quote:", updatedQuote);

      toast.success(t("quoteAccepted"), {
        description: t("quoteReadyForClientReview"),
      });

      onResponseHandled(updatedQuote);
      onOpenChange(false);
    } catch (error) {
      console.error("Error accepting quote:", error);
      toast.error(t("errorProcessingQuote"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectQuote = async () => {
    if (!quote) return;

    setIsProcessing(true);

    try {
      // Simulate processing the quote rejection
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedQuote: Quote = {
        ...quote,
        status: "rejected",
        responded_at: new Date().toISOString(),
        response_notes: responseNotes || "Quote rejected by insurer",
        updated_at: new Date().toISOString(),
      };

      console.log("Rejecting quote:", updatedQuote);

      toast.success(t("quoteRejected"), {
        description: t("quoteStatusUpdated"),
      });

      onResponseHandled(updatedQuote);
      onOpenChange(false);
    } catch (error) {
      console.error("Error rejecting quote:", error);
      toast.error(t("errorProcessingQuote"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!quote) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      sent: { variant: "default" as const, icon: Clock, label: t("sent") },
      responded: { variant: "outline" as const, icon: Edit, label: t("responded") },
      accepted: { variant: "default" as const, icon: CheckCircle, label: t("accepted") },
      rejected: { variant: "destructive" as const, icon: XCircle, label: t("rejected") },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.sent;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("quoteResponse")}</DialogTitle>
          <DialogDescription>
            {t("handleInsurerResponse")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {quote.insurer_name} - {quote.quote_number}
                </CardTitle>
                {getStatusBadge(quote.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("premium")}:</span>
                  <p className="text-muted-foreground">
                    {quote.premium_amount} {quote.currency}
                  </p>
                </div>
                <div>
                  <span className="font-medium">{t("validity")}:</span>
                  <p className="text-muted-foreground">
                    {quote.validity_period_days} {t("days")}
                  </p>
                </div>
                {quote.sent_at && (
                  <div>
                    <span className="font-medium">{t("sentAt")}:</span>
                    <p className="text-muted-foreground">
                      {new Date(quote.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {quote.responded_at && (
                  <div>
                    <span className="font-medium">{t("respondedAt")}:</span>
                    <p className="text-muted-foreground">
                      {new Date(quote.responded_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className="font-medium text-sm">{t("coverageDetails")}:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {quote.coverage_details}
                </p>
              </div>

              {quote.special_conditions && (
                <div>
                  <span className="font-medium text-sm">{t("specialConditions")}:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quote.special_conditions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Response Notes */}
          <div className="space-y-2">
            <Label htmlFor="response-notes">{t("responseNotes")}</Label>
            <Textarea
              id="response-notes"
              placeholder={t("enterResponseNotes")}
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-xs text-muted-foreground">
              {t("notesWillBeRecorded")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAcceptQuote}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("processing")}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t("acceptQuote")}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleRejectQuote}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {t("processing")}
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  {t("rejectQuote")}
                </>
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteResponseDialog;