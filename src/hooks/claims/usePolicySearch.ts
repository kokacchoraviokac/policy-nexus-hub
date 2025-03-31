
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePolicySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: policies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['policy-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name, expiry_date')
        .or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: searchTerm.length >= 2,
  });
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  
  return {
    searchTerm,
    setSearchTerm,
    policies: policies || [],
    isPoliciesLoading,
    isDialogOpen,
    openDialog,
    closeDialog
  };
};
