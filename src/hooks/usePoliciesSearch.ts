
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";

export const usePoliciesSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['policies-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) {
        return { data: [], count: 0 };
      }
      
      const { data, error, count } = await supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name', { count: 'exact' })
        .or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return { 
        data: data as Pick<Policy, 'id' | 'policy_number' | 'policyholder_name' | 'insurer_name'>[], 
        count: count || 0 
      };
    },
    enabled: searchTerm.length >= 2,
  });

  return {
    policies: data?.data || [],
    count: data?.count || 0,
    isLoading,
    error,
    searchTerm,
    setSearchTerm
  };
};
