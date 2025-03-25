
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";
import { useCompanies } from "@/hooks/useCompanies";
import { useInvitations } from "@/hooks/useInvitations";
import { CompanySeatsInfo } from "@/types/company";

export const useSignup = (onSuccess: () => void) => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCompany } = useCompanies();
  const { acceptInvitation } = useInvitations();

  const handleSignup = async (values: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    companyOption: "existing" | "new" | "invitation";
    companyId?: string;
    companyName?: string;
    invitationToken?: string;
  }, invitation: any, companySeatsInfo: Record<string, CompanySeatsInfo>) => {
    setIsSubmitting(true);
    
    try {
      // Check if this is an invitation-based signup
      if (values.companyOption === 'invitation' && invitation) {
        // Additional verification that the email matches the invitation
        if (values.email !== invitation.email) {
          toast.error('The email address does not match the invitation');
          setIsSubmitting(false);
          return;
        }
        
        // Sign up the user
        await signUp(values.email, values.password, {
          name: values.name,
          role: values.role as UserRole,
          companyId: invitation.company_id,
        });
        
        // Accept the invitation
        await acceptInvitation(invitation.token);
        
        toast.success("Sign up successful! Check your email to confirm your account.");
        onSuccess();
        return;
      }
      
      // Check if selected company has available seats for regular signup
      if (values.companyOption === "existing" && values.companyId) {
        const companyInfo = companySeatsInfo[values.companyId];
        
        if (companyInfo && !companyInfo.hasAvailableSeats) {
          toast.error(`This company has reached its seat limit (${companyInfo.seatsLimit}). Please contact a SuperAdmin to increase the limit.`);
          setIsSubmitting(false);
          return;
        }
      }
      
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

  return {
    isSubmitting,
    handleSignup
  };
};
