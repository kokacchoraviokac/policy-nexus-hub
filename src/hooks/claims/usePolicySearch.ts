
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePolicySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: policies = [], isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['policy-search', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name, product_name')
        .or(`policy_number.ilike.%${debouncedSearchTerm}%,policyholder_name.ilike.%${debouncedSearchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return {
    searchTerm,
    setSearchTerm,
    policies,
    isPoliciesLoading,
    isDialogOpen,
    openDialog,
    closeDialog
  };
};
