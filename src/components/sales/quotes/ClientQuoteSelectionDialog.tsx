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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star } from "lucide-react";
import { Quote } from "@/types/sales/quotes";
import { toast } from "sonner";

interface ClientQuoteSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotes: Quote[];
  salesProcessId: string;
  onQuoteSelected: (quoteId: string) => void;
}

const ClientQuoteSelectionDialog: React.FC<ClientQuoteSelectionDialogProps> = ({
  open,
  onOpenChange,
  quotes,
  salesProcessId,
  onQuoteSelected,
}) => {
  const { t } = useLanguage();
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [clientFeedback, setClientFeedback] = useState("");
  const [selectionReason, setSelectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!selectedQuoteId) {
      toast.error(t("pleaseSelectQuote"));
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing the client selection
      await new Promise(resolve => setTimeout(resolve, 2000));

      const selectedQuote = quotes.find(q => q.id === selectedQuoteId);
      
      console.log("Client selected quote:", {
        salesProcessId,
        selectedQuoteId,
        selectedQuote,
        clientFeedback,
        selectionReason,
      });

      // Simulate notifying the insurer about client selection
      console.log("Notifying insurer about client selection:", {
        insurer: selectedQuote?.insurer_name,
        quoteNumber: selectedQuote?.quote_number,
        clientDecision: "accepted"
      });

      toast.success(t("quoteSelectedSuccessfully"), {
        description: t("policyCreationWillBegin"),
      });

      // Trigger policy import process
      console.log("Triggering policy import process for selected quote:", selectedQuoteId);

      onQuoteSelected(selectedQuoteId);
      onOpenChange(false);

      // Reset form
      setSelectedQuoteId("");
      setClientFeedback("");
      setSelectionReason("");
    } catch (error) {
      console.error("Error processing quote selection:", error);
      toast.error(t("errorProcessingSelection"));
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedQuote = quotes.find(q => q.id === selectedQuoteId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            {t("clientQuoteSelection")}
          </DialogTitle>
          <DialogDescription>
            {t("helpClientChooseBestQuote")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quote Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">{t("selectQuote")}</Label>
            <RadioGroup value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <div key={quote.id} className="relative">
                    <RadioGroupItem
                      value={quote.id}
                      id={quote.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={quote.id}
                      className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-4 h-4 border-2 border-muted-foreground rounded-full peer-checked:border-primary peer-checked:bg-primary"></div>
                      </div>

                      <Card className="flex-1 border-0 shadow-none">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              {quote.insurer_name}
                            </CardTitle>
                            <Badge variant="outline">
                              {quote.premium_amount} {quote.currency}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <p className="text-muted-foreground">
                              {quote.coverage_details}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{t("validity")}: {quote.validity_period_days} {t("days")}</span>
                              {quote.responded_at && (
                                <span>
                                  {t("responded")}: {new Date(quote.responded_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {quote.special_conditions && (
                              <p className="text-xs italic text-muted-foreground">
                                {t("specialConditions")}: {quote.special_conditions}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Selection Details */}
          {selectedQuote && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  {t("selectedQuote")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t("insurer")}:</span>
                    <p className="text-muted-foreground">{selectedQuote.insurer_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t("premium")}:</span>
                    <p className="text-muted-foreground">
                      {selectedQuote.premium_amount} {selectedQuote.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Feedback */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-feedback">{t("clientFeedback")}</Label>
              <Textarea
                id="client-feedback"
                placeholder={t("enterClientFeedback")}
                value={clientFeedback}
                onChange={(e) => setClientFeedback(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selection-reason">{t("selectionReason")}</Label>
              <Textarea
                id="selection-reason"
                placeholder={t("whyDidClientChooseThisQuote")}
                value={selectionReason}
                onChange={(e) => setSelectionReason(e.target.value)}
                className="min-h-[60px]"
              />
            </div>
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
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || !selectedQuoteId}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("processing")}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t("confirmSelection")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientQuoteSelectionDialog;