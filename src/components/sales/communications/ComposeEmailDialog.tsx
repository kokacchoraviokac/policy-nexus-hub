
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCommunications } from "@/hooks/useCommunications";
import { Template } from "@/types/sales/templates";
import RichTextEditor from "../editor/RichTextEditor";

interface ComposeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: {
    id: string;
    name: string;
    email?: string;
    company_id: string;
  };
  templates: Template[];
  onEmailSent?: () => void;
}

const ComposeEmailDialog: React.FC<ComposeEmailDialogProps> = ({
  open,
  onOpenChange,
  lead,
  templates,
  onEmailSent
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { sendEmail } = useCommunications();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSubject("");
      setContent("");
      setSelectedTemplateId("");
    }
  }, [open]);

  // Load template content when a template is selected
  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        let processedSubject = template.subject;
        let processedContent = template.content;
        
        // Replace variables with actual values
        if (lead.name) {
          processedSubject = processedSubject.replace(/{{lead_name}}/g, lead.name);
          processedContent = processedContent.replace(/{{lead_name}}/g, lead.name);
        }
        
        if (user?.name) {
          processedSubject = processedSubject.replace(/{{user_name}}/g, user.name);
          processedContent = processedContent.replace(/{{user_name}}/g, user.name);
        }
        
        // You could add more variable replacements here
        
        setSubject(processedSubject);
        setContent(processedContent);
      }
    }
  }, [selectedTemplateId, templates, lead, user]);

  const handleSendEmail = async () => {
    if (!lead.email || !subject || !content) return;
    
    setIsSending(true);
    try {
      await sendEmail(
        { ...lead, name: lead.name, email: lead.email },
        subject,
        content,
        selectedTemplateId || undefined
      );
      
      onOpenChange(false);
      if (onEmailSent) onEmailSent();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("composeEmail")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("emailTemplate")}</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectTemplate")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("noTemplate")}</SelectItem>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="to">{t("to")}</Label>
              <Input
                id="to"
                value={`${lead.name}${lead.email ? ` <${lead.email}>` : ''}`}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from">{t("from")}</Label>
              <Input
                id="from"
                value={user?.email || ""}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("subject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("emailSubjectPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("content")}</Label>
            <RichTextEditor 
              value={content} 
              onChange={setContent}
              placeholder={t("emailContentPlaceholder")}
              minHeight="200px"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSending || !subject || !content || !lead.email}
          >
            {isSending ? t("sending") : t("sendEmail")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeEmailDialog;
