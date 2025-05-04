
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template } from '@/hooks/useCommunications';
import RichTextEditor from '../editor/RichTextEditor';

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (data: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
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
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [variableInput, setVariableInput] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'lead_welcome',
    'lead_followup',
    'quote',
    'general',
    'reminder',
    'meeting'
  ];

  useEffect(() => {
    if (template && open) {
      setName(template.name);
      setSubject(template.subject);
      setContent(template.content);
      setCategory(template.category);
      setVariables(template.variables || []);
      setIsDefault(template.is_default);
    } else if (!template && open) {
      // Reset form for new template
      resetForm();
    }
  }, [template, open]);

  const resetForm = () => {
    setName('');
    setSubject('');
    setContent('');
    setCategory('general');
    setVariables([]);
    setVariableInput('');
    setIsDefault(false);
  };

  const handleAddVariable = () => {
    if (variableInput && !variables.includes(variableInput)) {
      setVariables(prev => [...prev, variableInput]);
      setVariableInput('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(prev => prev.filter(v => v !== variable));
  };

  const handleSave = async () => {
    if (!name || !subject || !content || !category) return;

    setIsSaving(true);
    try {
      await onSave({
        name,
        subject,
        content,
        category,
        variables,
        is_default: isDefault
      });
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t("createTemplate") : t("editTemplate")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">{t("templateName")}</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("templateNamePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("category")}</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {t(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-subject">{t("subject")}</Label>
            <Input
              id="template-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("emailSubjectPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-content">{t("content")}</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={t("templateContentPlaceholder")}
              minHeight="200px"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("variables")}</Label>
            <div className="flex gap-2">
              <Input
                value={variableInput}
                onChange={(e) => setVariableInput(e.target.value)}
                placeholder={t("addVariablePlaceholder")}
              />
              <Button
                type="button"
                onClick={handleAddVariable}
                disabled={!variableInput}
              >
                {t("addVariable")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {variables.map(variable => (
                <div key={variable} className="bg-muted px-3 py-1 rounded-md flex items-center gap-2">
                  <span>{{variable}}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveVariable(variable)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
              {variables.length === 0 && (
                <span className="text-muted-foreground text-sm">{t("noVariables")}</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !name || !subject || !content || !category}
          >
            {isSaving ? t("saving") : t("saveTemplate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
