
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useInvitations } from "@/hooks/useInvitations";
import { SignupFormValues } from "@/types/auth/signup";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";

export const useInvitationVerification = (
  form: ReturnType<typeof useForm<SignupFormValues>>
) => {
  const [invitation, setInvitation] = useState<any>(null);
  const [verifyingInvitation, setVerifyingInvitation] = useState(false);
  const location = useLocation();
  const { checkInvitation } = useInvitations();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      setVerifyingInvitation(true);
      form.setValue('invitationToken', token);
      form.setValue('companyOption', 'invitation');
      
      checkInvitation(token).then(invitationData => {
        if (invitationData) {
          setInvitation(invitationData);
          form.setValue('email', invitationData.email);
          form.setValue('role', invitationData.role as UserRole);
          form.setValue('companyId', invitationData.company_id);
          
          // Remove token from URL without refreshing
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.toString());
        } else {
          toast.error('Invalid or expired invitation token');
        }
        setVerifyingInvitation(false);
      });
    }
  }, [location.search]);

  return {
    invitation,
    verifyingInvitation
  };
};
