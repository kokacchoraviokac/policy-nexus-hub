
import { Proposal, ProposalStatus } from "@/types/sales";
import { mockProposals } from "@/data/mockProposals";

/**
 * Fetch proposals (currently using mock data)
 */
export const fetchProposals = async (): Promise<Proposal[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would make an actual API call
  return mockProposals;
};

/**
 * Create a new proposal
 */
export const createProposal = async (proposal: Proposal): Promise<Proposal> => {
  // In a real implementation, this would make an API call
  // For now, just return the proposal as if it was successfully created
  return proposal;
};

/**
 * Update proposal status
 */
export const updateProposalStatus = async (
  proposalId: string, 
  status: ProposalStatus
): Promise<void> => {
  // In a real implementation, this would make an API call
  // For now, just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Delete a proposal
 */
export const deleteProposal = async (proposalId: string): Promise<void> => {
  // In a real implementation, this would make an API call
  // For now, just simulate a delay
  await new Promise(resolve => setTimeout(resolve, 500));
};
