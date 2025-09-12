import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  Search, 
  Mail, 
  Eye, 
  Copy,
  Star,
  StarOff,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import { useEmailTemplates } from "@/hooks/useEmailTemplates";
import {
  EmailTemplateWithVariables,
  EMAIL_TEMPLATE_CATEGORIES,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest
} from "@/types/email-templates";
import EmailTemplateEditor from "@/components/settings/email-templates/EmailTemplateEditor";
import EmailTemplatePreview from "@/components/settings/email-templates/EmailTemplatePreview";

const EmailTemplatesPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [defaultFilter, setDefaultFilter] = useState("all");
  const [editorDialog, setEditorDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplateWithVariables | null>(null);
  const [previewingTemplate, setPreviewingTemplate] = useState<EmailTemplateWithVariables | null>(null);

  const {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    setAsDefault,
    isCreating,
    isUpdating,
    isDeleting,
    isDuplicating,
    isSettingDefault
  } = useEmailTemplates({
    search: searchTerm || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    is_default: defaultFilter === "default" ? true : defaultFilter === "custom" ? false : undefined
  });

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setEditorDialog(true);
  };

  const handleEditTemplate = (template: EmailTemplateWithVariables) => {
    setEditingTemplate(template);
    setEditorDialog(true);
  };

  const handlePreviewTemplate = (template: EmailTemplateWithVariables) => {
    setPreviewingTemplate(template);
    setPreviewDialog(true);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    duplicateTemplate(templateId);
  };

  const handleSetAsDefault = (templateId: string, category: string) => {
    setAsDefault({ templateId, category });
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = EMAIL_TEMPLATE_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    
    const matchesDefault = defaultFilter === "all" || 
      (defaultFilter === "default" && template.is_default) ||
      (defaultFilter === "custom" && !template.is_default);
    
    return matchesSearch && matchesCategory && matchesDefault;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SettingsHeader 
        title={t("emailTemplates")}
        description={t("emailTemplatesDescription")}
      />

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t("manageEmailTemplates")}
            </CardTitle>
            <Button onClick={handleCreateTemplate} disabled={isCreating}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("createTemplate")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("searchTemplates")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t("filterByCategory")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                {EMAIL_TEMPLATE_CATEGORIES.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={defaultFilter} onValueChange={setDefaultFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder={t("filterByType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allTypes")}</SelectItem>
                <SelectItem value="default">{t("defaultTemplates")}</SelectItem>
                <SelectItem value="custom">{t("customTemplates")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Table */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("noTemplatesFound")}</h3>
              <p className="text-muted-foreground mb-4">{t("noTemplatesDescription")}</p>
              <Button onClick={handleCreateTemplate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("createFirstTemplate")}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("subject")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("createdAt")}</TableHead>
                    <TableHead className="w-[200px]">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {template.name}
                          {template.is_default && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {template.subject}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={template.is_default ? "default" : "secondary"}>
                          {template.is_default ? t("default") : t("custom")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {new Date(template.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreviewTemplate(template)}
                            title={t("previewTemplate")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                            title={t("editTemplate")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template.id)}
                            disabled={isDuplicating}
                            title={t("duplicateTemplate")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          
                          {!template.is_default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetAsDefault(template.id, template.category)}
                              disabled={isSettingDefault}
                              title={t("setAsDefault")}
                            >
                              <StarOff className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                title={t("deleteTemplate")}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("deleteTemplate")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("deleteTemplateConfirmation", { name: template.name })}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  disabled={isDeleting}
                                >
                                  {t("delete")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Editor Dialog */}
      <Dialog open={editorDialog} onOpenChange={setEditorDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? t("editTemplate") : t("createTemplate")}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? t("editTemplateDescription") 
                : t("createTemplateDescription")
              }
            </DialogDescription>
          </DialogHeader>
          
          <EmailTemplateEditor
            template={editingTemplate}
            onSave={(templateData) => {
              if (editingTemplate) {
                updateTemplate({ id: editingTemplate.id, updates: templateData as UpdateEmailTemplateRequest });
              } else {
                createTemplate(templateData as CreateEmailTemplateRequest);
              }
              setEditorDialog(false);
            }}
            onCancel={() => setEditorDialog(false)}
            isLoading={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {t("previewTemplate")}
            </DialogTitle>
            <DialogDescription>
              {previewingTemplate?.name} - {getCategoryLabel(previewingTemplate?.category || "")}
            </DialogDescription>
          </DialogHeader>
          
          {previewingTemplate && (
            <EmailTemplatePreview
              template={previewingTemplate}
              onClose={() => setPreviewDialog(false)}
              onEdit={() => {
                setPreviewDialog(false);
                handleEditTemplate(previewingTemplate);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailTemplatesPage;