
import { useState, useEffect, useCallback } from 'react';
import { Proposal, ProposalStatus, ProposalStats, UseProposalsDataProps } from '@/types/sales';
import { getProposals, updateProposalStatus as apiUpdateProposalStatus } from '@/services/proposalService';
import { mockProposals } from '@/data/mockProposals';
import { calculateProposalStats } from '@/utils/proposalUtils';

export function useProposalsData(props: UseProposalsDataProps = {}) {
  const { sales_process_id, searchQuery, statusFilter } = props;
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<ProposalStats>({
    totalCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    total: 0,
    accepted: 0,
    rejected: 0,
    draft: 0,
    pending: 0,
    sent: 0,
    viewed: 0,
    approved: 0,
    expired: 0
  });
  
  // Calculate proposal counts by status
  const proposalsByStatus = {
    draft: proposals.filter(p => p.status === ProposalStatus.DRAFT).length,
    pending: proposals.filter(p => p.status === ProposalStatus.PENDING).length,
    sent: proposals.filter(p => p.status === ProposalStatus.SENT).length,
    viewed: proposals.filter(p => p.status === ProposalStatus.VIEWED).length,
    accepted: proposals.filter(p => p.status === ProposalStatus.ACCEPTED).length,
    rejected: proposals.filter(p => p.status === ProposalStatus.REJECTED).length,
    approved: proposals.filter(p => p.status === ProposalStatus.APPROVED).length,
    expired: proposals.filter(p => p.status === ProposalStatus.EXPIRED).length
  };
  
  const refreshProposals = useCallback(async () => {
    setLoading(true);
    try {
      let data: Proposal[];
      
      // In production, use the API call
      // const { data: apiData } = await getProposals({ sales_process_id, status: statusFilter });
      // data = apiData;
      
      // For development/testing use mock data
      data = [...mockProposals];
      
      // Filter by sales process if specified
      if (sales_process_id) {
        data = data.filter(p => p.sales_process_id === sales_process_id);
      }
      
      // Apply search filter if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        data = data.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.client_name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
        );
      }
      
      // Apply status filter if provided and not 'all'
      if (statusFilter && statusFilter !== 'all') {
        data = data.filter(p => p.status.toString().toLowerCase() === statusFilter.toLowerCase());
      }
      
      setProposals(data);
      
      // Calculate statistics
      const calculatedStats = calculateProposalStats(data);
      setStats(calculatedStats);
      
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching proposals:', err);
    } finally {
      setLoading(false);
    }
  }, [sales_process_id, searchQuery, statusFilter]);
  
  useEffect(() => {
    refreshProposals();
  }, [refreshProposals]);
  
  const updateProposal = async (proposalId: string, updates: Partial<Proposal>) => {
    try {
      // In production, make API call to update the proposal
      // await apiUpdateProposal(proposalId, updates);
      
      // For development/testing, update local state
      setProposals(prevProposals => 
        prevProposals.map(p => 
          p.id === proposalId ? { ...p, ...updates } : p
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating proposal:', err);
      return false;
    }
  };
  
  const updateProposalStatus = async (proposalId: string, newStatus: ProposalStatus) => {
    try {
      // In production, make API call to update status
      // await apiUpdateProposalStatus(proposalId, newStatus);
      
      // For development/testing, update local state
      setProposals(prevProposals => 
        prevProposals.map(p => 
          p.id === proposalId ? { ...p, status: newStatus } : p
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating proposal status:', err);
      return false;
    }
  };
  
  // Function to create a new proposal
  const createProposal = async (proposal: Proposal) => {
    try {
      // In production, make API call to create the proposal
      // const { data } = await apiCreateProposal(proposal);
      
      // For development/testing, update local state
      const newProposal = {
        ...proposal,
        id: `proposal-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProposals(prevProposals => [...prevProposals, newProposal]);
      
      return true;
    } catch (err) {
      console.error('Error creating proposal:', err);
      return false;
    }
  };
  
  return {
    proposals,
    stats,
    loading,
    error,
    refreshProposals,
    updateProposal,
    updateProposalStatus,
    createProposal,
    proposalsByStatus,
    isLoading: loading
  };
}
