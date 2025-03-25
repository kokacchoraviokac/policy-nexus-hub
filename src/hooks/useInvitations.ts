
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Invitation, CreateInvitationRequest } from '@/types/invitation';
import { toast } from 'sonner';

export const useInvitations = () => {
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const getInvitations = async (company_id?: string) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If company_id provided, filter by it (for admin users)
      if (company_id) {
        query = query.eq('company_id', company_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setInvitations(data || []);
      return data;
    } catch (error: any) {
      toast.error(`Failed to fetch invitations: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async (invitationData: CreateInvitationRequest) => {
    setLoading(true);
    
    try {
      // Generate a random token (in a real app, might want to use a more secure method)
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Calculate expiry date (default: 7 days)
      const expiryDays = invitationData.expiry_days || 7;
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + expiryDays);
      
      const { data, error } = await supabase
        .from('invitations')
        .insert([
          {
            email: invitationData.email,
            role: invitationData.role,
            company_id: invitationData.company_id,
            token,
            expires_at: expires_at.toISOString(),
          }
        ])
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Send the invitation email
      if (data) {
        await sendInvitationEmail(data.id);
      }
      
      // Refresh invitations list
      getInvitations(invitationData.company_id);
      
      toast.success(`Invitation sent to ${invitationData.email}`);
      return data;
    } catch (error: any) {
      toast.error(`Failed to create invitation: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendInvitationEmail = async (invitation_id: string) => {
    try {
      // Call the Supabase Edge Function to send the invitation email
      const { data, error } = await supabase.functions.invoke('send-invitation-email', {
        body: { invitation_id },
      });

      if (error) {
        console.error('Error sending invitation email:', error);
        return false;
      }

      return data.success;
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      return false;
    }
  };

  const deleteInvitation = async (id: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setInvitations(invitations.filter(inv => inv.id !== id));
      
      toast.success('Invitation deleted successfully');
      return true;
    } catch (error: any) {
      toast.error(`Failed to delete invitation: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkInvitation = async (token: string): Promise<Invitation | null> => {
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error) {
        console.error("Invitation check error:", error);
        return null;
      }
      
      return data as Invitation;
    } catch (error) {
      console.error("Error checking invitation:", error);
      return null;
    }
  };

  const acceptInvitation = async (token: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('token', token);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      return false;
    }
  };

  return {
    loading,
    invitations,
    getInvitations,
    createInvitation,
    deleteInvitation,
    checkInvitation,
    acceptInvitation,
    sendInvitationEmail
  };
};
