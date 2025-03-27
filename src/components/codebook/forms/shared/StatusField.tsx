
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface StatusFieldProps {
  form: UseFormReturn<any>;
  statusName?: string;
  label?: string;
  description?: string;
}

export const StatusField: React.FC<StatusFieldProps> = ({
  form,
  statusName = "is_active",
  label = "Active Status",
  description = "Set whether this entity is active in your system",
}) => {
  return (
    <FormField
      control={form.control}
      name={statusName}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            <div className="text-sm text-muted-foreground">
              {description}
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
  );
};
