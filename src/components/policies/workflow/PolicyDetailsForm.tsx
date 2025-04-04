
import React from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { useActivityLogger } from "@/utils/activityLogger";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useZodForm from "@/hooks/useZodForm";
import {
  nameSchema,
  policyNumberSchema,
  dateSchema,
  premiumSchema
} from "@/utils/formSchemas";

interface PolicyDetailsFormProps {
  policy: Policy;
}

// Create schema for policy form
const createPolicyDetailsSchema = (t: (key: string) => string) => z.object({
  policy_number: policyNumberSchema(t("policyNumberRequired")),
  policyholder_name: nameSchema(t("policyholderNameRequired")),
  insurer_name: nameSchema(t("insurerNameRequired")),
  premium: premiumSchema(t("validPremiumRequired")),
  start_date: z.string().min(1, { message: t("startDateRequired") }),
  expiry_date: z.string().min(1, { message: t("expiryDateRequired") }),
  currency: z.string().default("EUR"),
});

type PolicyDetailsFormValues = z.infer<ReturnType<typeof createPolicyDetailsSchema>>;

const PolicyDetailsForm: React.FC<PolicyDetailsFormProps> = ({ policy }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const policySchema = createPolicyDetailsSchema(t);
  
  const form = useZodForm({
    schema: policySchema,
    defaultValues: {
      policy_number: policy.policy_number,
      policyholder_name: policy.policyholder_name,
      insurer_name: policy.insurer_name,
      premium: policy.premium,
      start_date: policy.start_date,
      expiry_date: policy.expiry_date,
      currency: policy.currency,
    },
    onSubmit: (data) => updatePolicy.mutate(data),
    successMessage: t("policyDetailsUpdatedSuccessfully"),
    errorMessage: t("errorUpdatingPolicy")
  });
  
  const updatePolicy = useMutation({
    mutationFn: async (data: PolicyDetailsFormValues) => {
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
    },
    onError: (error: any) => {
      console.error("Error updating policy:", error);
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(form.onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="policy_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("policyNumber")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="policyholder_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("policyholderName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="insurer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("insurerName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("startDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("expiryDate")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updatePolicy.isPending || form.isSubmitting}
          >
            {updatePolicy.isPending || form.isSubmitting ? (
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
    </Form>
  );
};

export default PolicyDetailsForm;
