
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Agent } from "@/hooks/agents/useAgents";

interface AgentFilters {
  searchTerm?: string;
  status?: 'active' | 'inactive' | 'all';
}

export const useAgentManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  
  const [filters, setFilters] = useState<AgentFilters>({
    status: 'active',
    searchTerm: ''
  });

  const companyId = user?.companyId;

  const fetchAgents = async () => {
    if (!companyId) {
      return { data: [], totalCount: 0 };
    }

    try {
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      let query = supabase
        .from("agents")
        .select("*", { count: 'exact' })
        .eq("company_id", companyId);

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,phone.ilike.%${filters.searchTerm}%`);
      }

      const { data, error, count } = await query
        .order("name")
        .range(from, to);

      if (error) {
        throw error;
      }

      return { 
        data, 
        totalCount: count || 0 
      };
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast({
        title: t("errorFetchingAgents"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['agents-management', pagination, filters, companyId],
    queryFn: fetchAgents,
    enabled: !!companyId
  });

  // Add agent mutation
  const addAgentMutation = useMutation({
    mutationFn: async (agentData: Omit<Agent, 'id'>) => {
      if (!companyId) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("agents")
        .insert({
          ...agentData,
          company_id: companyId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents-management'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] }); // Also invalidate the regular agents list
      toast({
        title: t("agentAdded"),
        description: t("agentAddedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error adding agent:", error);
      toast({
        title: t("errorAddingAgent"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Update agent mutation
  const updateAgentMutation = useMutation({
    mutationFn: async (agentData: Agent) => {
      const { id, ...updateData } = agentData;

      const { data, error } = await supabase
        .from("agents")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents-management'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] }); // Also invalidate the regular agents list
      toast({
        title: t("agentUpdated"),
        description: t("agentUpdatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error updating agent:", error);
      toast({
        title: t("errorUpdatingAgent"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Delete agent mutation
  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      // Instead of actually deleting, we set the status to inactive
      const { error } = await supabase
        .from("agents")
        .update({ status: 'inactive' })
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents-management'] });
      queryClient.invalidateQueries({ queryKey: ['agents'] }); // Also invalidate the regular agents list
      toast({
        title: t("agentDeactivated"),
        description: t("agentDeactivatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deactivating agent:", error);
      toast({
        title: t("errorDeactivatingAgent"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  return {
    agents: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    refetch,
    pagination: {
      ...pagination,
      onPageChange: (page: number) => setPagination({ ...pagination, pageIndex: page }),
      onPageSizeChange: (size: number) => setPagination({ pageIndex: 0, pageSize: size })
    },
    filters,
    setFilters,
    addAgent: addAgentMutation.mutate,
    updateAgent: updateAgentMutation.mutate,
    deleteAgent: deleteAgentMutation.mutate,
    isSubmitting: addAgentMutation.isPending || updateAgentMutation.isPending || deleteAgentMutation.isPending
  };
};
