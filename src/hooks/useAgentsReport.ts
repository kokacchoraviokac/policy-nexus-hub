
import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Policy } from "@/types/policies";

export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  user_id?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  bank_account?: string;
  tax_id?: string;
}

export interface AgentReportFilters {
  dateRange: DateRange | undefined;
  status: string;
  searchTerm: string;
}

export interface AgentReportData extends Agent {
  policyCount: number;
  premiumTotal: number;
  commissionTotal: number;
  clientCount: number;
}

export interface AgentReportSummary {
  totalAgents: number;
  activeAgents: number;
  totalPolicies: number;
  totalPremium: number;
  totalCommission: number;
  averagePoliciesPerAgent: number;
}

export const useAgentsReport = (filters: AgentReportFilters) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [agentsData, setAgentsData] = useState<AgentReportData[]>([]);
  const [summary, setSummary] = useState<AgentReportSummary>({
    totalAgents: 0,
    activeAgents: 0,
    totalPolicies: 0,
    totalPremium: 0,
    totalCommission: 0,
    averagePoliciesPerAgent: 0,
  });
  const companyId = user?.companyId;

  // Fetch agents
  const { data: agents, isLoading: isLoadingAgents, error: agentsError } = useQuery({
    queryKey: ["agents", companyId],
    queryFn: async () => {
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("company_id", companyId)
        .order("name");

      if (error) {
        throw error;
      }
      
      return data as Agent[];
    },
    enabled: !!companyId,
  });

  // Fetch policies for all agents
  const { data: policies, isLoading: isLoadingPolicies, error: policiesError } = useQuery({
    queryKey: ["policies", "all", companyId],
    queryFn: async () => {
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("policies")
        .select("*")
        .eq("company_id", companyId);

      if (error) {
        throw error;
      }
      
      return data as Policy[];
    },
    enabled: !!companyId,
  });

  // Process data when agents, policies, or filters change
  useEffect(() => {
    if (!agents || !policies || isLoadingAgents || isLoadingPolicies) {
      return;
    }

    try {
      // Filter agents based on status and search term
      let filteredAgents = [...agents];
      
      if (filters.status && filters.status !== 'all') {
        filteredAgents = filteredAgents.filter(agent => agent.status === filters.status);
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAgents = filteredAgents.filter(agent => 
          agent.name.toLowerCase().includes(searchLower) ||
          (agent.email && agent.email.toLowerCase().includes(searchLower))
        );
      }
      
      // Filter policies by date range if specified
      let filteredPolicies = [...policies];
      if (filters.dateRange && filters.dateRange.from) {
        const fromDate = new Date(filters.dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          toDate.setHours(23, 59, 59, 999);
          
          filteredPolicies = filteredPolicies.filter(policy => {
            const startDate = new Date(policy.start_date);
            return startDate >= fromDate && startDate <= toDate;
          });
        } else {
          filteredPolicies = filteredPolicies.filter(policy => {
            const startDate = new Date(policy.start_date);
            return startDate >= fromDate;
          });
        }
      }

      // Calculate metrics per agent
      const policyCountByAgent = new Map<string, number>();
      const premiumSumByAgent = new Map<string, number>();
      const commissionSumByAgent = new Map<string, number>();
      const clientsByAgent = new Map<string, Set<string>>();
      
      filteredPolicies.forEach(policy => {
        if (!policy.assigned_to) return;
        
        // Count policies per agent
        const currentCount = policyCountByAgent.get(policy.assigned_to) || 0;
        policyCountByAgent.set(policy.assigned_to, currentCount + 1);
        
        // Sum premiums per agent
        const currentPremiumSum = premiumSumByAgent.get(policy.assigned_to) || 0;
        premiumSumByAgent.set(policy.assigned_to, currentPremiumSum + (policy.premium || 0));
        
        // Sum commissions per agent
        const currentCommissionSum = commissionSumByAgent.get(policy.assigned_to) || 0;
        commissionSumByAgent.set(policy.assigned_to, currentCommissionSum + (policy.commission_amount || 0));
        
        // Track unique clients per agent
        if (policy.client_id) {
          const clientSet = clientsByAgent.get(policy.assigned_to) || new Set();
          clientSet.add(policy.client_id);
          clientsByAgent.set(policy.assigned_to, clientSet);
        }
      });

      // Combine agent data with calculated metrics
      const reportData: AgentReportData[] = filteredAgents.map(agent => {
        // Find the agent's user_id
        const agentId = agent.id;
        
        return {
          ...agent,
          policyCount: policyCountByAgent.get(agentId) || 0,
          premiumTotal: premiumSumByAgent.get(agentId) || 0,
          commissionTotal: commissionSumByAgent.get(agentId) || 0,
          clientCount: clientsByAgent.get(agentId)?.size || 0,
        };
      });

      // Calculate summary metrics
      const activeAgents = reportData.filter(agent => agent.status === 'active').length;
      const totalPolicies = Array.from(policyCountByAgent.values()).reduce((sum, count) => sum + count, 0);
      const totalPremium = Array.from(premiumSumByAgent.values()).reduce((sum, amount) => sum + amount, 0);
      const totalCommission = Array.from(commissionSumByAgent.values()).reduce((sum, amount) => sum + amount, 0);

      const summaryData: AgentReportSummary = {
        totalAgents: reportData.length,
        activeAgents,
        totalPolicies,
        totalPremium,
        totalCommission,
        averagePoliciesPerAgent: reportData.length > 0 
          ? totalPolicies / reportData.length 
          : 0
      };

      setAgentsData(reportData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error processing agent report data:", error);
      toast({
        title: t("errorProcessingData"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  }, [agents, policies, filters, t, toast, isLoadingAgents, isLoadingPolicies]);

  const isLoading = isLoadingAgents || isLoadingPolicies;
  const error = agentsError || policiesError;

  return {
    agentsData,
    summary,
    isLoading,
    error
  };
};
