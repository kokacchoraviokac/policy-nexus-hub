
import { Proposal, ProposalStats, ProposalStatus } from "@/types/reports";

/**
 * Returns default proposal statistics with zeroed values
 */
export const getDefaultProposalStats = (): ProposalStats => ({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  draft: 0,
  sent: 0,
  viewed: 0,
  accepted: 0,
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  totalCount: 0
});

/**
 * Calculates proposal statistics based on an array of proposals
 */
export const calculateProposalStats = (proposals: Proposal[]): ProposalStats => {
  const stats: ProposalStats = {
    total: proposals.length,
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
    sent: 0,
    viewed: 0,
    accepted: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalCount: proposals.length
  };

  // Count proposals by status
  proposals.forEach(proposal => {
    switch (proposal.status) {
      case 'approved':
        stats.approved++;
        stats.approvedCount++;
        break;
      case 'accepted':
        stats.accepted++;
        break;
      case 'rejected':
        stats.rejected++;
        stats.rejectedCount++;
        break;
      case 'draft':
        stats.draft++;
        break;
      case 'pending':
        stats.pending++;
        stats.pendingCount++;
        break;
      case 'sent':
        stats.sent++;
        break;
      case 'viewed':
        stats.viewed++;
        break;
      default:
        stats.pendingCount++;
        break;
    }
  });

  return stats;
};

/**
 * Groups proposals by their status
 */
export const groupProposalsByStatus = (
  proposals: Proposal[]
): Record<ProposalStatus, Proposal[]> => {
  return proposals.reduce((grouped, proposal) => {
    const status = proposal.status as ProposalStatus;
    if (!grouped[status]) {
      grouped[status] = [];
    }
    grouped[status].push(proposal);
    return grouped;
  }, {} as Record<ProposalStatus, Proposal[]>);
};

/**
 * Calculates total value of proposals by status
 */
export const calculateProposalValueByStatus = (
  proposals: Proposal[]
): Record<ProposalStatus, number> => {
  const valueByStatus: Record<ProposalStatus, number> = {
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    expired: 0
  };

  proposals.forEach(proposal => {
    const status = proposal.status as ProposalStatus;
    valueByStatus[status] = (valueByStatus[status] || 0) + proposal.amount;
  });

  return valueByStatus;
};
