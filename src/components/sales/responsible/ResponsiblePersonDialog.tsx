
import React from "react";
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
  { id: "1", name: "John Doe", role: "Sales Manager" },
  { id: "2", name: "Jane Smith", role: "Account Executive" },
  { id: "3", name: "Mike Johnson", role: "Sales Representative" },
  { id: "4", name: "Sarah Williams", role: "Sales Representative" },
];

const mockLeads = [
  { id: "1", name: "Acme Corporation", type: "Lead" },
  { id: "2", name: "Global Industries", type: "Lead" },
  { id: "3", name: "Summit Partners", type: "Sales Process" },
  { id: "4", name: "Pinnacle Solutions", type: "Sales Process" },
];

const formSchema = z.object({
  employeeId: z.string({
    required_error: "Please select an employee",
  }),
  leadId: z.string({
    required_error: "Please select a lead or sales process",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface ResponsiblePersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign?: (data: FormValues) => void;
}

const ResponsiblePersonDialog: React.FC<ResponsiblePersonDialogProps> = ({
  open,
  onOpenChange,
  onAssign,
}) => {
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      leadId: "",
    },
  });

  const handleSubmit = (data: FormValues) => {
    // In a real app, this would call an API to save the assignment
    console.log("Assignment data:", data);
    
    // Find the selected employee and lead for the toast message
    const employee = mockEmployees.find(e => e.id === data.employeeId);
    const lead = mockLeads.find(l => l.id === data.leadId);
    
    if (employee && lead) {
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
    
    if (onAssign) {
      onAssign(data);
    }
    
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("assignResponsibility")}</DialogTitle>
          <DialogDescription>
            {t("assignResponsibilityDescription")}
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectEmployee")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectLeadOrProcess")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockLeads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("cancel")}
              </Button>
              <Button type="submit">{t("assign")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiblePersonDialog;
