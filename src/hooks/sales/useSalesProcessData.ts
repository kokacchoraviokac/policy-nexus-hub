
import { useState } from "react";
import { useSalesProcesses } from "./useSalesProcesses";
import { SalesStage } from "@/types/sales/salesProcesses";

/**
 * Hook to count sales processes by stage
 * @param salesProcesses Array of sales processes
 * @returns Object with counts by stage
 */
const useProcessesByStageCount = (salesProcesses: any[]) => {
  return {
    quote: salesProcesses.filter(process => process.stage === "quote").length,
    authorization: salesProcesses.filter(process => process.stage === "authorization").length,
    request: salesProcesses.filter(process => process.stage === "request").length,
    proposal: salesProcesses.filter(process => process.stage === "proposal").length,
    receipt: salesProcesses.filter(process => process.stage === "receipt").length,
    signed: salesProcesses.filter(process => process.stage === "signed").length,
    concluded: salesProcesses.filter(process => process.stage === "concluded").length,
  };
};

/**
 * Main hook that provides all sales process data and operations
 * @param searchQuery Optional search query string
 * @param stageFilter Optional stage filter
 * @returns Object with sales processes data and operations
 */
export const useSalesProcessData = (searchQuery: string = "", stageFilter: string = "all") => {
  const [statusFilter] = useState("all"); // Default to showing all statuses
  
  // Use the composite hook to get all sales processes operations
  const {
    salesProcesses,
    isLoading,
    error,
    createSalesProcess,
    updateSalesProcess,
    deleteSalesProcess,
    refresh,
    stats
  } = useSalesProcesses(searchQuery, stageFilter, statusFilter);

  // Get counts by stage for the pipeline view
  const processesByStage = useProcessesByStageCount(salesProcesses);

  return {
    salesProcesses,
    isLoading,
    error,
    createSalesProcess,
    updateSalesProcess,
    deleteSalesProcess,
    refresh,
    stats,
    processesByStage
  };
};
