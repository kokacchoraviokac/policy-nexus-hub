
import { useState, useEffect, useMemo } from "react";

// Define the stages in the sales process
export type SalesProcessStage = 
  | "quote" 
  | "authorization" 
  | "proposal" 
  | "signed" 
  | "concluded";

// Define the sales process type
export type SalesProcess = {
  id: string;
  title: string;
  company?: string;
  client_name: string;
  stage: SalesProcessStage;
  created_at: string;
  expected_close_date?: string;
  insurance_type: string;
  responsible_person?: string;
  status: "active" | "completed" | "canceled";
  estimated_value?: string;
  notes?: string;
};

// Mock data for sales processes
const mockSalesProcesses: SalesProcess[] = [
  {
    id: "sp-1",
    title: "New Business Insurance",
    company: "Alpha Technologies",
    client_name: "John Smith",
    stage: "quote",
    created_at: "2023-08-05T10:00:00Z",
    expected_close_date: "2023-10-15T00:00:00Z",
    insurance_type: "business",
    responsible_person: "Sarah Johnson",
    status: "active",
    estimated_value: "€45,000",
    notes: "Client is expanding their business and needs comprehensive coverage."
  },
  {
    id: "sp-2",
    title: "Family Health Plan",
    client_name: "Emily Davis",
    stage: "authorization",
    created_at: "2023-07-22T14:15:00Z",
    expected_close_date: "2023-09-30T00:00:00Z",
    insurance_type: "health",
    responsible_person: "Michael Brown",
    status: "active",
    estimated_value: "€8,500",
    notes: "Family of four looking for comprehensive health coverage."
  },
  {
    id: "sp-3",
    title: "Corporate Liability",
    company: "Johnson & Associates",
    client_name: "Robert Johnson",
    stage: "proposal",
    created_at: "2023-07-10T09:45:00Z",
    insurance_type: "nonLife",
    responsible_person: "Sarah Johnson",
    status: "active",
    estimated_value: "€75,200"
  },
  {
    id: "sp-4",
    title: "Vehicle Fleet Insurance",
    company: "Garcia Delivery",
    client_name: "Maria Garcia",
    stage: "signed",
    created_at: "2023-06-15T16:20:00Z",
    insurance_type: "auto",
    responsible_person: "David Wilson",
    status: "active",
    estimated_value: "€28,750",
    notes: "Fleet of 12 delivery vehicles needing comprehensive coverage."
  },
  {
    id: "sp-5",
    title: "Tech Startup Package",
    company: "Lee Technologies",
    client_name: "David Lee",
    stage: "concluded",
    created_at: "2023-05-18T11:00:00Z",
    insurance_type: "business",
    responsible_person: "Michael Brown",
    status: "completed",
    estimated_value: "€120,000",
    notes: "Successfully implemented comprehensive business insurance package."
  }
];

export const useSalesProcessData = (searchQuery: string = "", stageFilter: string = "all") => {
  const [salesProcesses, setSalesProcesses] = useState<SalesProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch sales processes data (simulated with mock data)
  const fetchSalesProcesses = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would make an API call to fetch sales processes
      setSalesProcesses(mockSalesProcesses);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSalesProcesses();
  }, []);

  // Filtered sales processes based on search query and stage filter
  const filteredProcesses = useMemo(() => {
    return salesProcesses.filter(process => {
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
  }, [salesProcesses, searchQuery, stageFilter]);

  // Calculate totals by stage
  const processesByStage = useMemo(() => {
    return salesProcesses.reduce((acc, process) => {
      acc[process.stage] = (acc[process.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [salesProcesses]);

  return {
    salesProcesses: filteredProcesses,
    isLoading,
    error,
    refresh: fetchSalesProcesses,
    totalProcesses: salesProcesses.length,
    processesByStage
  };
};
