
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalStatus } from "@/types/sales";

/**
 * Fetch all proposals with optional filtering
 */
export const fetchProposals = async (
  companyId?: string,
  salesProcessId?: string,
  statusFilter?: string,
  searchQuery?: string
): Promise<Proposal[]> => {
  try {
    // Start building query
    let query = supabase
      .from('proposals')
      .select('*');
    
    // Apply filters if provided
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    if (salesProcessId) {
      query = query.eq('sales_process_id', salesProcessId);
    }
    
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }
    
    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
    
    // Return the data as Proposal[]
    return data as Proposal[];
  } catch (error) {
    console.error('Error in fetchProposals:', error);
    // Return mock data for now
    return [];
  }
};

/**
 * Create a new proposal
 */
export const createProposal = async (proposal: Partial<Proposal>): Promise<Proposal> => {
  try {
    // Add timestamps
    const now = new Date().toISOString();
    const newProposal = {
      ...proposal,
      created_at: now,
      updated_at: now
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('proposals')
      .insert(newProposal)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
    
    return data as Proposal;
  } catch (error) {
    console.error('Error in createProposal:', error);
    throw error;
  }
};

/**
 * Get proposal by ID
 */
export const getProposalById = async (proposalId: string): Promise<Proposal | null> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      console.error('Error fetching proposal:', error);
      throw error;
    }
    
    return data as Proposal;
  } catch (error) {
    console.error('Error in getProposalById:', error);
    throw error;
  }
};

/**
 * Update proposal status
 */
export const updateProposalStatus = async (
  proposalId: string,
  status: ProposalStatus
): Promise<Proposal> => {
  try {
    // Prepare update data
    const updateData: Partial<Proposal> = {
      status,
      updated_at: new Date().toISOString()
    };
    
    // Add status-specific timestamps
    if (status === ProposalStatus.ACCEPTED) {
      updateData.accepted_at = new Date().toISOString();
    } else if (status === ProposalStatus.REJECTED) {
      updateData.rejected_at = new Date().toISOString();
    }
    
    // Update the proposal
    const { data, error } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', proposalId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating proposal status:', error);
      throw error;
    }
    
    return data as Proposal;
  } catch (error) {
    console.error('Error in updateProposalStatus:', error);
    throw error;
  }
};

/**
 * Get proposal statistics
 */
export const getProposalStats = async (companyId: string): Promise<{
  total: number;
  draft: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  sent: number;
  viewed: number;
  approved: number;
}> => {
  try {
    // For now, return mock stats
    return {
      total: 120,
      draft: 15,
      pending: 35,
      accepted: 42,
      rejected: 18,
      expired: 5,
      sent: 40,
      viewed: 30,
      approved: 45
    };
  } catch (error) {
    console.error('Error getting proposal stats:', error);
    throw error;
  }
};
