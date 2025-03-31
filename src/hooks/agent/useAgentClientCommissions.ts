
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

export const useAgentClientCommissions = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const companyId = user?.companyId;

  const fetchClientCommissions = async () => {
    if (!companyId) {
      return { data: [], totalCount: 0 };
    }

    try {
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      const { data, error, count } = await supabase
        .from("client_commissions")
        .select(`
          *,
          agents(name),
          clients(name)
        `, { count: 'exact' })
        .eq("company_id", companyId)
        .order("effective_from", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      // Transform data to include agent and client names
      const transformedData = data.map((commission) => ({
        ...commission,
        agent_name: commission.agents?.name || "Unknown",
        client_name: commission.clients?.name || "Unknown"
      }));

      return { 
        data: transformedData, 
        totalCount: count || 0 
      };
    } catch (error) {
      console.error("Error fetching client commissions:", error);
      toast({
        title: t("errorFetchingClientCommissions"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['client-commissions', pagination, companyId],
    queryFn: fetchClientCommissions,
  });

  // Add client commission mutation
  const addMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!companyId || !user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("client_commissions")
        .insert({
          ...formData,
          company_id: companyId,
          created_by: user.id
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-commissions'] });
      toast({
        title: t("clientCommissionAdded"),
        description: t("clientCommissionAddedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error adding client commission:", error);
      toast({
        title: t("errorAddingClientCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Update client commission mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { id, ...updateData } = formData;

      const { data, error } = await supabase
        .from("client_commissions")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-commissions'] });
      toast({
        title: t("clientCommissionUpdated"),
        description: t("clientCommissionUpdatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error updating client commission:", error);
      toast({
        title: t("errorUpdatingClientCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Delete client commission mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("client_commissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-commissions'] });
      toast({
        title: t("clientCommissionDeleted"),
        description: t("clientCommissionDeletedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deleting client commission:", error);
      toast({
        title: t("errorDeletingClientCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  return {
    clientCommissions: data?.data || [],
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
    addClientCommission: addMutation.mutate,
    updateClientCommission: updateMutation.mutate,
    deleteClientCommission: deleteMutation.mutate,
    isSubmitting: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
