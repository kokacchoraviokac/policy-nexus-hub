
// Temporary mock implementation of useClients hook
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Client {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  is_active: boolean;
}

export const useClients = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock fetch clients function
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockClients: Client[] = Array(10).fill(null).map((_, i) => ({
        id: `client-${i + 1}`,
        name: `Client ${i + 1}`,
        contact_person: `Contact Person ${i + 1}`,
        email: `client${i + 1}@example.com`,
        phone: `+123456789${i}`,
        address: `Address ${i + 1}`,
        city: `City ${i + 1}`,
        country: `Country ${i + 1}`,
        is_active: true
      }));
      
      setClients(mockClients);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Unknown error'));
      toast({
        title: t("errorFetchingClients"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    clients,
    isLoading,
    error,
    fetchClients
  };
};

export default useClients;
