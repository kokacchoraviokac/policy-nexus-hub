
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Insurer } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth/AuthContext';

export function useInsurersFetch(options = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const {
    data: insurers,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['insurers', searchTerm, page, pageSize, options],
    queryFn: async () => {
      // First, get the total count for pagination
      let countQuery = supabase
        .from('insurers')
        .select('*', { count: 'exact', head: true });
      
      if (user?.company_id) {
        countQuery = countQuery.eq('company_id', user.company_id);
      }
      
      if (searchTerm) {
        countQuery = countQuery.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%`);
      }
      
      if (options?.status && options.status !== 'all') {
        const isActive = options.status === 'active';
        countQuery = countQuery.eq('is_active', isActive);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error counting insurers:', countError);
        throw countError;
      }
      
      setTotalCount(count || 0);
      
      // Then, fetch the actual data for the current page
      let query = supabase
        .from('insurers')
        .select('*');
      
      if (user?.company_id) {
        query = query.eq('company_id', user.company_id);
      }
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%`);
      }
      
      if (options?.status && options.status !== 'all') {
        const isActive = options.status === 'active';
        query = query.eq('is_active', isActive);
      }
      
      // Add pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.order('name').range(from, to);
      
      const { data, error } = await query;
      
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
    refetch,
    pagination: {
      page,
      setPage,
      pageSize,
      setPageSize,
      totalCount
    }
  };
}
