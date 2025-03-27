
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useInsurers } from "@/hooks/useInsurers";

interface ProductFieldsProps {
  form: UseFormReturn<any>;
  codeName?: string;
  nameName?: string;
  categoryName?: string;
  insurerIdName?: string;
  descriptionName?: string;
}

export const ProductFields: React.FC<ProductFieldsProps> = ({
  form,
  codeName = "code",
  nameName = "name",
  categoryName = "category",
  insurerIdName = "insurer_id",
  descriptionName = "description",
}) => {
  const { insurers = [], isLoading: isLoadingInsurers } = useInsurers();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={codeName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Code*</FormLabel>
              <FormControl>
                <Input placeholder="Enter product code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={nameName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name={categoryName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Life, Non-life, Auto" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={insurerIdName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Company*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingInsurers}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an insurance company" />
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
      </div>

      <FormField
        control={form.control}
        name={descriptionName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter product description"
                className="min-h-[100px]"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
