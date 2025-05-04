
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommunications } from "@/hooks/useCommunications";

interface LogCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onCallLogged?: () => void;
}

const LogCallDialog: React.FC<LogCallDialogProps> = ({
  open,
  onOpenChange,
  leadId,
  onCallLogged
}) => {
  const { t } = useLanguage();
  const { createCommunication } = useCommunications();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [direction, setDirection] = useState<'outbound' | 'inbound'>('outbound');
  const [isLogging, setIsLogging] = useState(false);

  const resetForm = () => {
    setSubject("");
    setContent("");
    setDirection('outbound');
  };

  const handleLogCall = async () => {
    if (!subject) return;

    setIsLogging(true);
    try {
      await createCommunication(
        leadId,
        'call',
        subject,
        content || t("noCallNotes")
      );
      
      onOpenChange(false);
      resetForm();
      if (onCallLogged) onCallLogged();
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("logCall")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("callDirection")}</Label>
            <Select
              value={direction}
              onValueChange={(value) => setDirection(value as 'outbound' | 'inbound')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outbound">{t("outbound")}</SelectItem>
                <SelectItem value="inbound">{t("inbound")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">{t("callSubject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("callSubjectPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("callNotes")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("callNotesPlaceholder")}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleLogCall} 
            disabled={isLogging || !subject}
          >
            {isLogging ? t("saving") : t("saveCall")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogCallDialog;
