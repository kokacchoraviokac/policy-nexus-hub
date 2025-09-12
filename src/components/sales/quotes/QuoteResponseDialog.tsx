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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Edit, Clock, AlertTriangle } from "lucide-react";
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
  const [responseType, setResponseType] = useState<'accept' | 'reject' | 'modify'>('accept');
  
  // Modified quote fields
  const [modifiedPremium, setModifiedPremium] = useState<number>(0);
  const [modifiedConditions, setModifiedConditions] = useState("");
  const [modificationReason, setModificationReason] = useState("");

  React.useEffect(() => {
    if (quote?.response_notes) {
      setResponseNotes(quote.response_notes);
    }
    if (quote?.premium_amount) {
      setModifiedPremium(quote.premium_amount);
    }
    if (quote?.special_conditions) {
      setModifiedConditions(quote.special_conditions);
    }
  }, [quote]);

  const handleSubmitResponse = async () => {
    if (!quote) return;

    // Validation
    if (responseType === 'modify') {
      if (!modifiedPremium || modifiedPremium <= 0) {
        toast.error(t("pleaseEnterValidPremium"));
        return;
      }
      if (!modificationReason.trim()) {
        toast.error(t("pleaseProvideModificationReason"));
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate processing the quote response
      await new Promise(resolve => setTimeout(resolve, 1500));

      let updatedQuote: Quote;

      if (responseType === 'accept') {
        updatedQuote = {
          ...quote,
          status: "responded",
          responded_at: new Date().toISOString(),
          response_notes: responseNotes || "Quote accepted by insurer",
          updated_at: new Date().toISOString(),
        };
        
        toast.success(t("quoteAccepted"), {
          description: t("quoteReadyForClientReview"),
        });
      } else if (responseType === 'modify') {
        updatedQuote = {
          ...quote,
          status: "responded",
          responded_at: new Date().toISOString(),
          premium_amount: modifiedPremium,
          special_conditions: modifiedConditions,
          response_notes: `${modificationReason}\n\nOriginal Notes: ${responseNotes}`,
          updated_at: new Date().toISOString(),
        };
        
        toast.success(t("quoteModified"), {
          description: t("modifiedQuoteReadyForClientReview"),
        });
      } else {
        updatedQuote = {
          ...quote,
          status: "rejected",
          responded_at: new Date().toISOString(),
          response_notes: responseNotes || "Quote rejected by insurer",
          updated_at: new Date().toISOString(),
        };
        
        toast.success(t("quoteRejected"), {
          description: t("quoteStatusUpdated"),
        });
      }

      console.log("Processing quote response:", { responseType, updatedQuote });

      onResponseHandled(updatedQuote);
      onOpenChange(false);
    } catch (error) {
      console.error("Error processing quote response:", error);
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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

          {/* Response Type Tabs */}
          <Tabs value={responseType} onValueChange={(value) => setResponseType(value as 'accept' | 'reject' | 'modify')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accept" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {t("accept")}
              </TabsTrigger>
              <TabsTrigger value="modify" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {t("modify")}
              </TabsTrigger>
              <TabsTrigger value="reject" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                {t("reject")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accept" className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">{t("acceptingQuote")}</span>
                </div>
                <p className="text-sm text-green-700">
                  {t("quoteWillBeAcceptedAsIs")}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="modify" className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">{t("modifyingQuote")}</span>
                </div>
                <p className="text-sm text-yellow-700">
                  {t("provideModifiedTerms")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modified-premium">{t("modifiedPremium")} *</Label>
                  <Input
                    id="modified-premium"
                    type="number"
                    step="0.01"
                    value={modifiedPremium}
                    onChange={(e) => setModifiedPremium(parseFloat(e.target.value) || 0)}
                    placeholder={t("enterModifiedPremium")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("currency")}</Label>
                  <Input value={quote.currency} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modified-conditions">{t("modifiedConditions")}</Label>
                <Textarea
                  id="modified-conditions"
                  value={modifiedConditions}
                  onChange={(e) => setModifiedConditions(e.target.value)}
                  placeholder={t("enterModifiedConditions")}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modification-reason">{t("modificationReason")} *</Label>
                <Textarea
                  id="modification-reason"
                  value={modificationReason}
                  onChange={(e) => setModificationReason(e.target.value)}
                  placeholder={t("explainWhyModifying")}
                  className="min-h-[60px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="reject" className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">{t("rejectingQuote")}</span>
                </div>
                <p className="text-sm text-red-700">
                  {t("quoteWillBeRejected")}
                </p>
              </div>
            </TabsContent>
          </Tabs>

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
            onClick={handleSubmitResponse}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("processing")}
              </>
            ) : (
              <>
                {responseType === 'accept' && <CheckCircle className="mr-2 h-4 w-4" />}
                {responseType === 'modify' && <Edit className="mr-2 h-4 w-4" />}
                {responseType === 'reject' && <XCircle className="mr-2 h-4 w-4" />}
                {responseType === 'accept' && t("acceptQuote")}
                {responseType === 'modify' && t("modifyQuote")}
                {responseType === 'reject' && t("rejectQuote")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteResponseDialog;