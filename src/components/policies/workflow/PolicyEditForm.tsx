import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActivityLogger } from "@/utils/activityLogger";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Policy } from "@/types/policies";
import { Loader2 } from "lucide-react";

interface PolicyEditFormProps {
  policy: Policy;
  onSuccess?: () => void;
}

const PolicyEditForm: React.FC<PolicyEditFormProps> = ({ policy, onSuccess }) => {
  const { t, formatDate } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const [startDate, setStartDate] = useState<Date | undefined>(
    policy.start_date ? new Date(policy.start_date) : undefined
  );
  
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    policy.expiry_date ? new Date(policy.expiry_date) : undefined
  );
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      policy_number: policy.policy_number || "",
      policy_type: policy.policy_type || "",
      insurer_name: policy.insurer_name || "",
      product_name: policy.product_name || "",
      policyholder_name: policy.policyholder_name || "",
      insured_name: policy.insured_name || "",
      premium: policy.premium || "",
      currency: policy.currency || "EUR",
      payment_frequency: policy.payment_frequency || "",
      commission_percentage: policy.commission_percentage || "",
      notes: policy.notes || "",
    }
  });
  
  const updatePolicy = useMutation({
    mutationFn: async (formData: any) => {
      const dataToUpdate = {
        ...formData,
        start_date: startDate ? formatDate(startDate) : null,
        expiry_date: expiryDate ? formatDate(expiryDate) : null,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('policies')
        .update(dataToUpdate)
        .eq('id', policy.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      
      const policyId = policy.id;
      const submittedValues = {
        policy_number: data.policy_number,
        policy_type: data.policy_type,
        insurer_name: data.insurer_name,
        product_name: data.product_name,
        policyholder_name: data.policyholder_name,
        insured_name: data.insured_name,
        premium: data.premium,
        currency: data.currency,
        payment_frequency: data.payment_frequency,
        commission_percentage: data.commission_percentage,
        notes: data.notes
      };
      
      await logActivity({
        entity_type: "policy",
        entity_id: policyId,
        action: "update",
        details: {
          fields: submittedValues,
          timestamp: new Date().toISOString()
        }
      });
      
      toast({
        title: t("success"),
        description: t("policyUpdatedSuccessfully"),
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error updating policy:", error);
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: any) => {
    data.premium = data.premium ? parseFloat(data.premium) : null;
    data.commission_percentage = data.commission_percentage ? parseFloat(data.commission_percentage) : null;
    
    updatePolicy.mutate(data);
  };
  
  const currencyOptions = ["EUR", "USD", "RSD", "MKD"];
  const frequencyOptions = ["monthly", "quarterly", "biannually", "annually", "singlePayment"];

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{t("editPolicyDetails")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t("reviewAndEditImportedPolicy")}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">{t("basicInformation")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy_number">{t("policyNumber")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="policy_number" 
                  {...register("policy_number", { required: true })}
                  className={errors.policy_number ? "border-red-500" : ""}
                />
                {errors.policy_number && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policy_type">{t("policyType")}</Label>
                <Input 
                  id="policy_type" 
                  {...register("policy_type")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_date">{t("startDate")} <span className="text-red-500">*</span></Label>
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                  className={!startDate ? "border-red-500" : ""}
                />
                {!startDate && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry_date">{t("expiryDate")} <span className="text-red-500">*</span></Label>
                <DatePicker
                  date={expiryDate}
                  setDate={setExpiryDate}
                  className={!expiryDate ? "border-red-500" : ""}
                />
                {!expiryDate && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">{t("partiesInvolved")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurer_name">{t("insurer")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="insurer_name" 
                  {...register("insurer_name", { required: true })}
                  className={errors.insurer_name ? "border-red-500" : ""}
                />
                {errors.insurer_name && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product_name">{t("product")}</Label>
                <Input 
                  id="product_name" 
                  {...register("product_name")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policyholder_name">{t("policyholder")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="policyholder_name" 
                  {...register("policyholder_name", { required: true })}
                  className={errors.policyholder_name ? "border-red-500" : ""}
                />
                {errors.policyholder_name && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insured_name">{t("insured")}</Label>
                <Input 
                  id="insured_name" 
                  {...register("insured_name")}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">{t("financialDetails")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="premium">{t("premium")} <span className="text-red-500">*</span></Label>
                <Input 
                  id="premium" 
                  type="number"
                  step="0.01"
                  {...register("premium", { required: true })}
                  className={errors.premium ? "border-red-500" : ""}
                />
                {errors.premium && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">{t("currency")} <span className="text-red-500">*</span></Label>
                <Select 
                  defaultValue={policy.currency || "EUR"} 
                  onValueChange={(value) => {
                    const event = {
                      target: {
                        name: "currency",
                        value: value
                      }
                    };
                    register("currency").onChange(event);
                  }}
                >
                  <SelectTrigger className={errors.currency ? "border-red-500" : ""}>
                    <SelectValue placeholder={t("selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500">{t("required")}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment_frequency">{t("paymentFrequency")}</Label>
                <Select 
                  defaultValue={policy.payment_frequency || ""} 
                  onValueChange={(value) => {
                    const event = {
                      target: {
                        name: "payment_frequency",
                        value: value
                      }
                    };
                    register("payment_frequency").onChange(event);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectFrequency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(frequency => (
                      <SelectItem key={frequency} value={frequency}>{t(frequency)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commission_percentage">{t("commissionPercentage")}</Label>
                <Input 
                  id="commission_percentage" 
                  type="number"
                  step="0.01"
                  {...register("commission_percentage")}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t("additionalInformation")}</Label>
            <Textarea 
              id="notes" 
              rows={4}
              placeholder={t("enterNotes")}
              {...register("notes")}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={updatePolicy.isPending}
          >
            {updatePolicy.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("saveChanges")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PolicyEditForm;
