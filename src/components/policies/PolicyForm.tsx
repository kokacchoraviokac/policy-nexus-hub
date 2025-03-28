
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/hooks/useClients";
import { useInsurers } from "@/hooks/useInsurers";
import { useInsuranceProducts } from "@/hooks/useInsuranceProducts";
import { useAuth } from "@/contexts/AuthContext";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PolicyFormProps {
  onCancel: () => void;
  onSuccess: (policyId: string) => void;
  initialData?: any;
  isEditing?: boolean;
}

const policySchema = z.object({
  policy_number: z.string().min(1, { message: "Policy number is required" }),
  policy_type: z.string().min(1, { message: "Policy type is required" }),
  insurer_id: z.string().min(1, { message: "Insurer is required" }),
  insurer_name: z.string().min(1, { message: "Insurer name is required" }),
  product_id: z.string().optional(),
  product_name: z.string().optional(),
  product_code: z.string().optional(),
  client_id: z.string().min(1, { message: "Client is required" }),
  policyholder_name: z.string().min(1, { message: "Policyholder name is required" }),
  insured_id: z.string().optional(),
  insured_name: z.string().optional(),
  start_date: z.date({ required_error: "Start date is required" }),
  expiry_date: z.date({ required_error: "Expiry date is required" }),
  premium: z.coerce.number().positive({ message: "Premium must be a positive number" }),
  currency: z.string().default("EUR"),
  payment_frequency: z.string().optional(),
  commission_type: z.string().optional(),
  commission_percentage: z.coerce.number().optional(),
  status: z.string().default("active"),
  workflow_status: z.string().default("draft"),
  notes: z.string().optional(),
});

type PolicyFormValues = z.infer<typeof policySchema>;

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
  const [selectedInsurerId, setSelectedInsurerId] = React.useState<string | undefined>(
    initialData?.insurer_id
  );
  const { products = [] } = useInsuranceProducts(selectedInsurerId);

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: initialData || {
      policy_number: "",
      policy_type: "internal", // Default type
      currency: "EUR", // Default currency
      status: "active",
      workflow_status: "draft",
    },
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (data: PolicyFormValues) => {
      // Convert Date objects to ISO strings for Supabase
      const { start_date, expiry_date, ...rest } = data;
      
      const { data: policy, error } = await supabase
        .from("policies")
        .insert({
          ...rest,
          start_date: start_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          expiry_date: expiry_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          company_id: user?.companyId,
          created_by: user?.id,
          commission_amount: data.premium * (data.commission_percentage || 0) / 100,
        })
        .select("id")
        .single();

      if (error) throw error;
      return policy;
    },
    onSuccess: (data) => {
      toast({
        title: t("policyCreated"),
        description: t("policyCreatedSuccess"),
      });
      onSuccess(data.id);
    },
    onError: (error) => {
      console.error("Error creating policy:", error);
      toast({
        title: t("policyCreateError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: async (data: PolicyFormValues) => {
      // Convert Date objects to ISO strings for Supabase
      const { start_date, expiry_date, ...rest } = data;
      
      const { data: policy, error } = await supabase
        .from("policies")
        .update({
          ...rest,
          start_date: start_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          expiry_date: expiry_date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          updated_at: new Date().toISOString(),
          commission_amount: data.premium * (data.commission_percentage || 0) / 100,
        })
        .eq("id", initialData.id)
        .select("id")
        .single();

      if (error) throw error;
      return policy;
    },
    onSuccess: (data) => {
      toast({
        title: t("policyUpdated"),
        description: t("policyUpdatedSuccess"),
      });
      onSuccess(data.id);
    },
    onError: (error) => {
      console.error("Error updating policy:", error);
      toast({
        title: t("policyUpdateError"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PolicyFormValues) => {
    if (isEditing) {
      updatePolicyMutation.mutate(data);
    } else {
      createPolicyMutation.mutate(data);
    }
  };

  const handleInsurerChange = (insurerId: string) => {
    setSelectedInsurerId(insurerId);
    
    // Find the insurer name
    const selectedInsurer = insurers.find(insurer => insurer.id === insurerId);
    if (selectedInsurer) {
      form.setValue("insurer_name", selectedInsurer.name);
    }
    
    // Reset product selection when insurer changes
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
      // If insured is same as policyholder
      form.setValue("insured_id", clientId);
      form.setValue("insured_name", selectedClient.name);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
            <TabsTrigger value="parties">{t("parties")}</TabsTrigger>
            <TabsTrigger value="financial">{t("financialInfo")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="policy_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("policyNumber")}*</FormLabel>
                    <FormControl>
                      <Input placeholder={t("enterPolicyNumber")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="policy_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("policyType")}*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectPolicyType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">{t("internal")}</SelectItem>
                        <SelectItem value="external">{t("external")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("startDate")}*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("selectDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("expiryDate")}*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("selectDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("start_date");
                            return startDate && date < startDate;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">{t("active")}</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="expired">{t("expired")}</SelectItem>
                      <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("enterNotes")} 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="parties" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("client")}*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleClientChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectClient")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.filter(client => client.is_active).map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="insurer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("insurer")}*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleInsurerChange(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectInsurer")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {insurers.filter(insurer => insurer.is_active).map((insurer) => (
                          <SelectItem key={insurer.id} value={insurer.id}>
                            {insurer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("product")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleProductChange(value);
                      }}
                      defaultValue={field.value}
                      disabled={!selectedInsurerId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            selectedInsurerId 
                              ? t("selectProduct") 
                              : t("selectInsurerFirst")
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.filter(product => product.is_active).map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.code} - {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-6">
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
                          // Recalculate commission amount if percentage exists
                          const percentage = form.getValues("commission_percentage");
                          if (percentage) {
                            const premium = parseFloat(e.target.value);
                            const commission = premium * percentage / 100;
                            // No form field for commission_amount, it will be calculated on submit
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
                          // Recalculate commission amount
                          const premium = form.getValues("premium");
                          const percentage = parseFloat(e.target.value);
                          if (premium && percentage) {
                            const commission = premium * percentage / 100;
                            // No form field for commission_amount, it will be calculated on submit
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isEditing ? updatePolicyMutation.isPending : createPolicyMutation.isPending}>
            {isEditing 
              ? (updatePolicyMutation.isPending ? t("saving") : t("updatePolicy")) 
              : (createPolicyMutation.isPending ? t("creating") : t("createPolicy"))}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PolicyForm;
