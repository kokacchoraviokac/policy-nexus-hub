
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format, parseISO } from "date-fns";

const policySchema = z.object({
  policy_number: z.string().min(1, "Policy number is required"),
  insurer_name: z.string().min(1, "Insurer name is required"),
  policyholder_name: z.string().min(1, "Policyholder name is required"),
  start_date: z.string().min(1, "Start date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  premium: z.number().positive("Premium must be positive"),
  currency: z.string().min(1, "Currency is required")
});

interface PolicyDetailsFormProps {
  defaultValues?: {
    policy_number?: string;
    start_date?: string;
    expiry_date?: string;
    premium?: number;
    currency?: string;
    insurer_name?: string;
    policyholder_name?: string;
  };
  isSubmitting?: boolean;
  onSubmit: (data: z.infer<typeof policySchema>) => void;
  readOnly?: boolean;
}

const PolicyDetailsForm: React.FC<PolicyDetailsFormProps> = ({
  defaultValues = {},
  isSubmitting = false,
  onSubmit,
  readOnly = false
}) => {
  const { t } = useLanguage();

  const form = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      policy_number: "",
      start_date: "",
      expiry_date: "",
      premium: undefined,
      currency: "EUR",
      insurer_name: "",
      policyholder_name: "",
      ...defaultValues
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = form;

  const handleFormSubmit = (data: z.infer<typeof policySchema>) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <div>
              <Label htmlFor="policy_number">{t("policyNumber")}</Label>
              <Input
                id="policy_number"
                {...register("policy_number")}
                disabled={readOnly}
                className={errors.policy_number ? "border-red-500" : ""}
              />
              {errors.policy_number && (
                <p className="text-red-500 text-sm mt-1">{errors.policy_number.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="insurer_name">{t("insurerName")}</Label>
              <Input
                id="insurer_name"
                {...register("insurer_name")}
                disabled={readOnly}
                className={errors.insurer_name ? "border-red-500" : ""}
              />
              {errors.insurer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.insurer_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="policyholder_name">{t("policyholderName")}</Label>
              <Input
                id="policyholder_name"
                {...register("policyholder_name")}
                disabled={readOnly}
                className={errors.policyholder_name ? "border-red-500" : ""}
              />
              {errors.policyholder_name && (
                <p className="text-red-500 text-sm mt-1">{errors.policyholder_name.message}</p>
              )}
            </div>

            <div>
              <Label>{t("startDate")}</Label>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }
                    disabled={readOnly}
                  />
                )}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <Label>{t("expiryDate")}</Label>
              <Controller
                name="expiry_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }
                    disabled={readOnly}
                  />
                )}
              />
              {errors.expiry_date && (
                <p className="text-red-500 text-sm mt-1">{errors.expiry_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="premium">{t("premium")}</Label>
              <Input
                id="premium"
                type="number"
                step="0.01"
                {...register("premium", { valueAsNumber: true })}
                disabled={readOnly}
                className={errors.premium ? "border-red-500" : ""}
              />
              {errors.premium && (
                <p className="text-red-500 text-sm mt-1">{errors.premium.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">{t("currency")}</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                    disabled={readOnly}
                  >
                    <SelectTrigger className={errors.currency ? "border-red-500" : ""}>
                      <SelectValue placeholder={t("selectCurrency")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="RSD">RSD</SelectItem>
                      <SelectItem value="MKD">MKD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
              )}
            </div>
          </div>

          {!readOnly && (
            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("savePolicy")}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PolicyDetailsForm;
