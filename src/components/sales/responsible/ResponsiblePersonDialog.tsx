
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data - in a real app, this would come from API
const mockEmployees = [
  { id: "1", name: "John Doe", role: "Sales Manager", team: "Direct Sales" },
  { id: "2", name: "Jane Smith", role: "Account Executive", team: "Corporate" },
  { id: "3", name: "Mike Johnson", role: "Sales Representative", team: "Direct Sales" },
  { id: "4", name: "Sarah Williams", role: "Sales Representative", team: "Corporate" },
  { id: "5", name: "Alex Thompson", role: "Account Manager", team: "SMB" },
  { id: "6", name: "Lisa Garcia", role: "Sales Director", team: "Enterprise" },
];

const mockLeads = [
  { id: "1", name: "Acme Corporation", type: "Lead", status: "New" },
  { id: "2", name: "Global Industries", type: "Lead", status: "Qualified" },
  { id: "3", name: "Summit Partners", type: "Sales Process", status: "Quote" },
  { id: "4", name: "Pinnacle Solutions", type: "Sales Process", status: "Negotiation" },
];

const formSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee",
  }),
  leadId: z.string({
    required_error: "Please select a lead or sales process",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface ResponsibleAssignment {
  id?: string;
  employeeId: string;
  employeeName?: string;
  leadId: string;
  leadName?: string;
  assignedAt?: string;
  notes?: string;
}

interface ResponsiblePersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign?: (data: FormValues) => void;
  existingAssignment?: ResponsibleAssignment | null;
  title?: string;
  description?: string;
}

const ResponsiblePersonDialog: React.FC<ResponsiblePersonDialogProps> = ({
  open,
  onOpenChange,
  onAssign,
  existingAssignment = null,
  title,
  description,
}) => {
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      leadId: "",
      notes: "",
    },
  });

  // Pre-populate form when editing existing assignment
  useEffect(() => {
    if (existingAssignment) {
      form.reset({
        employeeId: existingAssignment.employeeId || "",
        leadId: existingAssignment.leadId || "",
        notes: existingAssignment.notes || "",
      });
    } else {
      form.reset({
        employeeId: "",
        leadId: "",
        notes: "",
      });
    }
  }, [existingAssignment, form, open]);

  const handleSubmit = (data: FormValues) => {
    // Find the selected employee and lead for the toast message
    const employee = mockEmployees.find(e => e.id === data.employeeId);
    const lead = mockLeads.find(l => l.id === data.leadId);
    
    if (employee && lead) {
      if (existingAssignment) {
        toast.success(
          t("responsibilityReassigned", {
            employee: employee.name,
            lead: lead.name,
          }),
          {
            description: t("responsibilityReassignedDescription"),
          }
        );
        
        // In a real app, this would also record the historical assignment data
        console.log("Previous assignment:", existingAssignment);
        console.log("New assignment:", {
          ...existingAssignment,
          employeeId: data.employeeId,
          leadId: data.leadId,
          notes: data.notes,
          updatedAt: new Date().toISOString(),
        });
      } else {
        toast.success(
          t("responsibilityAssigned", {
            employee: employee.name,
            lead: lead.name,
          }),
          {
            description: t("responsibilityAssignedDescription"),
          }
        );
      }
    }
    
    if (onAssign) {
      onAssign(data);
    }
    
    form.reset();
    onOpenChange(false);
  };

  const dialogTitle = title || (existingAssignment ? t("editAssignment") : t("assignResponsibility"));
  const dialogDescription = description || (existingAssignment 
    ? t("editAssignmentDescription") 
    : t("assignResponsibilityDescription"));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("selectEmployee")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectEmployee")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role} ({employee.team})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("selectLeadOrProcess")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectLeadOrProcess")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.type} ({lead.status})
                        </SelectItem>
                      ))}
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
                    <textarea 
                      className="w-full min-h-[80px] px-3 py-2 border rounded-md resize-none"
                      placeholder={t("optionalNotes")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">
                {existingAssignment ? t("update") : t("assign")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiblePersonDialog;
