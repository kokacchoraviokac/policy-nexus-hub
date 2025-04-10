
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CodebookFilterState, SavedFilter } from '@/types/codebook';

export function useSavedFilters(
  entityType: 'insurers' | 'clients' | 'products', 
  userId?: string, 
  companyId?: string
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch saved filters for the current user and entity type
  const { 
    data: savedFilters, 
    isLoading,
    error
  } = useQuery({
    queryKey: ['savedFilters', entityType, userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('saved_filters')
        .select('*')
        .eq('user_id', userId)
        .eq('entity_type', entityType);
      
      if (error) {
        console.error('Error fetching saved filters:', error);
        toast({
          title: 'Error fetching saved filters',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as SavedFilter[];
    },
    enabled: !!userId,
  });

  // Save a new filter
  const saveFilter = async (name: string, filters: CodebookFilterState): Promise<void> => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to save filters',
        variant: 'destructive',
      });
      return;
    }
    
    const newFilter = {
      name,
      entity_type: entityType,
      filters: JSON.stringify(filters), // Convert CodebookFilterState to JSON string
      user_id: userId,
      company_id: companyId || '00000000-0000-0000-0000-000000000000' // Fallback if no company_id
    };
    
    try {
      const { error } = await supabase
        .from('saved_filters')
        .insert(newFilter);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType] });
      
      toast({
        title: 'Filter saved',
        description: `Filter "${name}" has been saved successfully`,
      });
    } catch (error: any) {
      console.error('Error saving filter:', error);
      toast({
        title: 'Error saving filter',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Delete a saved filter
  const deleteFilter = async (filterId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('saved_filters')
        .delete()
        .eq('id', filterId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType] });
      
      toast({
        title: 'Filter deleted',
        description: 'The filter has been deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting filter:', error);
      toast({
        title: 'Error deleting filter',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    savedFilters: savedFilters || [],
    isLoading,
    error,
    saveFilter,
    deleteFilter
  };
}
