
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Template } from '@/hooks/useCommunications';
import RichTextEditor from '../editor/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (data: Partial<Template>) => void;
  mode: 'create' | 'edit';
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSave,
  mode
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [variablesInput, setVariablesInput] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setCategory(template.category);
      setSubject(template.subject);
      setContent(template.content);
      setVariablesInput(template.variables.join(', '));
    } else {
      resetForm();
    }
  }, [template, open]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setSubject('');
    setContent('');
    setVariablesInput('');
    setActiveTab('edit');
  };

  const handleSave = async () => {
    if (!name || !category || !subject || !content) return;

    setIsSaving(true);
    try {
      // Parse variables from comma-separated input
      const variables = variablesInput
        .split(',')
        .map(v => v.trim())
        .filter(v => v);

      await onSave({
        name,
        category,
        subject,
        content,
        variables
      });
      
      resetForm();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to preview the template with sample data
  const previewContent = () => {
    let preview = content;
    const sampleData = {
      lead_name: "John Doe",
      company_name: "Acme Inc.",
      user_name: "Jane Smith",
      topic: "Insurance Policy",
      service: "Life Insurance",
      amount: "$5,000"
    };

    // Replace variables with sample data
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return preview;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t("createEmailTemplate") : t("editEmailTemplate")}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="edit">{t("edit")}</TabsTrigger>
            <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("templateName")}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("templateNamePlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{t("category")}</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={t("categoryPlaceholder")}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">{t("subject")}</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subjectPlaceholder")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variables">{t("variables")}</Label>
              <Input
                id="variables"
                value={variablesInput}
                onChange={(e) => setVariablesInput(e.target.value)}
                placeholder={t("variablesPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">
                {t("variablesHelp")}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">{t("emailContent")}</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder={t("emailContentPlaceholder")}
                minHeight="200px"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <div className="border rounded-md p-4 space-y-2">
              <div className="font-medium">{t("subject")}: {subject}</div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent() }}
              />
            </div>
            
            <div className="border rounded-md p-4 space-y-2">
              <div className="font-medium">{t("variablesUsed")}:</div>
              <ul className="list-disc list-inside">
                {variablesInput.split(',').map((variable, index) => (
                  <li key={index}>{variable.trim()}</li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !name || !category || !subject || !content}
          >
            {isSaving ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
