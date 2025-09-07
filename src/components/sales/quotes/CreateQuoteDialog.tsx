import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInsurers } from "@/hooks/useInsurers";
import { CreateQuoteRequest, Quote } from "@/types/sales/quotes";

interface CreateQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesProcessId: string;
  onQuoteCreated: (quote: Quote) => void;
}

const formSchema = z.object({
  insurer_id: z.string().min(1, { message: "Insurer is required" }),
  coverage_details: z.string().min(1, { message: "Coverage details are required" }),
  premium_amount: z.number().positive({ message: "Premium must be positive" }),
  currency: z.string().default("EUR"),
  validity_period_days: z.number().min(1, { message: "Validity period is required" }),
  special_conditions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateQuoteDialog: React.FC<CreateQuoteDialogProps> = ({
  open,
  onOpenChange,
  salesProcessId,
  onQuoteCreated,
}) => {
  const { t } = useLanguage();
  const { insurers = [] } = useInsurers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "EUR",
      validity_period_days: 30,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const selectedInsurer = insurers.find(ins => ins.id === values.insurer_id);

    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      sales_process_id: salesProcessId,
      insurer_id: values.insurer_id,
      insurer_name: selectedInsurer?.name || "Unknown Insurer",
      coverage_details: values.coverage_details,
      premium_amount: values.premium_amount,
      currency: values.currency,
      validity_period_days: values.validity_period_days,
      special_conditions: values.special_conditions,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // In a real application, this would make an API call
    console.log("Creating quote:", newQuote);

    onQuoteCreated(newQuote);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("createQuote")}</DialogTitle>
          <DialogDescription>
            {t("createQuoteForInsurer")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="insurer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("insurer")}*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectInsurer")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {insurers.filter(insurer => insurer.is_active).map((insurer) => (
                        <SelectItem key={insurer.id} value={insurer.id}>
                          {insurer.name}
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
              name="coverage_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("coverageDetails")}*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("describeCoverage")}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="premium_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("premiumAmount")}*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("currency")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="RSD">RSD (РСД)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="validity_period_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("validityPeriodDays")}*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value) || 30)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="special_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("specialConditions")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("enterSpecialConditions")}
                      className="min-h-[60px]"
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
              <Button type="submit">{t("createQuote")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;