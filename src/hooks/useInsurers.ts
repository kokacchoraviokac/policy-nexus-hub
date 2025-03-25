
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Insurer } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';

export function useInsurers() {
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
    insurers,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    addInsurer,
    updateInsurer,
    deleteInsurer,
    refetch
  };
}
