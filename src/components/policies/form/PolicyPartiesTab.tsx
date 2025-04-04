
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PolicyFormValues } from "@/schemas/policySchemas";

interface PolicyPartiesTabProps {
  form: UseFormReturn<PolicyFormValues>;
  clients: any[];
  insurers: any[];
  products: any[];
  selectedInsurerId?: string;
  onInsurerChange: (insurerId: string) => void;
  onClientChange: (clientId: string) => void;
  onProductChange: (productId: string) => void;
}

const PolicyPartiesTab: React.FC<PolicyPartiesTabProps> = ({
  form,
  clients,
  insurers,
  products,
  selectedInsurerId,
  onInsurerChange,
  onClientChange,
  onProductChange,
}) => {
  const { t } = useLanguage();

  return (
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
                onClientChange(value);
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
                onInsurerChange(value);
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
                onProductChange(value);
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
  );
};

export default PolicyPartiesTab;
