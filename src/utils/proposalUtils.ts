
import { Proposal, ProposalStatus } from "@/types/sales";

// Define ProposalStats interface
export interface ProposalStats {
  total: number;
  draft: number;
  pending: number;
  accepted: number;
  rejected: number;
  expired: number;
  sent: number;
  viewed: number;
  approved: number;
}

/**
 * Calculate proposal statistics from an array of proposals
 * @param proposals - Array of proposals to analyze
 * @returns Object with count by status
 */
export function calculateProposalStats(proposals: Proposal[]): ProposalStats {
  const stats: ProposalStats = {
    total: proposals.length,
    draft: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
    sent: 0,
    viewed: 0,
    approved: 0
  };

  proposals.forEach(proposal => {
    switch (proposal.status) {
      case ProposalStatus.DRAFT:
        stats.draft++;
        break;
      case ProposalStatus.PENDING:
        stats.pending++;
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
      case ProposalStatus.SENT:
        stats.sent++;
        break;
      case ProposalStatus.VIEWED:
        stats.viewed++;
        break;
      case ProposalStatus.APPROVED:
        stats.approved++;
        break;
      default:
        // Handle other statuses if needed
        break;
    }
  });

  return stats;
}

/**
 * Get a variant color for a proposal status badge
 * @param status - The proposal status
 * @returns A string representing the badge variant
 */
export function getProposalStatusVariant(status: ProposalStatus): string {
  switch (status) {
    case ProposalStatus.DRAFT:
      return "outline";
    case ProposalStatus.PENDING:
      return "secondary";
    case ProposalStatus.ACCEPTED:
      return "success";
    case ProposalStatus.REJECTED:
      return "destructive";
    case ProposalStatus.EXPIRED:
      return "warning";
    case ProposalStatus.SENT:
      return "info";
    case ProposalStatus.VIEWED:
      return "info";
    case ProposalStatus.APPROVED:
      return "success";
    default:
      return "default";
  }
}
