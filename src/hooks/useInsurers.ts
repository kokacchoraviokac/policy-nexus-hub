
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Insurer, CodebookFilterState } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';

export function useInsurers() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CodebookFilterState>({
    status: 'all',
    country: ''
  });
  const [filteredInsurers, setFilteredInsurers] = useState<Insurer[]>([]);

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

  // Apply filters to insurers
  useEffect(() => {
    if (!insurers) return;
    
    let filtered = [...insurers];
    
    // Filter by status
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter(insurer => insurer.is_active === isActive);
    }
    
    // Filter by country
    if (filters.country && filters.country.trim() !== '') {
      filtered = filtered.filter(insurer => 
        insurer.country && insurer.country.toLowerCase().includes(filters.country!.toLowerCase())
      );
    }
    
    // Filter by city
    if (filters.city && filters.city.trim() !== '') {
      filtered = filtered.filter(insurer => 
        insurer.city && insurer.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    
    // Filter by date created (after)
    if (filters.createdAfter) {
      filtered = filtered.filter(insurer => {
        const createdAt = new Date(insurer.created_at);
        return createdAt >= filters.createdAfter!;
      });
    }
    
    // Filter by date created (before)
    if (filters.createdBefore) {
      filtered = filtered.filter(insurer => {
        const createdAt = new Date(insurer.created_at);
        return createdAt <= filters.createdBefore!;
      });
    }
    
    setFilteredInsurers(filtered);
  }, [insurers, filters, searchTerm]);

  const handleFilterChange = (newFilters: CodebookFilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilter = (key: keyof CodebookFilterState) => {
    setFilters(prev => {
      const updatedFilters = { ...prev };
      if (key === 'status') {
        updatedFilters.status = 'all';
      } else {
        updatedFilters[key] = undefined;
      }
      return updatedFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      country: ''
    });
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.country && filters.country.trim() !== '') count++;
    if (filters.city && filters.city.trim() !== '') count++;
    if (filters.createdAfter) count++;
    if (filters.createdBefore) count++;
    return count;
  };

  const addInsurer = async (insurer: Omit<Insurer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('insurers')
        .insert(insurer)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Insurance company added',
        description: `Successfully added insurer: ${insurer.name}`,
      });
      
      refetch();
      return data;
    } catch (error: any) {
      console.error('Error adding insurer:', error);
      toast({
        title: 'Error adding insurance company',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateInsurer = async (id: string, updates: Partial<Insurer>) => {
    try {
      const { error } = await supabase
        .from('insurers')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Insurance company updated',
        description: 'Insurer information has been updated successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating insurer:', error);
      toast({
        title: 'Error updating insurance company',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteInsurer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Insurance company deleted',
        description: 'Insurer has been deleted successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting insurer:', error);
      toast({
        title: 'Error deleting insurance company',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    insurers: filteredInsurers,
    allInsurers: insurers,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    handleFilterChange,
    handleClearFilter,
    resetFilters,
    getActiveFilterCount,
    addInsurer,
    updateInsurer,
    deleteInsurer,
    refetch
  };
}
