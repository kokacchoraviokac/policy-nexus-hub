
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
import { Agent } from "@/hooks/agents/useAgents";

interface AgentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Agent, 'id' | 'status'>) => void;
  isSubmitting: boolean;
  initialData?: Agent | null;
}

const AgentFormDialog: React.FC<AgentFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}) => {
  const { t } = useLanguage();

  // Create form schema
  const formSchema = z.object({
    name: z.string().min(1, t("nameRequired")),
    email: z.string().email(t("invalidEmail")).optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    tax_id: z.string().optional().or(z.literal("")),
    bank_account: z.string().optional().or(z.literal("")),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      tax_id: initialData?.tax_id || "",
      bank_account: initialData?.bank_account || "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("editAgent") : t("addAgent")}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? t("editAgentDescription")
              : t("addAgentDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("enterName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("enterEmail")} type="email" />
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
                    <Input {...field} placeholder={t("enterPhone")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("taxId")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("enterTaxId")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank_account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("bankAccount")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("enterBankAccount")} />
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
                {isSubmitting ? t("saving") : initialData ? t("update") : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentFormDialog;
