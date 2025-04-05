
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthContext';

export const usePolicySearch = () => {
  const [policies, setPolicies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { userProfile } = useAuth();
  
  const search = async (searchTerm: string) => {
    if (!searchTerm || !userProfile?.company_id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('company_id', userProfile.company_id)
        .or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`)
        .order('start_date', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      setPolicies(data || []);
    } catch (err) {
      console.error('Error searching policies:', err);
      setError(err instanceof Error ? err : new Error('Failed to search policies'));
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    policies,
    isLoading,
    error,
    search
  };
};
