
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Policy } from "@/types/policies";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PolicyReviewFormProps {
  policy: Policy;
  onSave: (data: Partial<Policy>) => void;
  isProcessing: boolean;
}

const policyReviewFormSchema = z.object({
  policyholder_name: z.string().min(1, { message: "Policyholder name is required" }),
  insured_name: z.string().min(1, { message: "Insured name is required" }),
  policy_type: z.string().min(1, { message: "Policy type is required" }),
  insurer_name: z.string().min(1, { message: "Insurer name is required" }),
  product_name: z.string().optional(),
  premium: z.coerce.number().positive({ message: "Premium must be a positive number" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  payment_frequency: z.string().optional(),
  commission_type: z.string().optional(),
  commission_percentage: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

type PolicyReviewFormValues = z.infer<typeof policyReviewFormSchema>;

const PolicyReviewForm: React.FC<PolicyReviewFormProps> = ({
  policy,
  onSave,
  isProcessing,
}) => {
  const { t } = useLanguage();
  
  // Fetch insurers for dropdown
  const { data: insurers = [] } = useQuery({
    queryKey: ["insurers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurers")
        .select("id, name")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });
  
  // Initialize form
  const form = useForm<PolicyReviewFormValues>({
    resolver: zodResolver(policyReviewFormSchema),
    defaultValues: {
      policyholder_name: policy.policyholder_name || "",
      insured_name: policy.insured_name || policy.policyholder_name || "",
      policy_type: policy.policy_type || "Standard",
      insurer_name: policy.insurer_name || "",
      product_name: policy.product_name || "",
      premium: policy.premium || 0,
      currency: policy.currency || "EUR",
      payment_frequency: policy.payment_frequency || "annual",
      commission_type: policy.commission_type || "automatic",
      commission_percentage: policy.commission_percentage || 0,
      notes: policy.notes || "",
    },
  });
  
  const onSubmit = (data: PolicyReviewFormValues) => {
    // Calculate commission amount if percentage is provided
    let commission_amount = undefined;
    if (data.commission_percentage) {
      commission_amount = (data.premium * data.commission_percentage) / 100;
    }
    
    onSave({
      ...data,
      commission_amount,
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="policy_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("policyType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectPolicyType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="insurer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("insurer")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectInsurer")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {insurers.map((insurer) => (
                        <SelectItem key={insurer.id} value={insurer.name}>
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
              name="policyholder_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("policyholder")}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="insured_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("insured")}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("product")}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProcessing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("premium")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      disabled={isProcessing} 
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCurrency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="RSD">RSD</SelectItem>
                      <SelectItem value="MKD">MKD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="payment_frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("paymentFrequency")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectPaymentFrequency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="annual">{t("annual")}</SelectItem>
                      <SelectItem value="semi-annual">{t("semiAnnual")}</SelectItem>
                      <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                      <SelectItem value="monthly">{t("monthly")}</SelectItem>
                      <SelectItem value="one-time">{t("oneTime")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="commission_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("commissionType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isProcessing}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCommissionType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="automatic">{t("automatic")}</SelectItem>
                      <SelectItem value="manual">{t("manual")}</SelectItem>
                      <SelectItem value="none">{t("none")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="commission_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("commissionPercentage")}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      min="0"
                      max="100"
                      {...field} 
                      disabled={isProcessing || form.watch("commission_type") === "none"} 
                    />
                  </FormControl>
                  <FormDescription>
                    {t("commissionPercentageDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("notes")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isProcessing}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveChanges")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PolicyReviewForm;
