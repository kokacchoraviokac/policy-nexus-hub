
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Employee {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  position?: string;
  is_active?: boolean;
}

interface EmployeeFormProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onInvite: (email: string, role: string) => void;
}

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  department: z.string().optional(),
  position: z.string().optional(),
});

const invitationFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
});

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  employee, 
  isOpen, 
  onClose, 
  onSave,
  onInvite
}) => {
  const { t } = useLanguage();
  const { hasPrivilege } = useAuth();
  const isEditing = !!employee;
  
  const employeeForm = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee?.name || "",
      email: employee?.email || "",
      role: employee?.role || "employee",
      department: employee?.department || "",
      position: employee?.position || "",
    }
  });

  const invitationForm = useForm<z.infer<typeof invitationFormSchema>>({
    resolver: zodResolver(invitationFormSchema),
    defaultValues: {
      email: "",
      role: "employee",
    }
  });
  
  const handleSaveEmployee = (data: z.infer<typeof employeeFormSchema>) => {
    onSave(data);
  };
  
  const handleInviteEmployee = (data: z.infer<typeof invitationFormSchema>) => {
    onInvite(data.email, data.role);
  };
  
  // Check if user can assign admin roles
  const canAssignAdmin = hasPrivilege('users:assign-admin');
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editEmployee") : t("addEmployee")}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t("updateEmployeeInformation") 
              : t("addNewEmployeeOrSendInvitation")}
          </DialogDescription>
        </DialogHeader>
        
        {isEditing ? (
          <Form {...employeeForm}>
            <form onSubmit={employeeForm.handleSubmit(handleSaveEmployee)} className="space-y-4">
              <FormField
                control={employeeForm.control}
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
                control={employeeForm.control}
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
                control={employeeForm.control}
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
                control={employeeForm.control}
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
                control={employeeForm.control}
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
        ) : (
          <Tabs defaultValue="invite">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="invite">{t("sendInvitation")}</TabsTrigger>
              <TabsTrigger value="manual">{t("manualEntry")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invite" className="mt-4">
              <Form {...invitationForm}>
                <form onSubmit={invitationForm.handleSubmit(handleInviteEmployee)} className="space-y-4">
                  <FormField
                    control={invitationForm.control}
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
                    control={invitationForm.control}
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
            </TabsContent>
            
            <TabsContent value="manual" className="mt-4">
              <Form {...employeeForm}>
                <form onSubmit={employeeForm.handleSubmit(handleSaveEmployee)} className="space-y-4">
                  <FormField
                    control={employeeForm.control}
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
                    control={employeeForm.control}
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
                    control={employeeForm.control}
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
                    <Button type="submit">{t("createEmployee")}</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
