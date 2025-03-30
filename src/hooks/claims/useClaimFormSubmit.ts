
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ClaimFormValues } from '@/components/claims/forms/ClaimDetailsForm';

interface UseClaimFormSubmitProps {
  currentUser: any;
  userProfile: any;
}

export const useClaimFormSubmit = ({ currentUser, userProfile }: UseClaimFormSubmitProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { mutate: createClaim, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: ClaimFormValues) => {
      if (!currentUser?.id || !userProfile?.company_id) {
        throw new Error("User information is missing");
      }

      // Prepare claim data with all required fields
      const claimData = {
        reported_by: currentUser.id,
        company_id: userProfile.company_id,
        policy_id: values.policy_id,
        claim_number: values.claim_number,
        damage_description: values.damage_description,
        incident_date: values.incident_date,
        claimed_amount: values.claimed_amount,
        status: values.status,
        deductible: values.deductible || null,
        notes: values.notes || null
      };
      
      const { data, error } = await supabase
        .from('claims')
        .insert(claimData)
        .select('id')
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: t("claimCreated"),
        description: t("claimCreatedSuccessfully"),
      });
      
      queryClient.invalidateQueries({ queryKey: ['policy-claims'] });
      
      // Navigate to the claim detail page
      navigate(`/claims/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating claim:", error);
      toast({
        title: t("errorCreatingClaim"),
        description: t("errorCreatingClaimDescription"),
        variant: "destructive",
      });
    }
  });

  return {
    createClaim,
    isSubmitting
  };
};
