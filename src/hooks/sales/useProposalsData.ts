
import { useState, useEffect, useCallback } from 'react';
import { Proposal, ProposalStatus, UseProposalsDataProps } from '@/types/sales';
import { ProposalStats } from '@/types/reports';
import * as proposalService from '@/services/proposalService';

export function useProposalsData({ sales_process_id, status }: UseProposalsDataProps = {}) {
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<ProposalStats>({
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    draft: 0,
    sent: 0,
    viewed: 0
  });
  const [error, setError] = useState<Error | null>(null);
  
  // Calculate statistics based on current proposals
  const calculateStats = (proposals: Proposal[]): ProposalStats => {
    const newStats: ProposalStats = {
      total: proposals.length,
      accepted: 0,
      rejected: 0,
      pending: 0,
      draft: 0,
      sent: 0,
      viewed: 0
    };
    
    proposals.forEach(proposal => {
      if (proposal.status === 'accepted') {
        newStats.accepted++;
      } else if (proposal.status === 'rejected') {
        newStats.rejected++;
      } else if (proposal.status === 'draft') {
        newStats.draft!++;
        newStats.pending++;
      } else if (proposal.status === 'sent') {
        newStats.sent!++;
        newStats.pending++;
      } else if (proposal.status === 'viewed') {
        newStats.viewed!++;
        newStats.pending++;
      } else if (proposal.status === 'expired') {
        newStats.pending++;
      }
    });
    
    return newStats;
  };
  
  // Fetch proposals
  const fetchProposals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await proposalService.getProposals(sales_process_id, status);
      setProposals(data);
      setStats(calculateStats(data));
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch proposals'));
    } finally {
      setLoading(false);
    }
  }, [sales_process_id, status]);
  
  // Update a proposal
  const updateProposal = async (proposalId: string, updates: Partial<Proposal>) => {
    try {
      const updated = await proposalService.updateProposal(proposalId, updates);
      
      setProposals(prev => 
        prev.map(p => p.id === proposalId ? updated : p)
      );
      
      setStats(calculateStats(
        proposals.map(p => p.id === proposalId ? updated : p)
      ));
      
      return updated;
    } catch (err) {
      console.error('Error updating proposal:', err);
      throw err;
    }
  };
  
  // Update proposal status
  const updateProposalStatus = async (proposalId: string, newStatus: ProposalStatus) => {
    try {
      const updated = await proposalService.updateProposalStatus(proposalId, newStatus);
      
      setProposals(prev => 
        prev.map(p => p.id === proposalId ? updated : p)
      );
      
      setStats(calculateStats(
        proposals.map(p => p.id === proposalId ? updated : p)
      ));
      
      return updated;
    } catch (err) {
      console.error('Error updating proposal status:', err);
      throw err;
    }
  };
  
  // Load proposals on component mount and when dependencies change
  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);
  
  return {
    proposals,
    stats,
    loading,
    error,
    refreshProposals: fetchProposals,
    updateProposal,
    updateProposalStatus
  };
}
