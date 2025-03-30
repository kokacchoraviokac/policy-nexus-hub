
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";

export const usePoliciesSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    const fetchPolicies = async () => {
      if (debouncedSearchTerm.length < 2) {
        setPolicies([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('policies')
          .select('id, policy_number, policyholder_name, insurer_name, insurer_id, status')
          .or(`policy_number.ilike.%${debouncedSearchTerm}%,policyholder_name.ilike.%${debouncedSearchTerm}%`)
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
      }
    };
    
    fetchPolicies();
  }, [debouncedSearchTerm]);
  
  return {
    searchTerm,
    setSearchTerm,
    policies,
    isLoading,
    error
  };
};
