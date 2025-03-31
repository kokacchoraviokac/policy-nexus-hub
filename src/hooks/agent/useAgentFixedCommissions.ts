
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";

export const useAgentFixedCommissions = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const companyId = user?.companyId;

  const fetchFixedCommissions = async () => {
    if (!companyId) {
      return { data: [], totalCount: 0 };
    }

    try {
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      const { data, error, count } = await supabase
        .from("fixed_commissions")
        .select(`
          *,
          agents(name)
        `, { count: 'exact' })
        .eq("company_id", companyId)
        .order("effective_from", { ascending: false })
        .range(from, to);

      if (error) {
        throw error;
      }

      // Transform data to include agent name
      const transformedData = data.map((commission) => ({
        ...commission,
        agent_name: commission.agents?.name || "Unknown"
      }));

      return { 
        data: transformedData, 
        totalCount: count || 0 
      };
    } catch (error) {
      console.error("Error fetching fixed commissions:", error);
      toast({
        title: t("errorFetchingFixedCommissions"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['fixed-commissions', pagination, companyId],
    queryFn: fetchFixedCommissions,
  });

  // Add fixed commission mutation
  const addMutation = useMutation({
    mutationFn: async (formData: any) => {
      if (!companyId || !user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("fixed_commissions")
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
      queryClient.invalidateQueries({ queryKey: ['fixed-commissions'] });
      toast({
        title: t("fixedCommissionAdded"),
        description: t("fixedCommissionAddedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error adding fixed commission:", error);
      toast({
        title: t("errorAddingFixedCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Update fixed commission mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: any) => {
      const { id, ...updateData } = formData;

      const { data, error } = await supabase
        .from("fixed_commissions")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-commissions'] });
      toast({
        title: t("fixedCommissionUpdated"),
        description: t("fixedCommissionUpdatedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error updating fixed commission:", error);
      toast({
        title: t("errorUpdatingFixedCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Delete fixed commission mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fixed_commissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-commissions'] });
      toast({
        title: t("fixedCommissionDeleted"),
        description: t("fixedCommissionDeletedSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deleting fixed commission:", error);
      toast({
        title: t("errorDeletingFixedCommission"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  return {
    fixedCommissions: data?.data || [],
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
    addFixedCommission: addMutation.mutate,
    updateFixedCommission: updateMutation.mutate,
    deleteFixedCommission: deleteMutation.mutate,
    isSubmitting: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
