
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lead, CreateLeadRequest, UpdateLeadRequest } from "@/types/sales/leads";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth/AuthContext";

// Mock data for development
const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Demo Lead 1",
    company_name: "Demo Company",
    email: "demo@lead1.com",
    phone: "+1234567890",
    source: "website",
    status: "new",
    notes: "Demo lead for testing",
    company_id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_to: null
  }
];

const mockLeadStorage = [...MOCK_LEADS];

export const useLeads = (searchQuery: string = "", statusFilter: string = "all") => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useLanguage();
  const { user } = useAuth();

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Return mock data for mock users
        console.log("Using mock lead data");
        let filteredLeads = [...mockLeadStorage];
        
        // Apply status filter if not "all"
        if (statusFilter !== "all") {
          filteredLeads = filteredLeads.filter(lead => lead.status === statusFilter);
        }
        
        // Apply search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredLeads = filteredLeads.filter(lead =>
            lead.name.toLowerCase().includes(query) ||
            (lead.company_name && lead.company_name.toLowerCase().includes(query)) ||
            (lead.email && lead.email.toLowerCase().includes(query)) ||
            (lead.phone && lead.phone.toLowerCase().includes(query))
          );
        }
        
        setLeads(filteredLeads);
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      // Apply search query if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Use type assertion to convert database records to Lead type
      setLeads(data as unknown as Lead[]);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err as Error);
      toast.error(t("errorFetchingLeads"));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, t, user]);

  const createLead = async (leadData: CreateLeadRequest): Promise<Lead | null> => {
    try {
      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Mock lead creation
        const newLead: Lead = {
          ...leadData,
          id: `lead-${Date.now()}`,
          company_id: user?.companyId || "550e8400-e29b-41d4-a716-446655440000",
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockLeadStorage.push(newLead);
        console.log("Mock lead created:", newLead);
        
        // Refresh the leads list
        fetchLeads();
        
        toast.success(t("leadCreated"), {
          description: t("leadCreatedDescription", { name: leadData.name })
        });
        
        return newLead;
      }
      
      // Make sure we include the company_id and default status
      const dataWithCompany = {
        ...leadData,
        company_id: user?.companyId,
        status: 'new' // Default status for new leads
      };
      
      const { data, error } = await supabase
        .from('leads')
        .insert([dataWithCompany])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Refresh the leads list
      fetchLeads();
      
      toast.success(t("leadCreated"), {
        description: t("leadCreatedDescription", { name: leadData.name })
      });
      
      // Use type assertion to convert database record to Lead type
      return data as unknown as Lead;
    } catch (err) {
      console.error("Error creating lead:", err);
      toast.error(t("errorCreatingLead"));
      return null;
    }
  };

  const updateLead = async (id: string, leadData: UpdateLeadRequest): Promise<Lead | null> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Refresh the leads list
      fetchLeads();
      
      toast.success(t("leadUpdated"), {
        description: t("leadUpdatedDescription")
      });
      
      // Use type assertion to convert database record to Lead type
      return data as unknown as Lead;
    } catch (err) {
      console.error("Error updating lead:", err);
      toast.error(t("errorUpdatingLead"));
      return null;
    }
  };

  const deleteLead = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the leads list
      fetchLeads();
      
      toast.success(t("leadDeleted"), {
        description: t("leadDeletedDescription")
      });
      
      return true;
    } catch (err) {
      console.error("Error deleting lead:", err);
      toast.error(t("errorDeletingLead"));
      return false;
    }
  };

  // Calculate lead statistics by status
  const calculateLeadStats = () => {
    const stats = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: leads.length,
      new: stats.new || 0,
      contacted: stats.contacted || 0,
      qualified: stats.qualified || 0,
      converted: stats.converted || 0,
      lost: stats.lost || 0
    };
  };

  // Initial load
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    isLoading,
    error,
    createLead,
    updateLead,
    deleteLead,
    refresh: fetchLeads,
    stats: calculateLeadStats()
  };
};
