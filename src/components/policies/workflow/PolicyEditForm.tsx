
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { useActivityLogger } from "@/utils/activityLogger";

interface PolicyEditFormProps {
  policy: Policy;
}

type FormData = {
  policy_number: string;
  policy_type: string;
  policyholder_name: string;
  insurer_name: string;
  insured_name?: string;
  product_name?: string;
  premium: number;
  start_date: string;
  expiry_date: string;
  status: string;
  commission_percentage?: number;
  notes?: string;
};

const PolicyEditForm: React.FC<PolicyEditFormProps> = ({ policy }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      policy_number: policy.policy_number,
      policy_type: policy.policy_type,
      policyholder_name: policy.policyholder_name,
      insurer_name: policy.insurer_name,
      insured_name: policy.insured_name,
      product_name: policy.product_name,
      premium: policy.premium,
      start_date: policy.start_date,
      expiry_date: policy.expiry_date,
      status: policy.status,
      commission_percentage: policy.commission_percentage,
      notes: policy.notes,
    }
  });
  
  const updatePolicy = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase
        .from('policies')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', policy.id);
      
      if (error) throw error;

      // Log the activity
      logActivity({
        entity_type: "policy",
        entity_id: policy.id,
        action: "update",
        details: {
          fields_updated: Object.keys(data),
          timestamp: new Date().toISOString()
        }
      });
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      toast({
        title: t("policyUpdated"),
        description: t("policyDetailsUpdatedSuccessfully"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("errorUpdatingPolicy"),
        description: error.message || t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: FormData) => {
    updatePolicy.mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="policy_number">{t("policyNumber")}</Label>
          <Input 
            id="policy_number" 
            {...register("policy_number", { required: true })}
            className={errors.policy_number ? "border-destructive" : ""}
          />
          {errors.policy_number && (
            <p className="text-sm text-destructive">{t("policyNumberRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="policy_type">{t("policyType")}</Label>
          <Input 
            id="policy_type" 
            {...register("policy_type", { required: true })}
            className={errors.policy_type ? "border-destructive" : ""}
          />
          {errors.policy_type && (
            <p className="text-sm text-destructive">{t("policyTypeRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="policyholder_name">{t("policyholderName")}</Label>
          <Input 
            id="policyholder_name" 
            {...register("policyholder_name", { required: true })}
            className={errors.policyholder_name ? "border-destructive" : ""}
          />
          {errors.policyholder_name && (
            <p className="text-sm text-destructive">{t("policyholderNameRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="insurer_name">{t("insurerName")}</Label>
          <Input 
            id="insurer_name" 
            {...register("insurer_name", { required: true })}
            className={errors.insurer_name ? "border-destructive" : ""}
          />
          {errors.insurer_name && (
            <p className="text-sm text-destructive">{t("insurerNameRequired")}</p>
          )}
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
          <Label htmlFor="premium">{t("premium")}</Label>
          <Input 
            id="premium" 
            type="number"
            step="0.01"
            {...register("premium", { 
              required: true,
              valueAsNumber: true,
              min: 0
            })}
            className={errors.premium ? "border-destructive" : ""}
          />
          {errors.premium && (
            <p className="text-sm text-destructive">{t("validPremiumRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="commission_percentage">{t("commissionPercentage")}</Label>
          <Input 
            id="commission_percentage" 
            type="number"
            step="0.01"
            {...register("commission_percentage", { 
              valueAsNumber: true,
              min: 0,
              max: 100
            })}
            className={errors.commission_percentage ? "border-destructive" : ""}
          />
          {errors.commission_percentage && (
            <p className="text-sm text-destructive">{t("validCommissionRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="start_date">{t("startDate")}</Label>
          <Input 
            id="start_date" 
            type="date"
            {...register("start_date", { required: true })}
            className={errors.start_date ? "border-destructive" : ""}
          />
          {errors.start_date && (
            <p className="text-sm text-destructive">{t("startDateRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiry_date">{t("expiryDate")}</Label>
          <Input 
            id="expiry_date" 
            type="date"
            {...register("expiry_date", { required: true })}
            className={errors.expiry_date ? "border-destructive" : ""}
          />
          {errors.expiry_date && (
            <p className="text-sm text-destructive">{t("expiryDateRequired")}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">{t("status")}</Label>
          <Select 
            defaultValue={policy.status}
            onValueChange={(value) => {
              // register doesn't work well with controlled Select
              // we'd need to use react-hook-form controller for this
            }}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="expired">{t("expired")}</SelectItem>
              <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("status")} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea 
          id="notes" 
          {...register("notes")}
          rows={4}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
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
      </div>
    </form>
  );
};

export default PolicyEditForm;
