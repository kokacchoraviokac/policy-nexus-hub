
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { useDebounce } from "@/hooks/useDebounce";

export const usePoliciesSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchPolicies = async (term: string) => {
    if (!term || term.length < 2) return [];

    const { data, error } = await supabase
      .from('policies')
      .select('id, policy_number, policyholder_name, insurer_name')
      .or(`policy_number.ilike.%${term}%,policyholder_name.ilike.%${term}%`)
      .order('policy_number', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data as Policy[];
  };

  const {
    data = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['policies-search', debouncedSearchTerm],
    queryFn: () => fetchPolicies(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2,
  });

  return {
    policies: data,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetch
  };
};
