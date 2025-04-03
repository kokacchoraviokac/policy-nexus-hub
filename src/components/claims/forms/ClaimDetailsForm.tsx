
import React from "react";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectedPolicyDisplay from "./SelectedPolicyDisplay";
import useZodForm from "@/hooks/useZodForm";
import {
  claimStatusSchema,
  damageDescriptionSchema,
  claimAmountSchema,
  createModelSchema
} from "@/utils/formSchemas";

// Create the schema for claim form validation
const createClaimSchema = (t: (key: string) => string) => z.object({
  policy_id: createModelSchema("Policy", { isRequired: true, errorMessage: t("policyRequired") }),
  claim_number: z.string().min(1, { message: t("claimNumberRequired") }),
  damage_description: damageDescriptionSchema(t("damageDescriptionRequired")),
  incident_date: z.string().min(1, { message: t("incidentDateRequired") }),
  claimed_amount: claimAmountSchema(t("claimedAmountInvalid")),
  deductible: z.number().optional(),
  status: claimStatusSchema(),
  notes: z.string().optional(),
});

export type ClaimFormValues = z.infer<ReturnType<typeof createClaimSchema>>;

interface ClaimDetailsFormProps {
  defaultValues: ClaimFormValues;
  selectedPolicy: any;
  onSubmit: (values: ClaimFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isFormDisabled: boolean;
  openPolicySearch: () => void;
}

const ClaimDetailsForm: React.FC<ClaimDetailsFormProps> = ({
  defaultValues,
  selectedPolicy,
  onSubmit,
  onCancel,
  isSubmitting,
  isFormDisabled,
  openPolicySearch
}) => {
  const { t } = useLanguage();
  
  const claimSchema = createClaimSchema(t);
  
  const form = useZodForm({
    schema: claimSchema,
    defaultValues,
    onSubmit,
    successMessage: t("claimSavedSuccess"),
    errorMessage: t("claimSaveError")
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Policy Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{t("policyInformation")}</h3>
            <Button 
              type="button" 
              variant="outline" 
              onClick={openPolicySearch}
              disabled={isFormDisabled || isSubmitting}
            >
              {selectedPolicy ? t("changePolicy") : t("searchPolicy")}
            </Button>
          </div>
          
          <FormField
            control={form.control}
            name="policy_id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedPolicy ? (
            <SelectedPolicyDisplay policy={selectedPolicy} />
          ) : (
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-center text-muted-foreground">{t("noPolicySelected")}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {t("searchForPolicyDescription")}
              </p>
            </div>
          )}
        </div>
        
        {/* Claim Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t("claimInformation")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="claim_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("claimNumber")}</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isFormDisabled || isSubmitting} />
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
                    <Input type="date" {...field} disabled={isFormDisabled || isSubmitting} />
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
                      step="0.01"
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      disabled={isFormDisabled || isSubmitting} 
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
                      step="0.01"
                      {...field} 
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                        field.onChange(value);
                      }}
                      disabled={isFormDisabled || isSubmitting} 
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isFormDisabled || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_processing">{t("inProcessing")}</SelectItem>
                      <SelectItem value="reported">{t("reported")}</SelectItem>
                      <SelectItem value="accepted">{t("accepted")}</SelectItem>
                      <SelectItem value="rejected">{t("rejected")}</SelectItem>
                      <SelectItem value="partially_accepted">{t("partiallyAccepted")}</SelectItem>
                      <SelectItem value="appealed">{t("appealed")}</SelectItem>
                      <SelectItem value="withdrawn">{t("withdrawn")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="damage_description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("damageDescription")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      className="min-h-[100px]" 
                      disabled={isFormDisabled || isSubmitting} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    className="min-h-[80px]" 
                    disabled={isFormDisabled || isSubmitting} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || isFormDisabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClaimDetailsForm;
