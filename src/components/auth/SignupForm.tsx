
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserRole } from "@/types/auth";
import { useCompanies, Company } from "@/hooks/useCompanies";

const createSignupSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, t("nameRequired")),
  email: z.string().email(t("invalidEmail")),
  password: z.string().min(6, t("passwordMinLength")),
  role: z.enum(["superAdmin", "admin", "employee"] as const),
  companyOption: z.enum(["existing", "new"]),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.companyOption === "existing") {
    return !!data.companyId;
  }
  return true;
}, {
  message: "companyRequired",
  path: ["companyId"]
}).refine((data) => {
  if (data.companyOption === "new") {
    return !!data.companyName && data.companyName.length >= 2;
  }
  return true;
}, {
  message: "companyRequired",
  path: ["companyName"]
});

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { companies, loading: loadingCompanies, createCompany } = useCompanies();

  const signupSchema = createSignupSchema(t);
  type SignupFormValues = z.infer<typeof signupSchema>;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "employee",
      companyOption: "existing",
      companyId: "",
      companyName: "",
    },
  });

  const companyOption = form.watch("companyOption");

  const handleSignup = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    
    try {
      let companyId = values.companyId;
      
      // If creating a new company, create it first
      if (values.companyOption === "new" && values.companyName) {
        const newCompanyId = await createCompany(values.companyName);
        if (!newCompanyId) {
          throw new Error("Failed to create company");
        }
        companyId = newCompanyId;
      }
      
      // Now sign up the user with the company ID
      await signUp(values.email, values.password, {
        name: values.name,
        role: values.role as UserRole,
        companyId: companyId,
      });
      
      toast.success("Sign up successful! Check your email to confirm your account.");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">{t("employee")}</SelectItem>
                    <SelectItem value="admin">{t("brokerAdmin")}</SelectItem>
                    <SelectItem value="superAdmin">{t("superAdmin")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="companyOption"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{t("company")}</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="existing" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("existingCompany")}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="new" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {t("newCompany")}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {companyOption === "existing" && (
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("selectCompany")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCompany")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingCompanies ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : companies.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No companies found
                      </SelectItem>
                    ) : (
                      companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {companyOption === "new" && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("companyName")}</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? t("creatingAccount") : t("createAccount")}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
