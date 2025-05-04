
import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Client } from "@/hooks/useClients";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Policy } from "@/types/policies";

export interface ClientReportFilters {
  dateRange: DateRange | undefined;
  status: 'all' | 'active' | 'inactive';
  searchTerm: string;
}

export interface ClientReportData extends Client {
  policyCount: number;
  premiumTotal: number;
  claimsCount: number;
  lastPolicyDate: string | null;
}

export interface ClientReportSummary {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  averagePoliciesPerClient: number;
  totalPolicies: number;
  totalPremium: number;
}

export const useClientReport = (filters: ClientReportFilters) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const [clientsData, setClientsData] = useState<ClientReportData[]>([]);
  const [summary, setSummary] = useState<ClientReportSummary>({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    averagePoliciesPerClient: 0,
    totalPolicies: 0,
    totalPremium: 0,
  });
  const companyId = user?.companyId;

  // Fetch clients
  const { data: clients, isLoading: isLoadingClients, error: clientsError } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: async () => {
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId)
        .order("name");

      if (error) {
        throw error;
      }
      
      return data as Client[];
    },
    enabled: !!companyId,
  });

  // Fetch policies for all clients
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

  // Fetch claims count for reporting
  const { data: claims, isLoading: isLoadingClaims, error: claimsError } = useQuery({
    queryKey: ["claims", "count", companyId],
    queryFn: async () => {
      if (!companyId) {
        return [];
      }

      const { data, error } = await supabase
        .from("claims")
        .select("id, policy_id")
        .eq("company_id", companyId);

      if (error) {
        throw error;
      }
      
      return data;
    },
    enabled: !!companyId,
  });

  // Process data when clients, policies, or filters change
  useEffect(() => {
    if (!clients || !policies || !claims || isLoadingClients || isLoadingPolicies || isLoadingClaims) {
      return;
    }

    try {
      // Filter clients based on search term and status
      let filteredClients = [...clients];
      
      if (filters.status !== 'all') {
        const isActive = filters.status === 'active';
        filteredClients = filteredClients.filter(client => client.is_active === isActive);
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredClients = filteredClients.filter(client => 
          client.name.toLowerCase().includes(searchLower) ||
          (client.contact_person && client.contact_person.toLowerCase().includes(searchLower)) ||
          (client.email && client.email.toLowerCase().includes(searchLower)) ||
          (client.city && client.city.toLowerCase().includes(searchLower))
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

      // Create a map for fast policy lookup by client_id
      const policyCountByClient = new Map<string, number>();
      const premiumSumByClient = new Map<string, number>();
      const lastPolicyDateByClient = new Map<string, Date>();
      
      filteredPolicies.forEach(policy => {
        if (!policy.client_id) return;
        
        // Count policies per client
        const currentCount = policyCountByClient.get(policy.client_id) || 0;
        policyCountByClient.set(policy.client_id, currentCount + 1);
        
        // Sum premiums per client
        const currentSum = premiumSumByClient.get(policy.client_id) || 0;
        premiumSumByClient.set(policy.client_id, currentSum + (policy.premium || 0));
        
        // Track latest policy date
        const policyDate = new Date(policy.start_date);
        const currentLatest = lastPolicyDateByClient.get(policy.client_id);
        if (!currentLatest || policyDate > currentLatest) {
          lastPolicyDateByClient.set(policy.client_id, policyDate);
        }
      });

      // Create claims count map
      const claimsCountByClient = new Map<string, number>();
      
      claims.forEach(claim => {
        const policy = policies.find(p => p.id === claim.policy_id);
        if (policy && policy.client_id) {
          const currentCount = claimsCountByClient.get(policy.client_id) || 0;
          claimsCountByClient.set(policy.client_id, currentCount + 1);
        }
      });

      // Combine client data with calculated metrics
      const reportData: ClientReportData[] = filteredClients.map(client => ({
        ...client,
        policyCount: policyCountByClient.get(client.id) || 0,
        premiumTotal: premiumSumByClient.get(client.id) || 0,
        claimsCount: claimsCountByClient.get(client.id) || 0,
        lastPolicyDate: lastPolicyDateByClient.get(client.id) 
          ? lastPolicyDateByClient.get(client.id)!.toISOString() 
          : null,
      }));

      // Calculate summary metrics
      const activeClients = reportData.filter(client => client.is_active).length;
      const inactiveClients = reportData.filter(client => !client.is_active).length;
      const totalPolicies = Array.from(policyCountByClient.values()).reduce((sum, count) => sum + count, 0);
      const totalPremium = Array.from(premiumSumByClient.values()).reduce((sum, amount) => sum + amount, 0);

      const summaryData: ClientReportSummary = {
        totalClients: reportData.length,
        activeClients,
        inactiveClients,
        averagePoliciesPerClient: reportData.length > 0 
          ? totalPolicies / reportData.length
          : 0,
        totalPolicies,
        totalPremium
      };

      setClientsData(reportData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error processing client report data:", error);
      toast({
        title: t("errorProcessingData"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  }, [clients, policies, claims, filters, t, toast, isLoadingClients, isLoadingPolicies, isLoadingClaims]);

  const isLoading = isLoadingClients || isLoadingPolicies || isLoadingClaims;
  const error = clientsError || policiesError || claimsError;

  return {
    clientsData,
    summary,
    isLoading,
    error
  };
};
