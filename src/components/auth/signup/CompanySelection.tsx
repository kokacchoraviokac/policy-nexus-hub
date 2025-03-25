
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues, CompanySeatsInfo } from "@/types/auth/signup";
import { Company } from "@/hooks/useCompanies";

interface CompanySelectionProps {
  form: UseFormReturn<SignupFormValues>;
  t: (key: string) => string;
  companyOption: string;
  selectedCompanyId: string;
  companies: Company[];
  loadingCompanies: boolean;
  companySeatsInfo: Record<string, CompanySeatsInfo>;
  invitation: any;
}

const CompanySelection: React.FC<CompanySelectionProps> = ({
  form,
  t,
  companyOption,
  selectedCompanyId,
  companies,
  loadingCompanies,
  companySeatsInfo,
  invitation
}) => {
  // Don't render anything if we have an invitation
  if (invitation) return null;

  return (
    <>
      <FormField
        control={form.control}
        name="companyOption"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{t("company")}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="existing" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {t("existingCompany")}
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="new" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {t("newCompany")}
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {companyOption === "existing" && (
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("selectCompany")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCompany")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingCompanies ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : companies.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No companies found
                    </SelectItem>
                  ) : (
                    companies.map((company) => {
                      const info = companySeatsInfo[company.id];
                      const hasSeats = info?.hasAvailableSeats !== false;
                      return (
                        <SelectItem 
                          key={company.id} 
                          value={company.id}
                          disabled={!hasSeats}
                        >
                          {company.name} 
                          {info ? ` (${info.usedSeats}/${info.seatsLimit} seats)` : ''}
                          {!hasSeats ? ' - No seats available' : ''}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
              {selectedCompanyId && companySeatsInfo[selectedCompanyId] && !companySeatsInfo[selectedCompanyId].hasAvailableSeats && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This company has reached its seat limit. Please contact a SuperAdmin to increase the limit.
                  </AlertDescription>
                </Alert>
              )}
            </FormItem>
          )}
        />
      )}
      
      {companyOption === "new" && (
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("companyName")}</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default CompanySelection;
