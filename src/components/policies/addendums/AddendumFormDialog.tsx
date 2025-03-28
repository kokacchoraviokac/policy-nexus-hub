
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AddendumFormDialogProps {
  policyId: string;
  policyNumber: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const addendumSchema = z.object({
  addendum_number: z.string().min(1, { message: "Addendum number is required" }),
  effective_date: z.date({ required_error: "Effective date is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  premium_adjustment: z.coerce.number().optional(),
  lien_status: z.boolean().default(false),
  status: z.string().default("pending"),
  workflow_status: z.string().default("draft"),
});

type AddendumFormValues = z.infer<typeof addendumSchema>;

const AddendumFormDialog: React.FC<AddendumFormDialogProps> = ({
  policyId,
  policyNumber,
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<AddendumFormValues>({
    resolver: zodResolver(addendumSchema),
    defaultValues: {
      addendum_number: `${policyNumber}-A`,
      status: "pending",
      workflow_status: "draft",
      lien_status: false,
    },
  });
  
  const createAddendumMutation = useMutation({
    mutationFn: async (data: AddendumFormValues) => {
      // Format the date for Supabase
      const effectiveDate = data.effective_date.toISOString().split('T')[0];
      
      // Prepare addendum data with correctly typed fields
      const addendumData = {
        policy_id: policyId,
        addendum_number: data.addendum_number,
        effective_date: effectiveDate,
        description: data.description,
        premium_adjustment: data.premium_adjustment,
        lien_status: data.lien_status,
        status: data.status,
        workflow_status: data.workflow_status,
        company_id: user?.companyId,
        created_by: user?.id,
      };

      const { data: addendum, error } = await supabase
        .from("policy_addendums")
        .insert(addendumData)
        .select("id")
        .single();

      if (error) throw error;
      return addendum;
    },
    onSuccess: () => {
      toast({
        title: t("addendumCreated"),
        description: t("addendumCreatedSuccess"),
      });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating addendum:", error);
      toast({
        title: t("addendumCreateError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: AddendumFormValues) => {
    createAddendumMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("createAddendum")}</DialogTitle>
          <DialogDescription>
            {t("createAddendumDescription", { policyNumber })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="addendum_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("addendumNumber")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterAddendumNumber")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="effective_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("effectiveDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("selectDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("enterDescription")} 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="premium_adjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("premiumAdjustment")}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                        <SelectItem value="pending">{t("pending")}</SelectItem>
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="rejected">{t("rejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="lien_status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("lienStatus")}
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {t("lienStatusDescription")}
                    </div>
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
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={createAddendumMutation.isPending}>
                {createAddendumMutation.isPending ? t("creating") : t("createAddendum")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddendumFormDialog;
