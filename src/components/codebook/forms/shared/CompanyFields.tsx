
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface CompanyFieldsProps {
  form: UseFormReturn<any>;
  companyNameName?: string;
  taxIdName?: string;
  registrationNumberName?: string;
  notesName?: string;
  isActiveName?: string;
  required?: boolean;
}

export const CompanyFields: React.FC<CompanyFieldsProps> = ({
  form,
  companyNameName = "name",
  taxIdName = "tax_id",
  registrationNumberName = "registration_number",
  notesName = "notes",
  isActiveName = "is_active",
  required = true,
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name={companyNameName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name{required && "*"}</FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {taxIdName && (
          <FormField
            control={form.control}
            name={taxIdName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tax ID" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name={registrationNumberName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter registration number" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {notesName && (
        <FormField
          control={form.control}
          name={notesName}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter additional notes"
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

      <FormField
        control={form.control}
        name={isActiveName}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Active Status</FormLabel>
              <div className="text-sm text-muted-foreground">
                Set whether this entity is active in your system
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
