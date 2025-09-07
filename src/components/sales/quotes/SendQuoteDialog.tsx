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
import { Send, Mail, FileText } from "lucide-react";
import { Quote } from "@/types/sales/quotes";
import { toast } from "sonner";

interface SendQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: Quote | null;
  onQuoteSent: (quote: Quote) => void;
}

const SendQuoteDialog: React.FC<SendQuoteDialogProps> = ({
  open,
  onOpenChange,
  quote,
  onQuoteSent,
}) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!quote) return;

    setIsSending(true);

    try {
      // Simulate API call to send quote to insurer
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedQuote: Quote = {
        ...quote,
        status: "sent",
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Sending quote to insurer:", {
        quote: updatedQuote,
        message,
      });

      toast.success(t("quoteSentSuccessfully"), {
        description: t("insurerWillRespondShortly"),
      });

      onQuoteSent(updatedQuote);
      onOpenChange(false);
      setMessage("");
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error(t("errorSendingQuote"));
    } finally {
      setIsSending(false);
    }
  };

  if (!quote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {t("sendQuoteToInsurer")}
          </DialogTitle>
          <DialogDescription>
            {t("reviewQuoteBeforeSending")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("quoteSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("insurer")}:</span>
                  <p className="text-muted-foreground">{quote.insurer_name}</p>
                </div>
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
                <div>
                  <span className="font-medium">{t("status")}:</span>
                  <p className="text-muted-foreground">{t("draft")}</p>
                </div>
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

          {/* Message to Insurer */}
          <div className="space-y-2">
            <Label htmlFor="message">{t("messageToInsurer")}</Label>
            <Textarea
              id="message"
              placeholder={t("enterMessageToInsurer")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {t("messageWillBeSentWithQuote")}
            </p>
          </div>

          {/* Send Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t("sendOptions")}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{t("emailNotification")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{t("quoteDocumentAttached")}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("sending")}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t("sendQuote")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendQuoteDialog;