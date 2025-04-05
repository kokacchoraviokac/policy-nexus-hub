
import { Proposal, ProposalStatus } from "@/types/sales";
import { formatDateToLocal } from "./dateUtils";

export const getProposalStatusColor = (status: ProposalStatus): string => {
  const colors = {
    draft: "bg-gray-100 text-gray-800 border-gray-200",
    sent: "bg-blue-100 text-blue-800 border-blue-200",
    viewed: "bg-purple-100 text-purple-800 border-purple-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    expired: "bg-amber-100 text-amber-800 border-amber-200"
  };
  
  return colors[status] || colors.draft;
};

export const getSalesProcessFromProposal = (proposal: Proposal): string => {
  return proposal.sales_process_id || "N/A";
};

export const formatProposalAmount = (proposal: Proposal): string => {
  if (!proposal.total_value) return "N/A";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: proposal.currency || 'EUR'
  }).format(proposal.total_value);
};

export const getProposalDisplayInfo = (proposal: Proposal): string => {
  const clientInfo = proposal.client_name || "N/A";
  const insurerInfo = proposal.insurerName ? ` - ${proposal.insurerName}` : "";
  
  return `${clientInfo}${insurerInfo}`;
};

export const getSortedProposals = (proposals: Proposal[], sortBy: keyof Proposal = "created_at", sortOrder: "asc" | "desc" = "desc"): Proposal[] => {
  return [...proposals].sort((a, b) => {
    const valueA = a[sortBy] || "";
    const valueB = b[sortBy] || "";
    
    if (typeof valueA === "string" && typeof valueB === "string") {
      if (sortOrder === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    }
    
    if (typeof valueA === "number" && typeof valueB === "number") {
      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    }
    
    return 0;
  });
};

export const filterProposals = (
  proposals: Proposal[],
  { statusFilter = "", clientNameFilter = "", searchQuery = "" }: { statusFilter?: string; clientNameFilter?: string; searchQuery?: string }
): Proposal[] => {
  return proposals.filter((proposal) => {
    // Status filter
    if (statusFilter && proposal.status !== statusFilter) {
      return false;
    }
    
    // Client name filter
    if (clientNameFilter && !proposal.client_name.toLowerCase().includes(clientNameFilter.toLowerCase())) {
      return false;
    }
    
    // Search query (checks title, description, and reference)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = proposal.title.toLowerCase().includes(query);
      const matchesDescription = proposal.description?.toLowerCase().includes(query) || false;
      
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }
    
    return true;
  });
};
