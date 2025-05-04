
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useCommunications } from '@/hooks/useCommunications';
import { Template } from '@/types/sales/templates';
import EditTemplateDialog from './EditTemplateDialog';
import RichTextEditor from '../editor/RichTextEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const EmailTemplateManager = () => {
  const { t } = useLanguage();
  const { templates, fetchTemplates, deleteTemplate, createTemplate, updateTemplate } = useCommunications();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    await fetchTemplates();
    setIsLoading(false);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = 
      searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setShowEditDialog(true);
  };

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedTemplate) {
      await deleteTemplate(selectedTemplate.id);
      setShowDeleteDialog(false);
      setSelectedTemplate(null);
    }
  };

  const uniqueCategories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("emailTemplates")}</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createTemplate")}
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder={t("searchTemplates")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {uniqueCategories.map(category => (
              <SelectItem key={category} value={category}>
                {t(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t("noTemplatesFound")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-md">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{template.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(template)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t("subject")}: {template.subject}</p>
                  <div className="text-sm text-muted-foreground">
                    {t("variables")}: {template.variables.join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create/Edit Template Dialog */}
      <EditTemplateDialog
        open={showCreateDialog || showEditDialog}
        onOpenChange={(open) => {
          if (showCreateDialog) setShowCreateDialog(open);
          if (showEditDialog) {
            setShowEditDialog(open);
            if (!open) setSelectedTemplate(null);
          }
        }}
        template={selectedTemplate}
        onSave={async (data) => {
          if (selectedTemplate) {
            await updateTemplate(selectedTemplate.id, data as Partial<Template>);
          } else {
            await createTemplate(data as Required<Omit<Template, "id" | "created_at" | "updated_at">>);
          }
          setShowCreateDialog(false);
          setShowEditDialog(false);
          setSelectedTemplate(null);
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmDeleteTemplate")}</DialogTitle>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("deleteTemplateWarning")}
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplateManager;
