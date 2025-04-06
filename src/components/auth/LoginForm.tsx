
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, initiatePasswordReset } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  const from = location.state?.from?.pathname || "/";

  const loginSchema = z.object({
    email: z.string().email(t("invalidEmail")),
    password: z.string().min(1, t("passwordRequired")),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await login?.(values.email, values.password);
      
      if (result && result.error) {
        throw new Error(result.error.message || t("invalidCredentials"));
      }
      
      toast.success(t("loginSuccessful"));
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || t("invalidCredentials"));
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsResetting(true);
    
    try {
      if (initiatePasswordReset) {
        const success = await initiatePasswordReset(resetEmail);
        if (success) {
          setResetPasswordDialogOpen(false);
          toast.success("Password reset email sent. Check your inbox for instructions.");
        } else {
          toast.error("Failed to send password reset email. Please try again.");
        }
      } else {
        toast.error("Password reset functionality is not available");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Failed to send password reset email");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">{t("email")}</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} className="h-11" />
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">{t("password")}</FormLabel>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="px-0 font-normal h-auto"
                    type="button"
                    onClick={() => setResetPasswordDialogOpen(true)}
                  >
                    {t("forgotPassword")}
                  </Button>
                </div>
                <FormControl>
                  <Input type="password" className="h-11" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full h-11 mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </Form>

      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Reset Password</DialogTitle>
            <DialogDescription className="pt-2">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <FormLabel className="text-base">Email</FormLabel>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)}
                className="h-11" 
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={isResetting}>
              {isResetting ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
