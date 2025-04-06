
import { Proposal } from "@/types/reports";
import { ProposalStats, ProposalStatus } from "@/types/sales";

/**
 * Calculate statistics for a list of proposals
 */
export const calculateProposalStats = (proposals: Proposal[]): ProposalStats => {
  // Initialize stats
  const stats: ProposalStats = {
    total: proposals.length,
    draft: 0,
    sent: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
    pending: 0,
    viewed: 0,
    approved: 0
  };

  // Count proposals by status
  proposals.forEach(proposal => {
    switch (proposal.status) {
      case ProposalStatus.DRAFT:
        stats.draft++;
        break;
      case ProposalStatus.SENT:
        stats.sent++;
        break;
      case ProposalStatus.ACCEPTED:
        stats.accepted++;
        break;
      case ProposalStatus.REJECTED:
        stats.rejected++;
        break;
      case ProposalStatus.EXPIRED:
        stats.expired++;
        break;
      case ProposalStatus.VIEWED:
        stats.viewed++;
        break;
      case ProposalStatus.APPROVED:
        stats.approved++;
        break;
      case ProposalStatus.PENDING:
        stats.pending++;
        break;
      default:
        // Ignore unknown statuses
        break;
    }
  });

  return stats;
};

/**
 * Get badge variant for a proposal status
 */
export const getProposalStatusBadgeVariant = (status: ProposalStatus): string => {
  switch (status) {
    case ProposalStatus.DRAFT:
      return "secondary";
    case ProposalStatus.SENT:
      return "info";
    case ProposalStatus.VIEWED:
      return "info";
    case ProposalStatus.ACCEPTED:
      return "success";
    case ProposalStatus.REJECTED:
      return "destructive";
    case ProposalStatus.APPROVED:
      return "success";
    case ProposalStatus.PENDING:
      return "warning";
    case ProposalStatus.EXPIRED:
      return "default";
    default:
      return "default";
  }
};

/**
 * Determine if a proposal status allows editing
 */
export const canEditProposal = (status: ProposalStatus): boolean => {
  return status === ProposalStatus.DRAFT;
};
