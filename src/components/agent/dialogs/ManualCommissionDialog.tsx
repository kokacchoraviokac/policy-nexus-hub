
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAgents } from "@/hooks/agents/useAgents";
import { usePolicies } from "@/hooks/usePolicies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManualCommissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  initialData?: any;
}

const ManualCommissionDialog: React.FC<ManualCommissionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}) => {
  const { t } = useLanguage();
  const { agents } = useAgents();
  const { policies } = usePolicies();

  const formSchema = z.object({
    agent_id: z.string().min(1, t("agentRequired")),
    policy_id: z.string().min(1, t("policyRequired")),
    rate: z
      .number()
      .min(0, t("rateMustBeNonNegative"))
      .max(100, t("rateCannotExceed100")),
    justification: z.string().min(1, t("justificationRequired")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_id: initialData?.agent_id || "",
      policy_id: initialData?.policy_id || "",
      rate: initialData?.rate || 0,
      justification: initialData?.justification || "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("editManualCommission")
              : t("addManualCommission")}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? t("editManualCommissionDescription")
              : t("addManualCommissionDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="agent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("agent")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectAgent")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agents.map((agent) => (
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectPolicy")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {policies.map((policy) => (
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
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
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose} type="button">
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("saving")
                  : initialData
                  ? t("update")
                  : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualCommissionDialog;
