
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCompanies } from "@/hooks/useCompanies";
import { useSignup } from "@/hooks/useSignup";
import { useInvitationVerification } from "@/hooks/useInvitationVerification";
import { useCompanySeats } from "@/hooks/useCompanySeats";
import { createSignupSchema, SignupFormValues } from "@/types/auth/signup";
import UserInformation from "./signup/UserInformation";
import CompanySelection from "./signup/CompanySelection";
import InvitationSection from "./signup/InvitationSection";

interface SignupFormProps {
  onSuccess: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const { companies, loading: loadingCompanies } = useCompanies();
  
  const signupSchema = createSignupSchema(t);

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
      invitationToken: "",
    },
  });

  const companyOption = form.watch("companyOption");
  const selectedCompanyId = form.watch("companyId");
  
  const { invitation, verifyingInvitation } = useInvitationVerification(form);
  const companySeatsInfo = useCompanySeats(companies);
  const { isSubmitting, handleSignup } = useSignup(onSuccess);

  // Only show the invitation section if we have a valid invitation
  const showInvitationSection = companyOption === 'invitation' && invitation;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => handleSignup(values, invitation, companySeatsInfo))} className="space-y-4">
        {verifyingInvitation ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">Verifying invitation...</span>
          </div>
        ) : showInvitationSection ? (
          <InvitationSection invitation={invitation} />
        ) : null}

        <UserInformation form={form} t={t} invitation={invitation} />
        
        <CompanySelection 
          form={form}
          t={t}
          companyOption={companyOption}
          selectedCompanyId={selectedCompanyId}
          companies={companies}
          loadingCompanies={loadingCompanies}
          companySeatsInfo={companySeatsInfo}
          invitation={invitation}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || (companyOption === "existing" && selectedCompanyId && companySeatsInfo[selectedCompanyId] && !companySeatsInfo[selectedCompanyId].hasAvailableSeats)}
        >
          {isSubmitting ? t("creatingAccount") : t("createAccount")}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
