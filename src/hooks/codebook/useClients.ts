
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface Client {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  tax_id: string;
  registration_number: string;
  notes: string;
  is_active: boolean;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export const useClients = (searchQuery?: string) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('clients')
        .select('*')
        .eq('company_id', user?.companyId);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setClients(data || []);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Update local state
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      toast.success("Client deleted successfully");
    } catch (err) {
      console.error("Error deleting client:", err);
      toast.error("Failed to delete client");
    }
  };

  const refresh = () => fetchClients();

  useEffect(() => {
    if (user?.companyId) {
      fetchClients();
    }
  }, [user?.companyId, searchQuery]);

  return {
    clients,
    isLoading,
    error,
    deleteClient,
    refresh,
    fetchClients
  };
};
