import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Policy } from "@/types/policies";
import { useActivityLogger } from "@/utils/activityLogger";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoaderCircle, Save } from "lucide-react";

interface PolicyDetailsFormProps {
  policy: Policy;
}

const PolicyDetailsForm: React.FC<PolicyDetailsFormProps> = ({ policy }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const [formData, setFormData] = useState<Partial<Policy>>({
    policy_number: policy.policy_number,
    policy_type: policy.policy_type,
    insurer_name: policy.insurer_name,
    product_name: policy.product_name,
    product_code: policy.product_code,
    policyholder_name: policy.policyholder_name,
    insured_name: policy.insured_name || policy.policyholder_name,
    start_date: policy.start_date,
    expiry_date: policy.expiry_date,
    premium: policy.premium,
    currency: policy.currency,
    payment_frequency: policy.payment_frequency,
    commission_type: policy.commission_type,
    commission_percentage: policy.commission_percentage,
    notes: policy.notes,
  });
  
  const updatePolicy = useMutation({
    mutationFn: async (data: Partial<Policy>) => {
      const { data: updatedPolicy, error } = await supabase
        .from('policies')
        .update(data)
        .eq('id', policy.id)
        .select()
        .single();
      
      if (error) throw error;
      return updatedPolicy;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy', policy.id] });
      queryClient.invalidateQueries({ queryKey: ['policies-workflow'] });
      
      toast({
        title: t("success"),
        description: t("policyUpdatedSuccessfully"),
      });
      
      await logActivity({
        entity_type: "policy",
        entity_id: policy.id,
        action: "update",
        details: {
          fields: formData,
          timestamp: new Date().toISOString()
        }
      });
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
  
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      handleChange(field, formattedDate);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePolicy.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t("basicInformationAboutPolicy")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policy_number">{t("policyNumber")} *</Label>
              <Input
                id="policy_number"
                value={formData.policy_number || ""}
                onChange={(e) => handleChange("policy_number", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policy_type">{t("policyType")} *</Label>
              <Input
                id="policy_type"
                value={formData.policy_type || ""}
                onChange={(e) => handleChange("policy_type", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start_date">{t("startDate")} *</Label>
              <DatePicker
                id="start_date"
                date={formData.start_date ? new Date(formData.start_date) : undefined}
                onSelect={(date) => handleDateChange("start_date", date)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiry_date">{t("expiryDate")} *</Label>
              <DatePicker
                id="expiry_date"
                date={formData.expiry_date ? new Date(formData.expiry_date) : undefined}
                onSelect={(date) => handleDateChange("expiry_date", date)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t("partiesInvolved")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policyholder_name">{t("policyholder")} *</Label>
              <Input
                id="policyholder_name"
                value={formData.policyholder_name || ""}
                onChange={(e) => handleChange("policyholder_name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insured_name">{t("insured")}</Label>
              <Input
                id="insured_name"
                value={formData.insured_name || ""}
                onChange={(e) => handleChange("insured_name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="insurer_name">{t("insurerName")} *</Label>
              <Input
                id="insurer_name"
                value={formData.insurer_name || ""}
                onChange={(e) => handleChange("insurer_name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product_name">{t("productName")}</Label>
              <Input
                id="product_name"
                value={formData.product_name || ""}
                onChange={(e) => handleChange("product_name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product_code">{t("productCode")}</Label>
              <Input
                id="product_code"
                value={formData.product_code || ""}
                onChange={(e) => handleChange("product_code", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t("financialDetails")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="premium">{t("premium")} *</Label>
              <Input
                id="premium"
                type="number"
                step="0.01"
                value={formData.premium || ""}
                onChange={(e) => handleChange("premium", parseFloat(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">{t("currency")} *</Label>
              <Select
                value={formData.currency || "EUR"}
                onValueChange={(value) => handleChange("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="RSD">RSD</SelectItem>
                  <SelectItem value="MKD">MKD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_frequency">{t("paymentFrequency")}</Label>
              <Select
                value={formData.payment_frequency || ""}
                onValueChange={(value) => handleChange("payment_frequency", value)}
              >
                <SelectTrigger id="payment_frequency">
                  <SelectValue placeholder={t("selectFrequency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">{t("monthly")}</SelectItem>
                  <SelectItem value="quarterly">{t("quarterly")}</SelectItem>
                  <SelectItem value="biannually">{t("biannually")}</SelectItem>
                  <SelectItem value="annually">{t("annually")}</SelectItem>
                  <SelectItem value="single">{t("singlePayment")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="font-medium mb-3">{t("commission")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission_type">{t("commissionType")}</Label>
              <Select
                value={formData.commission_type || ""}
                onValueChange={(value) => handleChange("commission_type", value)}
              >
                <SelectTrigger id="commission_type">
                  <SelectValue placeholder={t("selectCommissionType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">{t("automatic")}</SelectItem>
                  <SelectItem value="manual">{t("manual")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commission_percentage">{t("commissionPercentage")}</Label>
              <Input
                id="commission_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commission_percentage || ""}
                onChange={(e) => handleChange("commission_percentage", parseFloat(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t("additionalInformation")}</h3>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder={t("enterNotes")}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={updatePolicy.isPending}>
          {updatePolicy.isPending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("saveChanges")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PolicyDetailsForm;
