
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { useAgents } from "@/hooks/agents/useAgents";
import { Loader2 } from "lucide-react";

interface FixedCommissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialData?: any;
}

const FixedCommissionDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialData
}: FixedCommissionDialogProps) => {
  const { t } = useLanguage();
  const { agents, isLoading: agentsLoading } = useAgents();
  
  // Define form schema
  const formSchema = z.object({
    agent_id: z.string().min(1, t("agentRequired")),
    rate: z.coerce.number()
      .min(0, t("rateMustBeNonNegative"))
      .max(100, t("rateCannotExceed100")),
    effective_from: z.date(),
    effective_to: z.date().optional()
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      agent_id: initialData.agent_id,
      rate: initialData.rate,
      effective_from: new Date(initialData.effective_from),
      effective_to: initialData.effective_to ? new Date(initialData.effective_to) : undefined
    } : {
      agent_id: "",
      rate: 0,
      effective_from: new Date(),
      effective_to: undefined
    }
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editFixedCommission") : t("addFixedCommission")}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="agent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("agent")}</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={agentsLoading || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectAgent")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents?.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
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
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("commissionRate")} (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="100"
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="effective_from"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("effectiveFrom")}</FormLabel>
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    disabled={isSubmitting}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="effective_to"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("effectiveTo")} ({t("optional")})</FormLabel>
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    disabled={isSubmitting}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("saving")}
                  </>
                ) : initialData ? t("update") : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FixedCommissionDialog;
