
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Insurer } from "@/types/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseInsurersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export const useInsurers = ({
  page = 1,
  pageSize = 10,
  search = "",
  status
}: UseInsurersParams = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create a query key that includes all filtering parameters
  const queryKey = ['insurers', page, pageSize, search, status, user?.company_id];
  
  // Use TanStack Query to handle data fetching and caching
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      // Get company_id from user context
      const companyId = user?.company_id;
      if (!companyId) throw new Error("Company ID not found");
      
      let query = supabase
        .from('insurers')
        .select('*', { count: 'exact' })
        .eq('company_id', companyId)
        .order('name', { ascending: true });
      
      // Apply status filter if provided
      if (status) {
        const isActive = status === 'active';
        query = query.eq('is_active', isActive);
      }
      
      // Apply search filter if provided
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching insurers:", error);
        throw error;
      }
      
      return {
        insurers: data as Insurer[],
        totalItems: count || 0,
        totalPages: count ? Math.ceil(count / pageSize) : 0
      };
    },
    enabled: !!user?.company_id,
  });
  
  // Create mutation for deleting an insurer
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurers'] });
      toast({
        title: "Insurer deleted",
        description: "The insurer has been successfully deleted."
      });
    },
    onError: (error) => {
      console.error("Error deleting insurer:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the insurer.",
        variant: "destructive"
      });
    }
  });
  
  // Create mutation for creating an insurer
  const createMutation = useMutation({
    mutationFn: async (newInsurer: Partial<Insurer>) => {
      // Ensure the company_id is set to the current user's company
      const insurerWithCompanyId = {
        ...newInsurer,
        company_id: user?.company_id
      };
      
      const { data, error } = await supabase
        .from('insurers')
        .insert(insurerWithCompanyId)
        .select();
      
      if (error) throw error;
      return data[0] as Insurer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurers'] });
    },
    onError: (error) => {
      console.error("Error creating insurer:", error);
      throw error;
    }
  });
  
  // Create mutation for updating an insurer
  const updateMutation = useMutation({
    mutationFn: async ({ id, updateData }: { id: string; updateData: Partial<Insurer> }) => {
      const { data, error } = await supabase
        .from('insurers')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Insurer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurers'] });
    },
    onError: (error) => {
      console.error("Error updating insurer:", error);
      throw error;
    }
  });
  
  // Wrapper functions to simplify API
  const deleteInsurer = (id: string) => deleteMutation.mutate(id);
  const createInsurer = async (insurer: Partial<Insurer>) => {
    return createMutation.mutateAsync(insurer);
  };
  const updateInsurer = async (id: string, insurer: Partial<Insurer>) => {
    return updateMutation.mutateAsync({ id, updateData: insurer });
  };
  
  return {
    insurers: data?.insurers || [],
    totalItems: data?.totalItems || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    deleteInsurer,
    refreshInsurers: refetch,
    createInsurer,
    updateInsurer,
    isDeleting: deleteMutation.isPending
  };
};
