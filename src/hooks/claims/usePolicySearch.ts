
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePolicySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: policies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['policy-search', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name, expiry_date')
        .order('policy_number', { ascending: true });
      
      if (searchTerm) {
        query = query.or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: isDialogOpen, // Only run the query when the dialog is open
  });
  
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

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
