
import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAgents } from "@/hooks/agents/useAgents";
import { usePoliciesSearch } from "@/hooks/usePoliciesSearch";
import { Loader2 } from "lucide-react";

interface ManualCommissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialData?: any;
}

const ManualCommissionDialog = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialData
}: ManualCommissionDialogProps) => {
  const { t } = useLanguage();
  const { agents, isLoading: agentsLoading } = useAgents();
  const { policies, searchPolicies, isSearching } = usePoliciesSearch();
  
  // Define form schema
  const formSchema = z.object({
    agent_id: z.string().min(1, t("agentRequired")),
    policy_id: z.string().min(1, t("policyRequired")),
    rate: z.coerce.number()
      .min(0, t("rateMustBeNonNegative"))
      .max(100, t("rateCannotExceed100")),
    justification: z.string().min(1, t("justificationRequired"))
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      agent_id: initialData.agent_id,
      policy_id: initialData.policy_id,
      rate: initialData.rate,
      justification: initialData.justification
    } : {
      agent_id: "",
      policy_id: "",
      rate: 0,
      justification: ""
    }
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  useEffect(() => {
    // Search policies when dialog opens
    if (open) {
      searchPolicies("");
    }
  }, [open, searchPolicies]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editManualCommission") : t("addManualCommission")}
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
              name="policy_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("policy")}</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={isSearching || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectPolicy")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {policies?.map(policy => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy.policy_number} - {policy.policyholder_name}
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
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("justification")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("explainWhyManualCommission")}
                      disabled={isSubmitting}
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

export default ManualCommissionDialog;
