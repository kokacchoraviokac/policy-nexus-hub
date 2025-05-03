
import { useSalesProcesses } from "./useSalesProcesses";

// This hook is a wrapper to maintain backward compatibility
export const useSalesProcessData = (searchQuery: string = "", stageFilter: string = "all", statusFilter: string = "all") => {
  const {
    salesProcesses,
    isLoading,
    error,
    refresh,
    stats
  } = useSalesProcesses(searchQuery, stageFilter, statusFilter);
  
  return {
    salesProcesses,
    isLoading,
    error,
    refresh,
    processesByStage: {
      quote: stats.quote,
      authorization: stats.authorization,
      request: stats.request,
      proposal: stats.proposal,
      receipt: stats.receipt,
      signed: stats.signed,
      concluded: stats.concluded
    }
  };
};
