
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";

export const usePoliciesSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const searchPolicies = useCallback(async (term: string) => {
    setIsLoading(true);
    setIsSearching(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('id, policy_number, policyholder_name, insurer_name, insurer_id, status')
        .or(`policy_number.ilike.%${term}%,policyholder_name.ilike.%${term}%`)
        .eq('status', 'active')
        .order('policy_number', { ascending: true })
        .limit(20);
      
      if (error) throw error;
      
      setPolicies(data as Policy[]);
    } catch (err) {
      console.error('Error searching policies:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);
  
  useEffect(() => {
    if (debouncedSearchTerm.length < 2 && debouncedSearchTerm.length > 0) {
      return;
    }
    
    searchPolicies(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchPolicies]);
  
  return {
    searchTerm,
    setSearchTerm,
    policies,
    isLoading,
    error,
    searchPolicies,
    isSearching
  };
};
