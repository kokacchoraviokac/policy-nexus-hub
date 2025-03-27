
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Add this import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useInsurers } from "@/hooks/useInsurers";
import { MultilingualField } from "./MultilingualField";

interface ProductFieldsProps {
  form: UseFormReturn<any>;
  codeName?: string;
  nameName?: string;
  nameTranslationsName?: string;
  categoryName?: string;
  categoryTranslationsName?: string;
  insurerIdName?: string;
  descriptionName?: string;
  descriptionTranslationsName?: string;
  preselectedInsurerId?: string;
  preselectedInsurerName?: string;
  enableMultilingual?: boolean;
}

export const ProductFields: React.FC<ProductFieldsProps> = ({
  form,
  codeName = "code",
  nameName = "name",
  nameTranslationsName = "name_translations",
  categoryName = "category",
  categoryTranslationsName = "category_translations",
  insurerIdName = "insurer_id",
  descriptionName = "description",
  descriptionTranslationsName = "description_translations",
  preselectedInsurerId,
  preselectedInsurerName,
  enableMultilingual = true,
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

        {enableMultilingual ? (
          <div className="md:col-span-2">
            <MultilingualField
              form={form}
              name={nameName}
              translationsName={nameTranslationsName}
              label="Product Name*"
              placeholder="Enter product name"
            />
          </div>
        ) : (
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
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {enableMultilingual ? (
          <MultilingualField
            form={form}
            name={categoryName}
            translationsName={categoryTranslationsName}
            label="Category"
            placeholder="E.g., Life, Non-life, Auto"
          />
        ) : (
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
        )}

        <FormField
          control={form.control}
          name={insurerIdName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Company*</FormLabel>
              {preselectedInsurerId && preselectedInsurerName ? (
                <Input 
                  value={preselectedInsurerName} 
                  disabled={true}
                  className="bg-muted"
                />
              ) : (
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
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {enableMultilingual ? (
        <MultilingualField
          form={form}
          name={descriptionName}
          translationsName={descriptionTranslationsName}
          label="Description"
          placeholder="Enter product description"
          multiline={true}
        />
      ) : (
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
      )}
    </>
  );
};
