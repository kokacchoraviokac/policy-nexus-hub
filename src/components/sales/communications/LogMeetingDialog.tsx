
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useCommunications } from "@/hooks/useCommunications";
import { cn } from "@/lib/utils";

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
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState("");
  const [isLogging, setIsLogging] = useState(false);

  const resetForm = () => {
    setSubject("");
    setContent("");
    setMeetingDate(new Date());
    setLocation("");
  };

  const handleLogMeeting = async () => {
    if (!subject || !meetingDate) return;

    setIsLogging(true);
    try {
      // Format the content to include meeting details
      const meetingContent = `
        <p><strong>${t("meetingDate")}:</strong> ${format(meetingDate, "PPP")}</p>
        ${location ? `<p><strong>${t("location")}:</strong> ${location}</p>` : ''}
        ${content ? `<p><strong>${t("notes")}:</strong></p><p>${content}</p>` : ''}
      `;

      await createCommunication(
        leadId,
        'meeting',
        subject,
        meetingContent
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
            <Label>{t("meetingDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !meetingDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {meetingDate ? format(meetingDate, "PPP") : <span>{t("pickDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={meetingDate}
                  onSelect={setMeetingDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("locationPlaceholder")}
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
            disabled={isLogging || !subject || !meetingDate}
          >
            {isLogging ? t("saving") : t("saveMeeting")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogMeetingDialog;
