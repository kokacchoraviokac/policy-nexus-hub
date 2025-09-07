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
import { Send, Mail, FileText, Building, CheckCircle } from "lucide-react";
import { Policy } from "@/types/policies";
import { toast } from "sonner";

interface SendToInsurerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
  onSendComplete: (message: string) => void;
}

const SendToInsurerDialog: React.FC<SendToInsurerDialogProps> = ({
  open,
  onOpenChange,
  policy,
  onSendComplete,
}) => {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error(t("pleaseEnterMessage"));
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call to send signed policy to insurer
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Sending signed policy to insurer:", {
        policyId: policy.id,
        policyNumber: policy.policy_number,
        insurerName: policy.insurer_name,
        message,
      });

      toast.success(t("signedPolicySentToInsurer"), {
        description: t("awaitingInsurerApproval"),
      });

      onSendComplete(message);
      onOpenChange(false);
      setMessage("");
    } catch (error) {
      console.error("Error sending signed policy to insurer:", error);
      toast.error(t("errorSendingToInsurer"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {t("sendSignedPolicyToInsurer")}
          </DialogTitle>
          <DialogDescription>
            {t("sendSignedPolicyForFinalApproval")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4" />
                {t("policySummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t("policyNumber")}:</span>
                  <p className="text-muted-foreground">{policy.policy_number}</p>
                </div>
                <div>
                  <span className="font-medium">{t("client")}:</span>
                  <p className="text-muted-foreground">{policy.policyholder_name}</p>
                </div>
                <div>
                  <span className="font-medium">{t("insurer")}:</span>
                  <p className="text-muted-foreground">{policy.insurer_name}</p>
                </div>
                <div>
                  <span className="font-medium">{t("premium")}:</span>
                  <p className="text-muted-foreground">
                    {policy.premium} {policy.currency}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-medium text-sm">{t("status")}:</span>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {t("signedByClient")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What happens next */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-base text-blue-900">{t("whatHappensNext")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p>{t("insurerWillReviewSignature")}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p>{t("insurerWillValidatePolicy")}</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <p>{t("youWillReceiveConfirmation")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message to Insurer */}
          <div className="space-y-2">
            <Label htmlFor="message">{t("messageToInsurer")}*</Label>
            <Textarea
              id="message"
              placeholder={t("enterMessageForInsurer")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {t("messageWillBeIncludedWithSignedPolicy")}
            </p>
          </div>

          {/* Send Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t("sendOptions")}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{t("emailNotificationToInsurer")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{t("signedPolicyDocumentAttached")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span>{t("signatureValidationRequest")}</span>
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
          <Button onClick={handleSend} disabled={isSending || !message.trim()}>
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("sending")}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {t("sendToInsurer")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendToInsurerDialog;