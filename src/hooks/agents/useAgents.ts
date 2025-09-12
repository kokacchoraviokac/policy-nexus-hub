
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  tax_id: string;
  bank_account: string;
}

export const useAgents = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);

  const companyId = user?.companyId;

  const fetchAgents = async () => {
    // Use mock data for testing agent payout system
    console.log("Using mock agents data for testing");
    
    const mockAgents: Agent[] = [
      {
        id: "agent-1",
        name: "John Anderson",
        email: "john.anderson@example.com",
        phone: "+1-555-0101",
        status: "active",
        tax_id: "TAX001",
        bank_account: "ACC-001-123456"
      },
      {
        id: "agent-2",
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        phone: "+1-555-0102",
        status: "active",
        tax_id: "TAX002",
        bank_account: "ACC-002-789012"
      },
      {
        id: "agent-3",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1-555-0103",
        status: "active",
        tax_id: "TAX003",
        bank_account: "ACC-003-345678"
      }
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockAgents;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["agents", companyId],
    queryFn: fetchAgents,
  });

  return {
    agents: data || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
