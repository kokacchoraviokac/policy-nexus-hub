
import { useState } from "react";
import { useSalesProcesses } from "./useSalesProcesses";

export const useSalesProcessData = (searchQuery: string = "", stageFilter: string = "all") => {
  const [statusFilter] = useState("all"); // Default to showing all statuses
  
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

  // Group processes by stage for the pipeline view
  const processesByStage = {
    quote: salesProcesses.filter(process => process.stage === "quote").length,
    authorization: salesProcesses.filter(process => process.stage === "authorization").length,
    request: salesProcesses.filter(process => process.stage === "request").length,
    proposal: salesProcesses.filter(process => process.stage === "proposal").length,
    receipt: salesProcesses.filter(process => process.stage === "receipt").length,
    signed: salesProcesses.filter(process => process.stage === "signed").length,
    concluded: salesProcesses.filter(process => process.stage === "concluded").length,
  };

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
