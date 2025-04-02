
import { SalesProcess, SalesProcessStage, SalesProcessStatus } from "@/types/salesProcess";
import { mockSalesProcesses } from "@/data/mockSalesProcesses";
import { getStatusForStageTransition } from "@/utils/sales/stageTransitionConfig";

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
 * Update the stage of a sales process
 */
export const updateSalesProcessStage = async (
  processId: string,
  newStage: SalesProcessStage,
  currentStatus: SalesProcessStatus
): Promise<SalesProcess> => {
  // Determine if status should change based on the stage transition
  const newStatus = getStatusForStageTransition(
    // We would normally get the current stage from the database
    "quote", // placeholder - in real implementation, fetch current stage first
    newStage,
    currentStatus
  );
  
  // In a real implementation, this would make an API call
  // to update both stage and status if needed
  
  // Simulate updated process
  const updatedProcess: SalesProcess = {
    // Mock data - in real implementation, fetch the actual process first
    ...mockSalesProcesses[0],
    id: processId,
    stage: newStage,
    status: newStatus
  };
  
  return updatedProcess;
};

/**
 * Delete a sales process
 */
export const deleteSalesProcess = async (salesProcessId: string): Promise<void> => {
  // In a real implementation, this would make an API call
  await new Promise(resolve => setTimeout(resolve, 500));
};
