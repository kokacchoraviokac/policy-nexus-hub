
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Template } from '@/types/sales/templates';
import RichTextEditor from '../editor/RichTextEditor';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X } from 'lucide-react';

interface EditTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (data: Partial<Template>) => Promise<void>;
}

const EditTemplateDialog: React.FC<EditTemplateDialogProps> = ({
  open,
  onOpenChange,
  template,
  onSave
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load template data when editing
  useEffect(() => {
    if (template) {
      setName(template.name);
      setSubject(template.subject);
      setContent(template.content);
      setCategory(template.category);
      setVariables(template.variables || []);
      setIsDefault(template.is_default);
    } else {
      resetForm();
    }
  }, [template, open]);

  const resetForm = () => {
    setName('');
    setSubject('');
    setContent('');
    setCategory('general');
    setVariables([]);
    setNewVariable('');
    setIsDefault(false);
  };

  const handleAddVariable = () => {
    if (newVariable && !variables.includes(newVariable)) {
      setVariables([...variables, newVariable]);
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variable: string) => {
    setVariables(variables.filter(v => v !== variable));
  };

  const handleSave = async () => {
    if (!name || !subject || !content) return;

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
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? t("editTemplate") : t("createTemplate")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
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
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t("general")}</SelectItem>
                  <SelectItem value="welcome">{t("welcome")}</SelectItem>
                  <SelectItem value="follow-up">{t("followUp")}</SelectItem>
                  <SelectItem value="quote">{t("quote")}</SelectItem>
                  <SelectItem value="meeting">{t("meeting")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{t("emailSubject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("emailSubjectPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variables">{t("templateVariables")}</Label>
            <div className="flex gap-2">
              <Input
                id="variables"
                value={newVariable}
                onChange={(e) => setNewVariable(e.target.value)}
                placeholder={t("variablePlaceholder")}
              />
              <Button 
                type="button" 
                size="icon" 
                onClick={handleAddVariable}
                disabled={!newVariable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {variables.map(variable => (
                <Badge key={variable} variant="secondary" className="flex items-center gap-1">
                  {variable}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveVariable(variable)} 
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("emailContent")}</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={t("emailContentPlaceholder")}
              minHeight="300px"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isDefault" className="text-sm cursor-pointer">
              {t("setAsDefault")}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !name || !subject || !content}
          >
            {isSaving ? t("saving") : t("save")}
            {!isSaving && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
