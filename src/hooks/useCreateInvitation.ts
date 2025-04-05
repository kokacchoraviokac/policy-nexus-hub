
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/auth/AuthContext';

interface InvitationData {
  email: string;
  role: string;
  company_id: string;
}

export const useCreateInvitation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  const createInvitation = async (data: InvitationData) => {
    if (!user) {
      throw new Error(t('notAuthenticated'));
    }

    setIsSubmitting(true);
    try {
      // Calculate expiry date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);

      // Create invitation record
      const { data: invitation, error } = await supabase
        .from('invitations')
        .insert({
          email: data.email,
          role: data.role,
          company_id: data.company_id,
          token,
          status: 'pending',
          created_by: user.id,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Here you'd typically send an email with the invitation link
      // This would be handled by a server function in production
      console.log('Invitation created:', invitation);

      return invitation;
    } catch (error) {
      console.error('Error creating invitation:', error);
      let errorMessage = t('errorCreatingInvitation');
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createInvitation, isSubmitting };
};
