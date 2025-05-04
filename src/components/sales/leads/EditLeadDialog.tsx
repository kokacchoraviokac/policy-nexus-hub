
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadStatus, LeadSource } from "@/types/sales/leads";
import { useLeads } from "@/hooks/sales/useLeads";

interface EditLeadDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdated: () => void;
  onSave?: (updatedLead: Lead) => void; // Added to support existing code
}

// Form schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  company_name: z.string().optional(),
  email: z.string().email({ message: "Invalid email" }).optional().or(z.literal("")),
  phone: z.string().optional(),
  source: z.enum(["website", "referral", "social_media", "email", "phone", "event", "other"]).optional(),
  notes: z.string().optional(),
  assigned_to: z.string().optional(),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
});

type FormValues = z.infer<typeof formSchema>;

const EditLeadDialog: React.FC<EditLeadDialogProps> = ({
  lead,
  open,
  onOpenChange,
  onLeadUpdated,
  onSave,
}) => {
  const { t } = useLanguage();
  const { updateLead } = useLeads();
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: lead.name,
      company_name: lead.company_name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      source: lead.source || undefined,
      notes: lead.notes || "",
      assigned_to: lead.assigned_to || "",
      status: lead.status,
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    // In a real application, this would make an API call to update a lead
    const updatedLead = await updateLead(lead.id, values);
    
    if (updatedLead) {
      // Call callback functions
      onLeadUpdated();
      if (onSave) onSave(updatedLead);
      
      // Close dialog
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("editLead")}</DialogTitle>
          <DialogDescription>
            {t("editLeadDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("company")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterCompany")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t("enterEmail")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterPhone")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("source")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectSource")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">{t("website")}</SelectItem>
                        <SelectItem value="referral">{t("referral")}</SelectItem>
                        <SelectItem value="social_media">{t("socialMedia")}</SelectItem>
                        <SelectItem value="email">{t("emailMarketing")}</SelectItem>
                        <SelectItem value="phone">{t("phone")}</SelectItem>
                        <SelectItem value="event">{t("event")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assigned_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("responsiblePerson")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterResponsiblePerson")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="new">{t("newLeads")}</SelectItem>
                      <SelectItem value="contacted">{t("contactedLeads")}</SelectItem>
                      <SelectItem value="qualified">{t("qualifiedLeads")}</SelectItem>
                      <SelectItem value="converted">{t("convertedLeads")}</SelectItem>
                      <SelectItem value="lost">{t("lostLeads")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("enterNotes")} 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("saveLead")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadDialog;
