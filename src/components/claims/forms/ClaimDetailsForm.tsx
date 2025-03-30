
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectedPolicyDisplay from "./SelectedPolicyDisplay";

// Export the schema for reuse
export const claimFormSchema = z.object({
  policy_id: z.string().min(1, { message: "Policy is required" }),
  claim_number: z.string().min(1, { message: "Claim number is required" }),
  damage_description: z.string().min(1, { message: "Damage description is required" }),
  incident_date: z.string().min(1, { message: "Incident date is required" }),
  claimed_amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  deductible: z.coerce.number().optional(),
  status: z.string().min(1, { message: "Status is required" }),
  notes: z.string().optional(),
});

export type ClaimFormValues = z.infer<typeof claimFormSchema>;

interface ClaimDetailsFormProps {
  defaultValues: ClaimFormValues;
  selectedPolicy: any | null;
  onSubmit: (values: ClaimFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isFormDisabled: boolean;
  openPolicySearch: () => void;
}

const ClaimDetailsForm = ({
  defaultValues,
  selectedPolicy,
  onSubmit,
  onCancel,
  isSubmitting,
  isFormDisabled,
  openPolicySearch,
}: ClaimDetailsFormProps) => {
  const { t } = useLanguage();
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Policy selection */}
        <SelectedPolicyDisplay 
          policyId={form.watch('policy_id')}
          selectedPolicy={selectedPolicy}
          onClearPolicy={() => form.setValue('policy_id', '')}
          onSearchClick={openPolicySearch}
          errorMessage={form.formState.errors.policy_id?.message}
        />
        
        {/* Claim number */}
        <FormField
          control={form.control}
          name="claim_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("claimNumber")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Incident date */}
        <FormField
          control={form.control}
          name="incident_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("incidentDate")}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Damage description */}
        <FormField
          control={form.control}
          name="damage_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("damageDescription")}</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Claimed amount */}
        <FormField
          control={form.control}
          name="claimed_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("claimedAmount")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Deductible */}
        <FormField
          control={form.control}
          name="deductible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("deductible")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("status")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
                  <SelectItem value="reported">{t("reported")}</SelectItem>
                  <SelectItem value="accepted">{t("accepted")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                  <SelectItem value="appealed">{t("appealed")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("notes")}</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormDescription>{t("additionalNotesDescription")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Form buttons */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting || isFormDisabled}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("createClaim")}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClaimDetailsForm;
