
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommunications } from "@/hooks/useCommunications";

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onNoteCreated?: () => void;
}

const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({
  open,
  onOpenChange,
  leadId,
  onNoteCreated
}) => {
  const { t } = useLanguage();
  const { createCommunication } = useCommunications();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const resetForm = () => {
    setSubject("");
    setContent("");
  };

  const handleCreateNote = async () => {
    if (!subject || !content) return;

    setIsCreating(true);
    try {
      await createCommunication(
        leadId,
        'note',
        subject,
        content
      );
      
      onOpenChange(false);
      resetForm();
      if (onNoteCreated) onNoteCreated();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addNote")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="subject">{t("subject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("noteTitlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("noteContent")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("noteContentPlaceholder")}
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleCreateNote} 
            disabled={isCreating || !subject || !content}
          >
            {isCreating ? t("saving") : t("saveNote")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
