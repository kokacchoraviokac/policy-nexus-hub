
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CodebookFilterState } from '@/types/codebook';
import { SavedFilter } from '@/types/savedFilters';
import { EntityType } from '@/types/savedFilters';

export function useSimpleSavedFilters(
  entityType: EntityType, 
  userId: string, 
  companyId: string
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch saved filters
  const { 
    data: savedFilters = [], 
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

  // Save filter mutation
  const saveFilterMutation = useMutation({
    mutationFn: async (params: { name: string, filters: CodebookFilterState }) => {
      const { name, filters } = params;
      
      const newFilter = {
        name,
        entity_type: entityType,
        filters: JSON.stringify(filters), // Convert to JSON string
        user_id: userId,
        company_id: companyId
      };
      
      const { data, error } = await supabase
        .from('saved_filters')
        .insert(newFilter);
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType, userId] });
    },
    onError: (error: Error) => {
      console.error('Error saving filter:', error);
      toast({
        title: 'Error saving filter',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Delete filter mutation  
  const deleteFilterMutation = useMutation({
    mutationFn: async (filterId: string) => {
      const { error } = await supabase
        .from('saved_filters')
        .delete()
        .eq('id', filterId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType, userId] });
      
      toast({
        title: 'Filter deleted',
        description: 'The filter has been deleted successfully',
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting filter:', error);
      toast({
        title: 'Error deleting filter',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Handle saving a filter
  const saveFilter = (name: string, filters: CodebookFilterState) => {
    saveFilterMutation.mutate({ name, filters });
  };

  // Handle deleting a filter
  const deleteFilter = (filterId: string) => {
    deleteFilterMutation.mutate(filterId);
  };

  // Parse the stored filter string back to CodebookFilterState
  const parseFilterData = (filter: SavedFilter): CodebookFilterState => {
    try {
      if (typeof filter.filters === 'string') {
        return JSON.parse(filter.filters) as CodebookFilterState;
      }
      // For backward compatibility
      return filter.filters as unknown as CodebookFilterState;
    } catch (error) {
      console.error('Error parsing filter data:', error);
      return { status: 'all' };
    }
  };

  return {
    savedFilters,
    isLoading,
    error,
    saveFilter,
    deleteFilter,
    parseFilterData,
    isSaving: saveFilterMutation.isPending,
    isDeleting: deleteFilterMutation.isPending
  };
}
