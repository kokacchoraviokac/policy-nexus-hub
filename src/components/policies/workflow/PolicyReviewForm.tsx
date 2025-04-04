
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parseISO } from "date-fns";
import { Policy } from "@/types/policies";
import { Loader2, Save } from "lucide-react";

// Schema for policy review form
const policyReviewSchema = z.object({
  id: z.string().optional(),
  policy_number: z.string().min(1, "Policy number is required"),
  policy_type: z.string().min(1, "Policy type is required"),
  start_date: z.string().min(1, "Start date is required"),
  expiry_date: z.string().min(1, "Expiry date is required"),
  premium: z.number().positive("Premium must be positive"),
  currency: z.string().min(1, "Currency is required"),
  insurer_name: z.string().min(1, "Insurer name is required"),
  policyholder_name: z.string().min(1, "Policyholder name is required"),
  insured_name: z.string().optional(),
  product_name: z.string().optional(),
  product_id: z.string().optional(), // Use product_id instead of product_code
  notes: z.string().optional()
});

type FormValues = z.infer<typeof policyReviewSchema>;

interface PolicyReviewFormProps {
  policy: Partial<Policy>;
  isSubmitting: boolean;
  onSubmit: (data: FormValues) => void;
}

const PolicyReviewForm: React.FC<PolicyReviewFormProps> = ({
  policy,
  isSubmitting,
  onSubmit
}) => {
  const { t } = useLanguage();
  
  const defaultValues = {
    ...policy,
    product_id: policy.product_id || "",
    currency: policy.currency || "EUR"
  };
  
  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors } 
  } = useForm<FormValues>({
    resolver: zodResolver(policyReviewSchema),
    defaultValues
  });
  
  const onFormSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("editPolicy")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="policy_number">{t("policyNumber")}</Label>
              <Input
                id="policy_number"
                {...register("policy_number")}
                error={errors.policy_number?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policy_type">{t("policyType")}</Label>
              <Input
                id="policy_type"
                {...register("policy_type")}
                error={errors.policy_type?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insurer_name">{t("insurerName")}</Label>
              <Input
                id="insurer_name"
                {...register("insurer_name")}
                error={errors.insurer_name?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policyholder_name">{t("policyholderName")}</Label>
              <Input
                id="policyholder_name"
                {...register("policyholder_name")}
                error={errors.policyholder_name?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insured_name">{t("insuredName")}</Label>
              <Input
                id="insured_name"
                {...register("insured_name")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product_name">{t("productName")}</Label>
              <Input
                id="product_name"
                {...register("product_name")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product_id">{t("productId")}</Label>
              <Input
                id="product_id"
                {...register("product_id")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="premium">{t("premium")}</Label>
              <Input
                id="premium"
                type="number"
                step="0.01"
                {...register("premium", { valueAsNumber: true })}
                error={errors.premium?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">{t("currency")}</Label>
              <Input
                id="currency"
                {...register("currency")}
                error={errors.currency?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start_date">{t("startDate")}</Label>
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    error={errors.start_date?.message}
                  />
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry_date">{t("expiryDate")}</Label>
              <Controller
                control={control}
                name="expiry_date"
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? parseISO(field.value) : undefined}
                    onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    error={errors.expiry_date?.message}
                  />
                )}
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Input
                id="notes"
                {...register("notes")}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("saving")}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t("saveChanges")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PolicyReviewForm;
