
// Temporary mock implementation of useClaimService
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useClaimService = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitClaim = async (claimData: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t("claimSubmitted"),
        description: t("claimSubmittedSuccessfully"),
      });
      
      return { success: true, data: { id: 'mock-claim-id', ...claimData } };
    } catch (error) {
      toast({
        title: t("errorSubmittingClaim"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitClaim,
    isSubmitting,
  };
};
