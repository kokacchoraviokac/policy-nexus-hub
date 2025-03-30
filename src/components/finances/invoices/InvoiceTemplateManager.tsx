
import React, { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceTemplateSettings } from "@/types/finances";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const templateSchema = z.object({
  name: z.string().min(1, { message: "Template name is required" }),
  is_default: z.boolean().default(false),
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color",
  }).optional(),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Must be a valid hex color",
  }).optional(),
  font_family: z.string().optional(),
  logo_position: z.enum(["left", "center", "right"]).default("left"),
  footer_text: z.string().optional(),
  header_text: z.string().optional(),
  show_payment_instructions: z.boolean().default(false),
  payment_instructions: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface InvoiceTemplateManagerProps {
  onTemplateChange?: (template: InvoiceTemplateSettings) => void;
}

const InvoiceTemplateManager: React.FC<InvoiceTemplateManagerProps> = ({ onTemplateChange }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [templates, setTemplates] = useState<InvoiceTemplateSettings[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<InvoiceTemplateSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      is_default: false,
      primary_color: "#296BFF",
      secondary_color: "#F5F7FA",
      font_family: "helvetica",
      logo_position: "left",
      footer_text: "",
      header_text: "",
      show_payment_instructions: false,
      payment_instructions: "",
    },
  });

  // Load templates when component mounts
  useEffect(() => {
    if (user?.companyId) {
      loadTemplates();
    }
  }, [user?.companyId]);

  // Load templates from the database
  const loadTemplates = async () => {
    if (!user?.companyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("invoice_templates")
        .select("*")
        .eq("company_id", user.companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setTemplates(data || []);
      
      // Set default template as current if available
      const defaultTemplate = data?.find(t => t.is_default);
      if (defaultTemplate) {
        setCurrentTemplate(defaultTemplate);
        if (onTemplateChange) {
          onTemplateChange(defaultTemplate);
        }
      }
    } catch (error) {
      console.error("Error loading invoice templates:", error);
      toast({
        title: t("errorLoadingTemplates"),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const selected = templates.find(t => t.id === templateId);
    if (selected) {
      setCurrentTemplate(selected);
      if (onTemplateChange) {
        onTemplateChange(selected);
      }
      
      // Set form values
      form.reset({
        name: selected.name,
        is_default: selected.is_default,
        primary_color: selected.primary_color || "#296BFF",
        secondary_color: selected.secondary_color || "#F5F7FA",
        font_family: selected.font_family || "helvetica",
        logo_position: (selected.logo_position as "left" | "center" | "right") || "left",
        footer_text: selected.footer_text || "",
        header_text: selected.header_text || "",
        show_payment_instructions: selected.show_payment_instructions || false,
        payment_instructions: selected.payment_instructions || "",
      });
    }
  };

  // Handle form submission for creating a new template
  const onSubmit = async (values: TemplateFormValues) => {
    if (!user?.companyId) return;
    
    setIsSaving(true);
    try {
      // If setting this template as default, update all other templates
      if (values.is_default) {
        await supabase
          .from("invoice_templates")
          .update({ is_default: false })
          .eq("company_id", user.companyId);
      }
      
      // Create new template
      const { data, error } = await supabase
        .from("invoice_templates")
        .insert({
          ...values,
          company_id: user.companyId,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: t("templateCreated"),
        description: t("templateCreatedSuccessfully"),
      });
      
      // Close dialog and refresh templates
      setIsDialogOpen(false);
      loadTemplates();
      
      // Set as current template if it's the default
      if (values.is_default && data) {
        setCurrentTemplate(data);
        if (onTemplateChange) {
          onTemplateChange(data);
        }
      }
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: t("errorCreatingTemplate"),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle updating an existing template
  const handleUpdateTemplate = async () => {
    if (!user?.companyId || !currentTemplate) return;
    
    const values = form.getValues();
    setIsSaving(true);
    
    try {
      // If setting this template as default, update all other templates
      if (values.is_default && !currentTemplate.is_default) {
        await supabase
          .from("invoice_templates")
          .update({ is_default: false })
          .eq("company_id", user.companyId);
      }
      
      // Update current template
      const { data, error } = await supabase
        .from("invoice_templates")
        .update(values)
        .eq("id", currentTemplate.id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: t("templateUpdated"),
        description: t("templateUpdatedSuccessfully"),
      });
      
      // Refresh templates
      loadTemplates();
      
      // Update current template
      if (data) {
        setCurrentTemplate(data);
        if (onTemplateChange) {
          onTemplateChange(data);
        }
      }
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: t("errorUpdatingTemplate"),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle deleting a template
  const handleDeleteTemplate = async () => {
    if (!user?.companyId || !currentTemplate) return;
    
    if (currentTemplate.is_default) {
      toast({
        title: t("cannotDeleteDefault"),
        description: t("cannotDeleteDefaultTemplate"),
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm(t("confirmDeleteTemplate"))) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("invoice_templates")
        .delete()
        .eq("id", currentTemplate.id);

      if (error) throw error;
      
      toast({
        title: t("templateDeleted"),
        description: t("templateDeletedSuccessfully"),
      });
      
      // Refresh templates and reset current
      loadTemplates();
      setCurrentTemplate(null);
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: t("errorDeletingTemplate"),
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form when creating a new template
  const handleCreateNew = () => {
    form.reset({
      name: "",
      is_default: false,
      primary_color: "#296BFF",
      secondary_color: "#F5F7FA",
      font_family: "helvetica",
      logo_position: "left",
      footer_text: "",
      header_text: "",
      show_payment_instructions: false,
      payment_instructions: "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t("invoiceTemplates")}</h2>
        <Button size="sm" onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("newTemplate")}
        </Button>
      </div>

      {templates.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="pt-6 pb-4 text-center">
            <p className="text-muted-foreground">{t("noTemplatesFound")}</p>
            <Button variant="outline" className="mt-4" onClick={handleCreateNew}>
              {t("createFirstTemplate")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("availableTemplates")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <p>{t("loading")}</p>
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto space-y-1">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                          currentTemplate?.id === template.id
                            ? "bg-primary/10 font-medium"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: template.primary_color || "#296BFF",
                            }}
                          />
                          <span>{template.name}</span>
                        </div>
                        {template.is_default && (
                          <Badge variant="outline">{t("default")}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            {currentTemplate ? (
              <Card>
                <CardHeader>
                  <CardTitle>{t("templateSettings")}</CardTitle>
                  <CardDescription>{t("editTemplateDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("templateName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="font_family"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("fontFamily")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("selectFont")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="helvetica">Helvetica</SelectItem>
                                <SelectItem value="times">Times New Roman</SelectItem>
                                <SelectItem value="courier">Courier</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="primary_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("primaryColor")}</FormLabel>
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Input {...field} type="color" className="w-10 h-10 p-1" />
                              </FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondary_color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("secondaryColor")}</FormLabel>
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Input {...field} type="color" className="w-10 h-10 p-1" />
                              </FormControl>
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                className="flex-1"
                              />
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="logo_position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("logoPosition")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("selectPosition")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="left">{t("left")}</SelectItem>
                                <SelectItem value="center">{t("center")}</SelectItem>
                                <SelectItem value="right">{t("right")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="header_text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("headerText")}</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="footer_text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("footerText")}</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="show_payment_instructions"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>{t("showPaymentInstructions")}</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("show_payment_instructions") && (
                        <div className="sm:col-span-2">
                          <FormField
                            control={form.control}
                            name="payment_instructions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("paymentInstructions")}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="is_default"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>{t("setAsDefault")}</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={currentTemplate?.is_default}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleDeleteTemplate}
                    disabled={isSaving || currentTemplate.is_default}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("delete")}
                  </Button>
                  <Button onClick={handleUpdateTemplate} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? t("saving") : t("saveChanges")}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 pb-4 text-center">
                  <p className="text-muted-foreground">
                    {t("selectTemplateOrCreateNew")}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("createNewTemplate")}</DialogTitle>
            <DialogDescription>
              {t("createNewTemplateDescription")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("templateName")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("templateNamePlaceholder")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primary_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("primaryColor")}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input {...field} type="color" className="w-10 h-10 p-1" />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="font_family"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fontFamily")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectFont")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="helvetica">Helvetica</SelectItem>
                          <SelectItem value="times">Times New Roman</SelectItem>
                          <SelectItem value="courier">Courier</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{t("setAsDefault")}</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? t("creating") : t("createTemplate")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceTemplateManager;
