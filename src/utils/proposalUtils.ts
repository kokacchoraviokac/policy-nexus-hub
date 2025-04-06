
import { Proposal, ProposalStats, ProposalStatus } from '@/types/reports';

// Initialize default proposal stats
export const initialProposalStats: ProposalStats = {
  totalCount: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  // Legacy fields
  total: 0,
  accepted: 0,
  rejected: 0,
  pending: 0,
  draft: 0,
  sent: 0,
  viewed: 0
};

// Calculate proposal statistics from a list of proposals
export const calculateProposalStats = (proposals: Proposal[]): ProposalStats => {
  const stats: ProposalStats = {
    totalCount: proposals.length,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    // Legacy fields
    total: proposals.length,
    accepted: 0,
    rejected: 0,
    pending: 0,
    draft: 0,
    sent: 0,
    viewed: 0
  };
  
  proposals.forEach(proposal => {
    if (proposal.status === 'accepted' || proposal.status === 'approved') {
      stats.approvedCount++;
      stats.accepted++;
    } else if (proposal.status === 'rejected') {
      stats.rejectedCount++;
      stats.rejected++;
    } else if (proposal.status === 'draft') {
      stats.draft++;
      stats.pending++;
      stats.pendingCount++;
    } else if (proposal.status === 'sent') {
      stats.sent++;
      stats.pending++;
      stats.pendingCount++;
    } else if (proposal.status === 'viewed') {
      stats.viewed++;
      stats.pending++;
      stats.pendingCount++;
    } else if (proposal.status === 'expired') {
      stats.pending++;
      stats.pendingCount++;
    }
  });
  
  return stats;
};

// Filter proposals by status
export const filterProposalsByStatus = (
  proposals: Proposal[], 
  status: ProposalStatus | string
): Proposal[] => {
  if (!status || status === 'all') {
    return proposals;
  }
  
  return proposals.filter(proposal => proposal.status === status);
};

// Get proposals grouped by status
export const getProposalsByStatus = (
  proposals: Proposal[]
): Record<string, Proposal[]> => {
  return proposals.reduce((acc, proposal) => {
    if (!acc[proposal.status]) {
      acc[proposal.status] = [];
    }
    acc[proposal.status].push(proposal);
    return acc;
  }, {} as Record<string, Proposal[]>);
};
