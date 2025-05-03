
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSalesProcesses } from "@/hooks/sales/useSalesProcesses";
import { CreateSalesProcessRequest } from "@/types/sales/salesProcesses";

interface CreateSalesProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSalesProcessCreated?: (process: any) => void;
  leadId?: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  client_name: z.string().min(1, { message: "Client name is required" }),
  company: z.string().optional(),
  insurance_type: z.string().min(1, { message: "Insurance type is required" }),
  estimated_value: z.coerce.number().optional(),
  expected_close_date: z.string().optional(),
  notes: z.string().optional(),
});

const CreateSalesProcessDialog: React.FC<CreateSalesProcessDialogProps> = ({
  open,
  onOpenChange,
  onSalesProcessCreated,
  leadId,
}) => {
  const { t } = useLanguage();
  const { createSalesProcess } = useSalesProcesses();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      client_name: "",
      company: "",
      insurance_type: "",
      estimated_value: undefined,
      expected_close_date: "",
      notes: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Filter out empty strings to convert them to undefined
    const processData: CreateSalesProcessRequest = {
      ...Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "")
      ),
      ...(leadId ? { lead_id: leadId } : {}),
    } as CreateSalesProcessRequest;
    
    const process = await createSalesProcess(processData);
    
    if (process && onSalesProcessCreated) {
      onSalesProcessCreated(process);
      form.reset();
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t("newSalesProcess")}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("processTitle")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterTitle")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("clientName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterClientName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("companyName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterCompanyName")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="insurance_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("insuranceType")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("enterInsuranceType")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimated_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("estimatedValue")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder={t("enterEstimatedValue")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expected_close_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("expectedCloseDate")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("enterNotes")}
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">
                {t("createProcess")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalesProcessDialog;
