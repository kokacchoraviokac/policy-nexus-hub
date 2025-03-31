
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

export const useAgentManualCommissions = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const companyId = user?.companyId;

  const fetchManualCommissions = async () => {
    if (!companyId) {
      return { data: [], totalCount: 0 };
    }

    try {
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      const { data, error, count } = await supabase
        .from("manual_commissions")
        .select(`
          *,
          agents(name),
          policies(policy_number, policyholder_name)
        `, { count: 'exact' })
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      // Transform data to include agent and policy details
      const transformedData = data.map((commission) => ({
        ...commission,
        agent_name: commission.agents?.name || "Unknown",
        policy_number: commission.policies?.policy_number || "Unknown",
        policyholder_name: commission.policies?.policyholder_name || "Unknown"
      }));

      return { 
        data: transformedData, 
        totalCount: count || 0 
      };
    } catch (error) {
      console.error("Error fetching manual commissions:", error);
      toast({
        title: t("errorFetchingManualCommissions"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['manual-commissions', pagination, companyId],
    queryFn: fetchManualCommissions,
  });

  // Add manual commission mutation
  const addMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!companyId || !user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("manual_commissions")
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
      queryClient.invalidateQueries({ queryKey: ['manual-commissions'] });
      toast({
        title: t("manualCommissionAdded"),
        description: t("manualCommissionAddedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error adding manual commission:", error);
      toast({
        title: t("errorAddingManualCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Update manual commission mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { id, ...updateData } = formData;

      const { data, error } = await supabase
        .from("manual_commissions")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-commissions'] });
      toast({
        title: t("manualCommissionUpdated"),
        description: t("manualCommissionUpdatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error updating manual commission:", error);
      toast({
        title: t("errorUpdatingManualCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Delete manual commission mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("manual_commissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manual-commissions'] });
      toast({
        title: t("manualCommissionDeleted"),
        description: t("manualCommissionDeletedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deleting manual commission:", error);
      toast({
        title: t("errorDeletingManualCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  return {
    manualCommissions: data?.data || [],
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
    addManualCommission: addMutation.mutate,
    updateManualCommission: updateMutation.mutate,
    deleteManualCommission: deleteMutation.mutate,
    isSubmitting: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
