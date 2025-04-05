
import { Proposal, ProposalStatus } from "@/types/sales";
import { generateRandomId } from "@/utils/helpers";
import mockProposals from "@/data/mockProposals";

// Since we're using mock data, we'll just manipulate the copied array
const proposals = [...mockProposals];

// Get all proposals or filter by sales process ID
export const getProposals = async (
  salesProcessId?: string,
  status?: ProposalStatus
): Promise<Proposal[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
  
  let result = [...proposals];
  
  if (salesProcessId) {
    result = result.filter(p => p.sales_process_id === salesProcessId);
  }
  
  if (status && status !== 'all') {
    result = result.filter(p => p.status === status);
  }
  
  return result;
};

// Get a single proposal by ID
export const getProposalById = async (proposalId: string): Promise<Proposal | null> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
  return proposals.find(p => p.id === proposalId) || null;
};

// Create a new proposal
export const createProposal = async (proposal: Omit<Proposal, 'id' | 'created_at'>): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
  
  const newProposal: Proposal = {
    ...proposal,
    id: generateRandomId(),
    created_at: new Date().toISOString(),
  };
  
  proposals.push(newProposal);
  return newProposal;
};

// Update an existing proposal
export const updateProposal = async (proposalId: string, updates: Partial<Proposal>): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
  
  const index = proposals.findIndex(p => p.id === proposalId);
  if (index === -1) throw new Error("Proposal not found");
  
  proposals[index] = { ...proposals[index], ...updates };
  return proposals[index];
};

// Delete a proposal
export const deleteProposal = async (proposalId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate API call
  
  const index = proposals.findIndex(p => p.id === proposalId);
  if (index === -1) return false;
  
  proposals.splice(index, 1);
  return true;
};

// Update proposal status
export const updateProposalStatus = async (
  proposalId: string, 
  newStatus: ProposalStatus
): Promise<Proposal> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
  
  const index = proposals.findIndex(p => p.id === proposalId);
  if (index === -1) throw new Error("Proposal not found");
  
  const now = new Date().toISOString();
  
  const updates: Partial<Proposal> = { status: newStatus };
  
  // Add appropriate timestamp based on status
  switch (newStatus) {
    case 'sent':
      updates.sent_at = now;
      break;
    case 'viewed':
      updates.viewed_at = now;
      break;
    case 'accepted':
      updates.accepted_at = now;
      break;
    case 'rejected':
      updates.rejected_at = now;
      break;
  }
  
  proposals[index] = { ...proposals[index], ...updates };
  return proposals[index];
};
