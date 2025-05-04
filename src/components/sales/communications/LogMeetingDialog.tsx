
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommunications } from "@/hooks/useCommunications";

interface LogMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onMeetingLogged?: () => void;
}

const LogMeetingDialog: React.FC<LogMeetingDialogProps> = ({
  open,
  onOpenChange,
  leadId,
  onMeetingLogged
}) => {
  const { t } = useLanguage();
  const { createCommunication } = useCommunications();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const resetForm = () => {
    setSubject("");
    setContent("");
  };

  const handleLogMeeting = async () => {
    if (!subject) return;

    setIsLogging(true);
    try {
      await createCommunication(
        leadId,
        'meeting',
        subject,
        content || t("noMeetingNotes")
      );
      
      onOpenChange(false);
      resetForm();
      if (onMeetingLogged) onMeetingLogged();
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
          <DialogTitle>{t("scheduleMeeting")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="subject">{t("meetingSubject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("meetingSubjectPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("meetingNotes")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("meetingNotesPlaceholder")}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleLogMeeting} 
            disabled={isLogging || !subject}
          >
            {isLogging ? t("saving") : t("schedule")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogMeetingDialog;
