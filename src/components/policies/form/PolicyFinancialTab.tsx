
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PolicyFormValues } from "@/schemas/policySchemas";

interface PolicyFinancialTabProps {
  form: UseFormReturn<PolicyFormValues>;
}

const PolicyFinancialTab: React.FC<PolicyFinancialTabProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="premium"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("premium")}*</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0.00" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e);
                  const percentage = form.getValues("commission_percentage");
                  if (percentage) {
                    const premium = parseFloat(e.target.value);
                    const commission = premium * percentage / 100;
                    // If needed, can set commission amount value here
                  }
                }}
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
            <FormLabel>{t("currency")}*</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="RSD">RSD (РСД)</SelectItem>
                <SelectItem value="MKD">MKD (ден)</SelectItem>
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
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectFrequency")} />
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
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectCommissionType")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="fixed">{t("fixed")}</SelectItem>
                <SelectItem value="client-specific">{t("clientSpecific")}</SelectItem>
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
                placeholder="0.00" 
                {...field} 
                value={field.value || ""} 
                onChange={(e) => {
                  field.onChange(e);
                  const premium = form.getValues("premium");
                  const percentage = parseFloat(e.target.value);
                  if (premium && percentage) {
                    const commission = premium * percentage / 100;
                    // If needed, can set commission amount value here
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PolicyFinancialTab;
