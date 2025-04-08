
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Insurer } from "@/types/codebook";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseInsurersProps {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'active' | 'inactive';
  shouldFetch?: boolean;
}

export function useInsurers({
  page = 1,
  pageSize = 10,
  search = '',
  status,
  shouldFetch = true
}: UseInsurersProps = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchInsurers = useCallback(async () => {
    if (!user?.company_id || !shouldFetch) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create query
      let query = supabase
        .from('insurers')
        .select('*', { count: 'exact' })
        .eq('company_id', user.company_id);
      
      // Apply search filter
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      // Apply status filter
      if (status) {
        const isActive = status === 'active';
        query = query.eq('is_active', isActive);
      }
      
      // Calculate pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Apply pagination and order
      query = query
        .order('name', { ascending: true })
        .range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      setInsurers(data as Insurer[]);
      
      if (count !== null) {
        setTotalItems(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (err) {
      console.error('Error fetching insurers:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch insurers'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.company_id, page, pageSize, search, status, shouldFetch]);

  useEffect(() => {
    fetchInsurers();
  }, [fetchInsurers]);

  const refreshInsurers = useCallback(() => {
    fetchInsurers();
  }, [fetchInsurers]);

  const createInsurer = useCallback(async (insurerData: Partial<Insurer>) => {
    if (!user?.company_id) {
      throw new Error('No company ID available');
    }
    
    setIsCreating(true);
    
    try {
      // Ensure company_id is set
      const newInsurer = {
        ...insurerData,
        company_id: user.company_id,
        name: insurerData.name || '' // Ensure name is provided
      };
      
      const { data, error } = await supabase
        .from('insurers')
        .insert(newInsurer)
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to state
      setInsurers(prev => [data as Insurer, ...prev]);
      
      // Update total counts
      setTotalItems(prev => prev + 1);
      setTotalPages(Math.ceil((totalItems + 1) / pageSize));
      
      return data as Insurer;
    } catch (err) {
      console.error('Error creating insurer:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [user?.company_id, totalItems, pageSize]);

  const updateInsurer = useCallback(async (insurerData: Partial<Insurer>) => {
    if (!insurerData.id) {
      throw new Error('Insurer ID is required for updates');
    }
    
    setIsUpdating(true);
    
    try {
      const { data, error } = await supabase
        .from('insurers')
        .update(insurerData)
        .eq('id', insurerData.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update in state
      setInsurers(prev => 
        prev.map(insurer => 
          insurer.id === insurerData.id ? (data as Insurer) : insurer
        )
      );
      
      return data as Insurer;
    } catch (err) {
      console.error('Error updating insurer:', err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteInsurer = useCallback(async (insurerId: string) => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', insurerId);
      
      if (error) throw error;
      
      // Remove from state
      setInsurers(prev => prev.filter(insurer => insurer.id !== insurerId));
      
      // Update total counts
      setTotalItems(prev => prev - 1);
      setTotalPages(Math.ceil((totalItems - 1) / pageSize));
      
    } catch (err) {
      console.error('Error deleting insurer:', err);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [totalItems, pageSize]);

  return {
    insurers,
    isLoading,
    error,
    totalItems,
    totalPages,
    isDeleting,
    isUpdating,
    isCreating,
    refreshInsurers,
    createInsurer,
    updateInsurer,
    deleteInsurer
  };
}
