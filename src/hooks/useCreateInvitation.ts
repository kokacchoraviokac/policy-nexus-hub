
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CreateInvitationParams {
  email: string;
  role: string;
  company_id: string;
}

export function useCreateInvitation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createInvitation = async (params: CreateInvitationParams): Promise<string> => {
    setIsSubmitting(true);
    
    try {
      // Validate input
      if (!params.email || !params.role || !params.company_id) {
        throw new Error('Missing required parameters');
      }
      
      // Call API to create invitation
      const { data, error } = await supabase
        .from('invitations')
        .insert({
          email: params.email,
          role: params.role,
          company_id: params.company_id,
          status: 'pending',
          // Set expiry to 7 days from now
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Return the new invitation ID
      return data.id;
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    createInvitation,
    isSubmitting
  };
}
