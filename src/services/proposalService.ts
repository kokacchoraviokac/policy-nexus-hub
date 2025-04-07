
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalStatus } from "@/types/sales";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export const fetchProposals = async (
  filterParams: { status?: string; client_id?: string; sales_process_id?: string } = {}
): Promise<Proposal[]> => {
  try {
    let query = supabase
      .from('sales_proposals') // Use the correct table name that exists in your Supabase instance
      .select('*');

    // Apply filters if provided
    if (filterParams.status && filterParams.status !== 'all') {
      query = query.eq('status', filterParams.status);
    }

    if (filterParams.client_id) {
      query = query.eq('client_id', filterParams.client_id);
    }

    if (filterParams.sales_process_id) {
      query = query.eq('sales_process_id', filterParams.sales_process_id);
    }

    // Order by created_at date, newest first
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching proposals:', error);
      throw new Error(error.message);
    }

    return data as Proposal[];
  } catch (error) {
    console.error('Error in fetchProposals:', error);
    throw error;
  }
};

export const createProposal = async (proposal: Partial<Proposal>): Promise<Proposal> => {
  try {
    // Create the proposal in the database
    const { data, error } = await supabase
      .from('sales_proposals')
      .insert({
        ...proposal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating proposal:', error);
      throw new Error(error.message);
    }

    return data as Proposal;
  } catch (error) {
    console.error('Error in createProposal:', error);
    throw error;
  }
};

export const updateProposalStatus = async (
  proposalId: string,
  status: ProposalStatus
): Promise<Proposal> => {
  try {
    // Prepare update data with status-specific timestamps
    const updateData: Partial<Proposal> = {
      status,
      updated_at: new Date().toISOString()
    };

    // Add status-specific timestamps
    if (status === ProposalStatus.ACCEPTED) {
      updateData.accepted_at = new Date().toISOString();
    } else if (status === ProposalStatus.REJECTED) {
      updateData.rejected_at = new Date().toISOString();
    } else if (status === ProposalStatus.SENT) {
      updateData.sent_at = new Date().toISOString();
    } else if (status === ProposalStatus.VIEWED) {
      updateData.viewed_at = new Date().toISOString();
    }

    // Update the proposal in the database
    const { data, error } = await supabase
      .from('sales_proposals')
      .update(updateData)
      .eq('id', proposalId)
      .select()
      .single();

    if (error) {
      console.error('Error updating proposal status:', error);
      throw new Error(error.message);
    }

    return data as Proposal;
  } catch (error) {
    console.error('Error in updateProposalStatus:', error);
    throw error;
  }
};

export const getProposalById = async (proposalId: string): Promise<Proposal | null> => {
  try {
    const { data, error } = await supabase
      .from('sales_proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching proposal:', error);
      throw new Error(error.message);
    }

    return data as Proposal;
  } catch (error) {
    console.error('Error in getProposalById:', error);
    throw error;
  }
};

// Hook for using proposals with React Query and toast notifications
export const useProposalService = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const updateStatus = async (proposalId: string, status: ProposalStatus): Promise<boolean> => {
    try {
      await updateProposalStatus(proposalId, status);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['proposals']);
      
      return true;
    } catch (error) {
      console.error('Error updating proposal status:', error);
      toast.error(`Failed to update proposal status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  return {
    fetchProposals,
    createProposal,
    updateStatus,
    getProposalById
  };
};
