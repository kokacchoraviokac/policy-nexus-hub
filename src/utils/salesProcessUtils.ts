
import { SalesProcess } from "@/types/salesProcess";

/**
 * Filters sales processes based on search criteria
 */
export const filterSalesProcesses = (
  processes: SalesProcess[],
  searchQuery: string = "",
  stageFilter: string = "all"
): SalesProcess[] => {
  return processes.filter(process => {
    // Apply stage filter
    if (stageFilter !== "all" && process.stage !== stageFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        process.title.toLowerCase().includes(query) ||
        (process.company && process.company.toLowerCase().includes(query)) ||
        process.client_name.toLowerCase().includes(query) ||
        (process.responsible_person && process.responsible_person.toLowerCase().includes(query)) ||
        process.insurance_type.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};

/**
 * Calculates totals of sales processes by stage
 */
export const calculateProcessesByStage = (processes: SalesProcess[]): Record<string, number> => {
  return processes.reduce((acc, process) => {
    acc[process.stage] = (acc[process.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};
