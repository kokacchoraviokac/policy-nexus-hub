
import { useFetchSalesProcesses } from "./useFetchSalesProcesses";
import { useCreateSalesProcess } from "./useCreateSalesProcess";
import { useUpdateSalesProcess } from "./useUpdateSalesProcess";
import { useDeleteSalesProcess } from "./useDeleteSalesProcess";

export const useSalesProcesses = (searchQuery: string = "", stageFilter: string = "all", statusFilter: string = "all") => {
  const { 
    salesProcesses, 
    isLoading, 
    error, 
    refresh, 
    stats 
  } = useFetchSalesProcesses(searchQuery, stageFilter, statusFilter);
  
  const { createSalesProcess, isCreating } = useCreateSalesProcess();
  const { updateSalesProcess, isUpdating } = useUpdateSalesProcess();
  const { deleteSalesProcess, isDeleting } = useDeleteSalesProcess();

  return {
    // Data and loading state
    salesProcesses,
    isLoading,
    error,
    
    // Operations
    createSalesProcess,
    updateSalesProcess,
    deleteSalesProcess,
    
    // Operation states
    isCreating,
    isUpdating,
    isDeleting,
    
    // Utilities
    refresh,
    stats
  };
};
