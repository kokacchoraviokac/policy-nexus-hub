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
import { Send, Mail, FileText, User } from "lucide-react";
import { Policy } from "@/types/policies";
import { toast } from "sonner";

interface SendToClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
  onSendComplete: (message: string) => void;
}

const SendToClientDialog: React.FC<SendToClientDialogProps> = ({
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
      // Simulate API call to send policy to client
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Sending policy to client:", {
        policyId: policy.id,
        policyNumber: policy.policy_number,
        message,
      });

      toast.success(t("policySentToClientSuccessfully"), {
        description: t("clientWillReceiveNotification"),
      });

      onSendComplete(message);
      onOpenChange(false);
      setMessage("");
    } catch (error) {
      console.error("Error sending policy to client:", error);
      toast.error(t("errorSendingPolicy"));
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
            {t("sendPolicyToClient")}
          </DialogTitle>
          <DialogDescription>
            {t("sendPolicyForClientSignature")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("policySummary")}</CardTitle>
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
                <span className="font-medium text-sm">{t("coveragePeriod")}:</span>
                <p className="text-sm text-muted-foreground">
                  {policy.start_date} - {policy.expiry_date}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Message to Client */}
          <div className="space-y-2">
            <Label htmlFor="message">{t("messageToClient")}*</Label>
            <Textarea
              id="message"
              placeholder={t("enterMessageForClient")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {t("messageWillBeIncludedWithPolicy")}
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
                <span>{t("policyDocumentAttached")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{t("signatureInstructionsIncluded")}</span>
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
                {t("sendPolicy")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendToClientDialog;