
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalStatus } from "@/types/sales";
import { ServiceResponse } from "@/types/common";

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
    // For now, return mock data
    // In a real implementation, this would query the Supabase database
    
    // Start building query - commented out until proposals table is created
    /*
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
    */
    
    // Return empty array for now
    return [];
  } catch (error) {
    console.error('Error in fetchProposals:', error);
    // Return empty array
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
    
    // Use mock data for now
    // Return a mock proposal with the data that was passed in
    return {
      id: Math.random().toString(36).substring(2, 15),
      title: proposal.title || 'Untitled Proposal',
      description: proposal.description || '',
      client_name: 'Client Name',
      client_id: proposal.client_id || '',
      insurer_name: 'Insurer Name',
      insurer_id: proposal.insurer_id || '',
      sales_process_id: proposal.sales_process_id || '',
      amount: proposal.amount || 0,
      currency: proposal.currency || 'EUR',
      created_at: now,
      updated_at: now,
      status: proposal.status || ProposalStatus.DRAFT,
      created_by: proposal.created_by || '',
      company_id: proposal.company_id || '',
      is_latest: true
    };
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
    /*
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
    */
    
    // For now, return null to indicate proposal not found
    return null;
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
    
    /*
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
    */
    
    // Return mock data for now
    return {
      id: proposalId,
      title: 'Mock Proposal',
      client_name: 'Mock Client',
      client_id: 'client-id',
      insurer_name: 'Mock Insurer',
      insurer_id: 'insurer-id',
      sales_process_id: 'sales-id',
      description: 'Mock description',
      amount: 1000,
      currency: 'EUR',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: status,
      created_by: 'user-id',
      company_id: 'company-id',
      is_latest: true
    };
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
