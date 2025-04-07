
import { Proposal, ProposalStatus } from "@/types/sales";
import { supabase } from "@/integrations/supabase/client";

interface ProposalFilterParams {
  status?: ProposalStatus | 'all';
  salesProcessId?: string;
  clientId?: string;
}

export const getProposals = async (params?: ProposalFilterParams) => {
  try {
    let query = supabase
      .from('proposals')
      .select('*');
    
    // Apply filters
    if (params) {
      if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status);
      }
      
      if (params.salesProcessId) {
        query = query.eq('sales_process_id', params.salesProcessId);
      }
      
      if (params.clientId) {
        query = query.eq('client_id', params.clientId);
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return { data: [], error };
  }
};

export const getProposalById = async (proposalId: string) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return { data: null, error };
  }
};

export const createProposal = async (proposal: Partial<Proposal>) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .insert(proposal)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating proposal:', error);
    return { data: null, error };
  }
};

export const updateProposal = async (proposalId: string, updates: Partial<Proposal>) => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', proposalId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating proposal:', error);
    return { data: null, error };
  }
};

export const updateProposalStatus = async (proposalId: string, status: ProposalStatus) => {
  try {
    const updates: Partial<Proposal> = { status };
    
    // Add timestamps based on status
    if (status === ProposalStatus.SENT) {
      updates.sent_at = new Date().toISOString();
    } else if (status === ProposalStatus.VIEWED) {
      updates.viewed_at = new Date().toISOString();
    } else if (status === ProposalStatus.ACCEPTED) {
      updates.accepted_at = new Date().toISOString();
    } else if (status === ProposalStatus.REJECTED) {
      updates.rejected_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', proposalId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating proposal status:', error);
    return { data: null, error };
  }
};

export const deleteProposal = async (proposalId: string) => {
  try {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId);
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return { success: false, error };
  }
};
