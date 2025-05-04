
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
import { UserRole } from "@/types/auth";

interface EmployeeInvitationFormProps {
  onInvite: (email: string, role: string) => void;
  onClose: () => void;
  canAssignAdmin: boolean;
}

// Define form schema for invitations
const invitationFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(['employee', 'admin', 'superAdmin']),
});

const EmployeeInvitationForm: React.FC<EmployeeInvitationFormProps> = ({ 
  onInvite, 
  onClose,
  canAssignAdmin
}) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof invitationFormSchema>>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      email: "",
      role: "employee" as UserRole,
    }
  });
  
  const handleSubmit = (data: z.infer<typeof invitationFormSchema>) => {
    onInvite(data.email, data.role);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterEmail")} {...field} />
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
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onClose}>{t("cancel")}</Button>
          <Button type="submit">{t("sendInvitation")}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EmployeeInvitationForm;
