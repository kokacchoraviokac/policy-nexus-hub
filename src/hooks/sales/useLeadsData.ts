
import { useState, useEffect, useMemo } from "react";
import { Lead } from "@/components/sales/leads/LeadsTable";

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: "lead-1",
    name: "John Smith",
    company: "Smith Enterprises",
    email: "john.smith@example.com",
    phone: "+1 234-567-8901",
    status: "new",
    source: "website",
    created_at: "2023-05-15T10:30:00Z",
    responsible_person: "Sarah Johnson",
    notes: "Interested in multiple insurance options for his business."
  },
  {
    id: "lead-2",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 345-678-9012",
    status: "qualified",
    source: "referral",
    created_at: "2023-06-22T14:15:00Z",
    responsible_person: "Michael Brown",
    notes: "Referred by existing client. Looking for family health insurance."
  },
  {
    id: "lead-3",
    name: "Robert Johnson",
    company: "Johnson & Associates",
    email: "robert.johnson@example.com",
    status: "converted",
    source: "email",
    created_at: "2023-04-10T09:45:00Z",
    responsible_person: "Sarah Johnson"
  },
  {
    id: "lead-4",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+1 456-789-0123",
    status: "lost",
    source: "social_media",
    created_at: "2023-07-05T16:20:00Z",
    responsible_person: "David Wilson",
    notes: "Was interested in auto insurance but went with another provider."
  },
  {
    id: "lead-5",
    name: "David Lee",
    company: "Lee Technologies",
    email: "david.lee@example.com",
    phone: "+1 567-890-1234",
    status: "new",
    source: "event",
    created_at: "2023-08-18T11:00:00Z",
    responsible_person: "Michael Brown",
    notes: "Met at the industry conference. Interested in cyber security insurance."
  }
];

export const useLeadsData = (searchQuery: string = "", statusFilter: string = "all") => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch leads data (simulated with mock data)
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would make an API call to fetch leads
      setLeads(mockLeads);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtered leads based on search query and status filter
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Apply status filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(query) ||
          (lead.company && lead.company.toLowerCase().includes(query)) ||
          lead.email.toLowerCase().includes(query) ||
          (lead.phone && lead.phone.toLowerCase().includes(query)) ||
          (lead.responsible_person && lead.responsible_person.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [leads, searchQuery, statusFilter]);

  // Calculate totals by status
  const leadsByStatus = useMemo(() => {
    return leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [leads]);

  return {
    leads: filteredLeads,
    isLoading,
    error,
    refresh: fetchLeads,
    totalLeads: leads.length,
    leadsByStatus
  };
};
