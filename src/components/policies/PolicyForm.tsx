
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/hooks/useClients";
import { useInsurers } from "@/hooks/useInsurers";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useAuth } from "@/contexts/AuthContext";
import useZodForm from "@/hooks/useZodForm";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { policyFormSchema, PolicyFormValues } from "@/schemas/policySchemas";
import PolicyBasicInfoTab from "./form/PolicyBasicInfoTab";
import PolicyPartiesTab from "./form/PolicyPartiesTab";
import PolicyFinancialTab from "./form/PolicyFinancialTab";

interface PolicyFormProps {
  onCancel: () => void;
  onSuccess: (policyId: string) => void;
  initialData?: any;
  isEditing?: boolean;
}

const PolicyForm: React.FC<PolicyFormProps> = ({
  onCancel,
  onSuccess,
  initialData,
  isEditing = false,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { clients = [] } = useClients();
  const { insurers = [] } = useInsurers();
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | undefined>(
    initialData?.insurer_id
  );
  const { products = [] } = useInsuranceProducts(selectedInsurerId);

  // Transform dates from string to Date objects for the form
  const formattedInitialData = initialData
    ? {
        ...initialData,
        start_date: initialData.start_date ? new Date(initialData.start_date) : undefined,
        expiry_date: initialData.expiry_date ? new Date(initialData.expiry_date) : undefined,
      }
    : {
        policy_number: "",
        policy_type: "internal",
        currency: "EUR",
        status: "active",
        workflow_status: "draft",
      };

  const form = useZodForm({
    schema: policyFormSchema,
    defaultValues: formattedInitialData,
    onSubmit: (values) => {
      if (isEditing) {
        updatePolicyMutation.mutate(values);
      } else {
        createPolicyMutation.mutate(values);
      }
    },
    successMessage: isEditing ? t("policyUpdatedSuccess") : t("policyCreatedSuccess"),
    errorMessage: isEditing ? t("policyUpdateError") : t("policyCreateError"),
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (data: PolicyFormValues) => {
      // Format the dates for Supabase
      const startDate = data.start_date.toISOString().split('T')[0];
      const expiryDate = data.expiry_date.toISOString().split('T')[0];
      
      // Prepare policy data with required fields
      const policyData = {
        ...data,
        start_date: startDate,
        expiry_date: expiryDate,
        company_id: user?.companyId,
        created_by: user?.id,
        commission_amount: data.premium * (data.commission_percentage || 0) / 100,
        workflow_status: "draft",
        insurer_name: data.insurer_name || "", // Ensure required field is set
        policyholder_name: data.policyholder_name || "", // Ensure required field is set
      };

      const { data: policy, error } = await supabase
        .from("policies")
        .insert(policyData)
        .select("id")
        .single();

      if (error) throw error;
      return policy;
    },
    onSuccess: (data) => {
      onSuccess(data.id);
    },
    onError: (error) => {
      console.error("Error creating policy:", error);
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: async (data: PolicyFormValues) => {
      // Format the dates for Supabase
      const startDate = data.start_date.toISOString().split('T')[0];
      const expiryDate = data.expiry_date.toISOString().split('T')[0];
      
      // Prepare policy data
      const policyData = {
        ...data,
        start_date: startDate,
        expiry_date: expiryDate,
        updated_at: new Date().toISOString(),
        commission_amount: data.premium * (data.commission_percentage || 0) / 100,
        insurer_name: data.insurer_name || "", // Ensure required field is set
        policyholder_name: data.policyholder_name || "", // Ensure required field is set
      };

      const { data: policy, error } = await supabase
        .from("policies")
        .update(policyData)
        .eq("id", initialData.id)
        .select("id")
        .single();

      if (error) throw error;
      return policy;
    },
    onSuccess: (data) => {
      onSuccess(data.id);
    },
    onError: (error) => {
      console.error("Error updating policy:", error);
    },
  });

  const handleInsurerChange = (insurerId: string) => {
    setSelectedInsurerId(insurerId);
    
    const selectedInsurer = insurers.find(insurer => insurer.id === insurerId);
    if (selectedInsurer) {
      form.setValue("insurer_name", selectedInsurer.name);
    }
    
    form.setValue("product_id", undefined);
    form.setValue("product_name", undefined);
    form.setValue("product_code", undefined);
  };

  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(product => product.id === productId);
    if (selectedProduct) {
      form.setValue("product_name", selectedProduct.name);
      form.setValue("product_code", selectedProduct.code);
    }
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(client => client.id === clientId);
    if (selectedClient) {
      form.setValue("policyholder_name", selectedClient.name);
      form.setValue("insured_id", clientId);
      form.setValue("insured_name", selectedClient.name);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(form.handleSubmitWithToast)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
            <TabsTrigger value="parties">{t("parties")}</TabsTrigger>
            <TabsTrigger value="financial">{t("financialInfo")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <PolicyBasicInfoTab form={form} />
          </TabsContent>
          
          <TabsContent value="parties">
            <PolicyPartiesTab 
              form={form}
              clients={clients}
              insurers={insurers}
              products={products}
              selectedInsurerId={selectedInsurerId}
              onInsurerChange={handleInsurerChange}
              onClientChange={handleClientChange}
              onProductChange={handleProductChange}
            />
          </TabsContent>
          
          <TabsContent value="financial">
            <PolicyFinancialTab form={form} />
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button 
            type="submit" 
            disabled={form.isSubmitting}
          >
            {isEditing 
              ? (form.isSubmitting ? t("saving") : t("updatePolicy")) 
              : (form.isSubmitting ? t("creating") : t("createPolicy"))}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PolicyForm;
