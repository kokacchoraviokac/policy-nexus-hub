
import React from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PolicyReviewFormProps {
  policy: Policy;
  onSave?: (updatedPolicy: Partial<Policy>) => void;
  isProcessing: boolean;
}

const PolicyReviewForm: React.FC<PolicyReviewFormProps> = ({ 
  policy, 
  onSave,
  isProcessing
}) => {
  const { t } = useLanguage();
  const { register, handleSubmit, setValue, watch, formState } = useForm<Partial<Policy>>({
    defaultValues: {
      policy_number: policy.policy_number,
      policyholder_name: policy.policyholder_name,
      insured_name: policy.insured_name,
      insurer_name: policy.insurer_name,
      product_name: policy.product_name,
      product_id: policy.product_id, // Use product_id instead of product_code
      start_date: policy.start_date,
      expiry_date: policy.expiry_date,
      premium: policy.premium,
      currency: policy.currency,
      payment_frequency: policy.payment_frequency,
      commission_type: policy.commission_type,
      commission_percentage: policy.commission_percentage,
      notes: policy.notes
    }
  });
  
  const paymentFrequencies = [
    { value: 'monthly', label: t('monthly') },
    { value: 'quarterly', label: t('quarterly') },
    { value: 'biannually', label: t('biannually') },
    { value: 'annually', label: t('annually') },
    { value: 'singlePayment', label: t('singlePayment') }
  ];
  
  const currencies = [
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD' },
    { value: 'RSD', label: 'RSD' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CHF', label: 'CHF' }
  ];
  
  const commissionTypes = [
    { value: 'automatic', label: t('automatic') },
    { value: 'manual', label: t('manual') },
    { value: 'none', label: t('none') }
  ];
  
  const handleSelectChange = (fieldName: keyof Policy, value: string) => {
    setValue(fieldName, value);
  };
  
  const onSubmit = (data: Partial<Policy>) => {
    if (onSave) {
      onSave(data);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("editPolicyDetails")}</CardTitle>
            <CardDescription>{t("reviewAndEditImportedPolicy")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-700 text-sm">
                {t("importedPolicyReviewNote")}
              </AlertDescription>
            </Alert>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="policy_number">{t("policyNumber")}</Label>
                  <Input 
                    id="policy_number" 
                    {...register("policy_number", { required: true })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="start_date">{t("startDate")}</Label>
                  <Input 
                    id="start_date" 
                    type="date" 
                    {...register("start_date", { required: true })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiry_date">{t("expiryDate")}</Label>
                  <Input 
                    id="expiry_date" 
                    type="date" 
                    {...register("expiry_date", { required: true })}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="premium">{t("premium")}</Label>
                  <Input 
                    id="premium" 
                    type="number" 
                    step="0.01" 
                    {...register("premium", { 
                      required: true,
                      valueAsNumber: true
                    })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="currency">{t("currency")}</Label>
                  <Select
                    value={watch("currency")}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder={t("selectCurrency")} />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="payment_frequency">{t("paymentFrequency")}</Label>
                  <Select
                    value={watch("payment_frequency") || ""}
                    onValueChange={(value) => handleSelectChange("payment_frequency", value)}
                  >
                    <SelectTrigger id="payment_frequency">
                      <SelectValue placeholder={t("selectPaymentFrequency")} />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentFrequencies.map((frequency) => (
                        <SelectItem key={frequency.value} value={frequency.value}>
                          {frequency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="commission_type">{t("commissionType")}</Label>
                <Select
                  value={watch("commission_type") || ""}
                  onValueChange={(value) => handleSelectChange("commission_type", value)}
                >
                  <SelectTrigger id="commission_type">
                    <SelectValue placeholder={t("selectCommissionType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="commission_percentage">{t("commissionPercentage")}</Label>
                <Input 
                  id="commission_percentage" 
                  type="number"
                  step="0.01"
                  {...register("commission_percentage", { valueAsNumber: true })}
                  disabled={watch("commission_type") === "automatic" || watch("commission_type") === "none"}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea 
                id="notes" 
                {...register("notes")}
                className="min-h-[100px]" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
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
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default PolicyReviewForm;
