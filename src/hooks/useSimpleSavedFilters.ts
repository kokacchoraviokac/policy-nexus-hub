
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CodebookFilterState } from '@/types/codebook';
import { SavedFilter, EntityType } from '@/types/savedFilters';

export function useSimpleSavedFilters(
  entityType: EntityType, 
  userId?: string, 
  companyId?: string
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch saved filters
  const { data: savedFilters, isLoading } = useQuery({
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
          title: 'Error',
          description: 'Could not load saved filters',
          variant: 'destructive',
        });
        return [];
      }
      
      return data as SavedFilter[];
    },
    enabled: !!userId,
  });

  // Save filter mutation
  const saveFilterMutation = useMutation({
    mutationFn: async ({ name, filters }: { name: string, filters: CodebookFilterState }) => {
      if (!userId) throw new Error('User ID is required');
      
      const newFilter = {
        name,
        entity_type: entityType,
        filters: JSON.stringify(filters),
        user_id: userId,
        company_id: companyId || '00000000-0000-0000-0000-000000000000'
      };
      
      const { error } = await supabase
        .from('saved_filters')
        .insert(newFilter);
      
      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType] });
      toast({
        title: 'Success',
        description: 'Filter saved successfully',
      });
    },
    onError: (error) => {
      console.error('Error saving filter:', error);
      toast({
        title: 'Error',
        description: 'Could not save filter',
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
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFilters', entityType] });
      toast({
        title: 'Success',
        description: 'Filter deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Error deleting filter:', error);
      toast({
        title: 'Error',
        description: 'Could not delete filter',
        variant: 'destructive',
      });
    }
  });

  // Helper function to parse filter data
  const parseFilterData = (filterData: SavedFilter): CodebookFilterState => {
    try {
      return JSON.parse(filterData.filters) as CodebookFilterState;
    } catch (error) {
      console.error("Error parsing filter data:", error);
      return {};
    }
  };

  return {
    savedFilters: savedFilters || [],
    isLoading,
    saveFilter: (name: string, filters: CodebookFilterState) => 
      saveFilterMutation.mutate({ name, filters }),
    deleteFilter: (filterId: string) => 
      deleteFilterMutation.mutate(filterId),
    parseFilterData,
    isSaving: saveFilterMutation.isPending,
    isDeleting: deleteFilterMutation.isPending
  };
}
