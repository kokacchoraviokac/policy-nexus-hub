
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Insurer } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';

export function useInsurersFetch() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: insurers,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['insurers', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('insurers')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching insurers:', error);
        toast({
          title: 'Error fetching insurers',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as Insurer[];
    }
  });

  return {
    insurers,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    refetch
  };
}
