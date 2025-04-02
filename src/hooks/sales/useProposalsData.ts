
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Proposal, ProposalStatus, UseProposalsDataProps } from "@/types/sales";
import { filterProposals, calculateProposalStats, getUpdatedProposalWithStatus } from "@/utils/proposalUtils";
import { fetchProposals, createProposal as apiCreateProposal, updateProposalStatus as apiUpdateProposalStatus, deleteProposal as apiDeleteProposal } from "@/services/proposalService";

export const useProposalsData = ({
  salesProcessId,
  clientName,
  searchQuery = "",
  statusFilter = "all"
}: UseProposalsDataProps = {}) => {
  const { t } = useLanguage();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initial fetch
  useEffect(() => {
    const getProposals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProposals();
        setProposals(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    getProposals();
  }, []);

  // Filtered proposals
  const filteredProposals = useMemo(() => {
    return filterProposals(proposals, salesProcessId, clientName, searchQuery, statusFilter);
  }, [proposals, searchQuery, statusFilter, salesProcessId, clientName]);

  // Create a new proposal
  const createProposal = (proposal: Proposal) => {
    apiCreateProposal(proposal).then(newProposal => {
      setProposals(prevProposals => [newProposal, ...prevProposals]);
    });
    return proposal;
  };

  // Update proposal status
  const updateProposalStatus = (proposalId: string, status: ProposalStatus) => {
    apiUpdateProposalStatus(proposalId, status).then(() => {
      setProposals(prevProposals => 
        prevProposals.map(proposal => 
          proposal.id === proposalId
            ? getUpdatedProposalWithStatus(proposal, status)
            : proposal
        )
      );
    });
  };

  // Delete a proposal
  const deleteProposal = (proposalId: string) => {
    apiDeleteProposal(proposalId).then(() => {
      setProposals(prevProposals => prevProposals.filter(prop => prop.id !== proposalId));
      toast.success(t("proposalDeleted"), {
        description: t("proposalDeletedDescription")
      });
    });
  };

  // Calculate totals by status
  const proposalsByStatus = useMemo(() => {
    return calculateProposalStats(proposals);
  }, [proposals]);

  // Refresh function to fetch proposals again
  const refresh = () => {
    const getProposals = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProposals();
        setProposals(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    getProposals();
  };

  return {
    proposals: filteredProposals,
    isLoading,
    error,
    refresh,
    createProposal,
    updateProposalStatus,
    deleteProposal,
    totalProposals: proposals.length,
    proposalsByStatus
  };
};
