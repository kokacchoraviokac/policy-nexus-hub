
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { ClaimFormValues } from '@/components/claims/forms/ClaimDetailsForm';

interface UseClaimFormSubmitProps {
  currentUser: any;
  userProfile: any;
  onSuccess?: () => void;
}

export const useClaimFormSubmit = ({ currentUser, userProfile, onSuccess }: UseClaimFormSubmitProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      
      // Type assertion to handle the complex type requirements of Supabase
      const { data, error } = await supabase
        .from('claims')
        .insert(claimData as any)
        .select('id')
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(t("claimCreated"), {
        description: t("claimCreatedSuccessfully")
      });
      
      queryClient.invalidateQueries({ queryKey: ['policy-claims'] });
      
      // Call the provided onSuccess callback if it exists
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the claim detail page only if no custom onSuccess was provided
        navigate(`/claims/${data.id}`);
      }
    },
    onError: (error) => {
      console.error("Error creating claim:", error);
      toast.error(t("errorCreatingClaim"), {
        description: t("errorCreatingClaimDescription")
      });
    }
  });

  return {
    createClaim,
    isSubmitting
  };
};
