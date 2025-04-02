import React from "react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Send } from "lucide-react";
import { Proposal, ProposalStatus } from "@/types/sales";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface SendProposalDialogProps {
  proposal: Proposal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: () => void;
}

const SendProposalDialog: React.FC<SendProposalDialogProps> = ({
  proposal,
  open,
  onOpenChange,
  onSend
}) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(addDays(new Date(), 30));
  const [includePDF, setIncludePDF] = useState(true);
  const [sending, setSending] = useState(false);
  
  const handleSend = () => {
    if (!email) {
      toast.error(t("emailRequired"));
      return;
    }
    
    setSending(true);
    
    // Simulate sending process
    setTimeout(() => {
      setSending(false);
      toast.success(t("proposalSent"), {
        description: t("proposalSentDescription", { email })
      });
      onSend();
      onOpenChange(false);
    }, 1000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("sendProposal")}</DialogTitle>
          <DialogDescription>
            {t("sendProposalDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">{t("recipientEmail")}</Label>
            <Input
              id="recipient"
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">{t("emailMessage")}</Label>
            <Textarea
              id="message"
              placeholder={t("emailMessagePlaceholder")}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry-date">{t("expiryDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : <span>{t("selectDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              {t("proposalExpiryDescription")}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="attach-pdf"
              checked={includePDF}
              onCheckedChange={setIncludePDF}
            />
            <Label htmlFor="attach-pdf">{t("attachPDF")}</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-b-transparent" />
                {t("sending")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t("sendProposal")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendProposalDialog;
