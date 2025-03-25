
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const PasswordResetForm: React.FC = () => {
  const { user, initiatePasswordReset } = useAuth();
  const [isRequestingReset, setIsRequestingReset] = useState(false);
  
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });
  
  const handlePasswordReset = async (values: EmailFormValues) => {
    setIsRequestingReset(true);
    try {
      await initiatePasswordReset(values.email);
    } finally {
      setIsRequestingReset(false);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Password Reset</h3>
      </div>
      
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          A password reset link will be sent to your email address.
          The link will expire after 24 hours.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            variant="outline" 
            disabled={isRequestingReset}
          >
            {isRequestingReset ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordResetForm;
