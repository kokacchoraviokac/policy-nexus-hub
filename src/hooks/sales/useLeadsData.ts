
import { useLeads } from "./useLeads";

// This hook is a wrapper to maintain backward compatibility
export const useLeadsData = (searchQuery: string = "", statusFilter: string = "all") => {
  const { 
    leads, 
    isLoading, 
    error, 
    refresh, 
    stats 
  } = useLeads(searchQuery, statusFilter);
  
  return {
    leads,
    isLoading,
    error,
    refresh,
    totalLeads: stats.total,
    leadsByStatus: {
      new: stats.new,
      qualified: stats.qualified,
      converted: stats.converted,
      lost: stats.lost
    }
  };
};
