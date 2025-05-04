
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/employees";
import { UserRole } from "@/types/auth";

interface EmployeeEditFormProps {
  employee: Employee;
  onSave: (data: any) => void;
  onClose: () => void;
  canAssignAdmin: boolean;
}

// Define form schema for editing employees
const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(['employee', 'admin', 'superAdmin']),
  department: z.string().optional(),
  position: z.string().optional(),
});

const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({ 
  employee, 
  onSave, 
  onClose,
  canAssignAdmin
}) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      role: (employee?.role as UserRole) || "employee",
      department: employee?.department || "",
      position: employee?.position || "",
    }
  });
  
  const handleSubmit = (data: z.infer<typeof employeeFormSchema>) => {
    onSave(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterName")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("enterEmail")} 
                  {...field} 
                  disabled={true} // Email can't be changed once set
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("role")}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectRole")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="employee">{t("employee")}</SelectItem>
                  {canAssignAdmin && (
                    <SelectItem value="admin">{t("admin")}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("department")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterDepartment")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("position")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterPosition")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>{t("cancel")}</Button>
          <Button type="submit">{t("saveChanges")}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EmployeeEditForm;
