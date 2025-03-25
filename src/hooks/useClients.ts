
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Client } from '@/types/codebook';
import { useToast } from '@/hooks/use-toast';

export function useClients() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: clients,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('clients')
        .select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: 'Error fetching clients',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }
      
      return data as Client[];
    }
  });

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Client added',
        description: `Successfully added client: ${client.name}`,
      });
      
      refetch();
      return data;
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast({
        title: 'Error adding client',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Client updated',
        description: 'Client information has been updated successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast({
        title: 'Error updating client',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Client deleted',
        description: 'Client has been deleted successfully.',
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error deleting client',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    clients,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    addClient,
    updateClient,
    deleteClient,
    refetch
  };
}
