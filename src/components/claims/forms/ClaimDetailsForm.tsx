
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
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
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import StatusSelector from "@/components/claims/status/StatusSelector";

export interface ClaimFormValues {
  policy_id: string;
  claim_number: string;
  damage_description: string;
  incident_date: string;
  claimed_amount: number;
  deductible?: number;
  status: string;
  notes?: string;
  incident_location?: string;
}

interface ClaimDetailsFormProps {
  defaultValues: ClaimFormValues;
  onSubmit: (values: ClaimFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isFormDisabled?: boolean;
  selectedPolicy?: any;
  openPolicySearch: () => void;
}

const ClaimDetailsForm: React.FC<ClaimDetailsFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  isFormDisabled = false,
  selectedPolicy,
  openPolicySearch,
}) => {
  const { t } = useLanguage();

  const formSchema = z.object({
    policy_id: z.string().min(1, { message: t("policyRequired") }),
    claim_number: z.string().min(1, { message: t("claimNumberRequired") }),
    damage_description: z.string().min(3, { message: t("damageDescriptionRequired") }),
    incident_date: z.string().min(1, { message: t("incidentDateRequired") }),
    claimed_amount: z.coerce.number().positive({ message: t("claimedAmountPositive") }),
    deductible: z.coerce.number().optional(),
    status: z.string().min(1, { message: t("statusRequired") }),
    notes: z.string().optional(),
    incident_location: z.string().optional(),
  });

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleFormSubmit = (values: ClaimFormValues) => {
    onSubmit({
      ...values,
      claimed_amount: Number(values.claimed_amount),
      deductible: values.deductible ? Number(values.deductible) : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Policy Selection */}
        <div className="rounded-md border p-4 bg-muted/10">
          <div className="mb-4">
            <FormLabel>{t("policy")}</FormLabel>
            <div className="flex justify-between items-start mt-2">
              {selectedPolicy ? (
                <div className="space-y-1">
                  <div className="font-medium">{selectedPolicy.policy_number}</div>
                  <div className="text-sm text-muted-foreground">{selectedPolicy.policyholder_name}</div>
                  <div className="text-sm text-muted-foreground">{selectedPolicy.insurer_name}</div>
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm mt-1">
                  {t("noPolicySelected")}
                </div>
              )}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={openPolicySearch}
                disabled={isFormDisabled}
              >
                <Search className="mr-2 h-4 w-4" />
                {t("searchPolicy")}
              </Button>
            </div>
            <input
              type="hidden"
              {...form.register("policy_id")}
            />
            {form.formState.errors.policy_id && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.policy_id.message}
              </p>
            )}
          </div>

          {/* Claim Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="claim_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("claimNumber")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterClaimNumber")}
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="incident_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("incidentDate")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="incident_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("incident_location")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterLocation")}
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                      disabled={isFormDisabled}
                    >
                      <option value="in processing">{t("inProcessing")}</option>
                      <option value="reported">{t("reported")}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="claimed_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("claimedAmount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deductible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("deductible")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      disabled={isFormDisabled}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("deductibleDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="damage_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("damageDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("enterDamageDescription")}
                  className="min-h-32"
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("additionalNotes")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("enterAdditionalNotes")}
                  className="min-h-24"
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormDescription>
                {t("additionalNotesDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isSubmitting || isFormDisabled}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("createClaim")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClaimDetailsForm;
