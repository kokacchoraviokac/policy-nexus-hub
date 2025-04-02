
import { SalesProcess } from "@/types/salesProcess";
import { mockSalesProcesses } from "@/data/mockSalesProcesses";

/**
 * Fetch sales processes (currently using mock data)
 */
export const fetchSalesProcesses = async (): Promise<SalesProcess[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would make an API call
  return mockSalesProcesses;
};

/**
 * Create a new sales process
 */
export const createSalesProcess = async (salesProcess: SalesProcess): Promise<SalesProcess> => {
  // In a real implementation, this would make an API call
  return salesProcess;
};

/**
 * Update an existing sales process
 */
export const updateSalesProcess = async (salesProcess: SalesProcess): Promise<SalesProcess> => {
  // In a real implementation, this would make an API call
  return salesProcess;
};

/**
 * Delete a sales process
 */
export const deleteSalesProcess = async (salesProcessId: string): Promise<void> => {
  // In a real implementation, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 500));
};
