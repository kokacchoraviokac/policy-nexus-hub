
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { CalendarIcon, Clock } from 'lucide-react';
import { useCommunications } from '@/hooks/useCommunications';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  contactName?: string;
  onMeetingLogged?: () => void;
}

const LogMeetingDialog: React.FC<LogMeetingDialogProps> = ({
  open,
  onOpenChange,
  leadId,
  contactName,
  onMeetingLogged
}) => {
  const { t } = useLanguage();
  const { createCommunication, isLoading } = useCommunications(leadId);
  
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
  const [meetingType, setMeetingType] = useState('in_person');
  
  const resetForm = () => {
    setSubject('');
    setDate(new Date());
    setTime('');
    setDuration('30');
    setNotes('');
    setMeetingType('in_person');
  };
  
  const handleSubmit = async () => {
    if (!subject) {
      toast.error(t("subjectRequired"));
      return;
    }
    
    if (!time) {
      toast.error(t("timeRequired"));
      return;
    }
    
    try {
      const content = `
        <p><strong>${t("meetingType")}:</strong> ${meetingType === 'in_person' ? t("inPerson") : t("virtual")}</p>
        <p><strong>${t("duration")}:</strong> ${duration} ${t("minutes")}</p>
        <p><strong>${t("notes")}:</strong></p>
        <p>${notes || t("noNotesProvided")}</p>
      `;
      
      const metadata = {
        meetingType,
        duration: parseInt(duration),
        meetingDate: format(date, 'yyyy-MM-dd'),
        meetingTime: time
      };
      
      await createCommunication({
        subject,
        content,
        type: 'meeting',
        direction: 'outbound',
        status: 'completed',
        metadata
      });
      
      toast.success(t("meetingLogged"));
      onOpenChange(false);
      resetForm();
      
      if (onMeetingLogged) {
        onMeetingLogged();
      }
    } catch (error) {
      console.error('Error logging meeting:', error);
      toast.error(t("errorLoggingMeeting"));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("logMeeting")}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">{t("subject")}</Label>
            <Input
              id="subject"
              placeholder={contactName ? `${t("meetingWith")} ${contactName}` : t("enterSubject")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>{t("date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>{t("pickDate")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">{t("time")}</Label>
              <div className="flex">
                <div className="relative w-full">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    className="pl-10"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">{t("duration")} ({t("minutes")})</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="meeting-type">{t("meetingType")}</Label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger id="meeting-type">
                  <SelectValue placeholder={t("selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_person">{t("inPerson")}</SelectItem>
                  <SelectItem value="virtual">{t("virtual")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("enterMeetingNotes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? t("saving") : t("saveLog")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogMeetingDialog;
