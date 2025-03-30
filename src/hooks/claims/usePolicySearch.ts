
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePolicySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: policies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['policies-search', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (searchTerm) {
        query = query.or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: isDialogOpen
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
