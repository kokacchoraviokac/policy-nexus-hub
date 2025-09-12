
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/auth/AuthContext";

// Mock data for development
const MOCK_CLIENTS: Client[] = [
  {
    id: "client-1",
    name: "Demo Client 1",
    contact_person: "John Doe",
    email: "john@democlient1.com",
    phone: "+1234567890",
    address: "123 Main St",
    city: "New York",
    postal_code: "10001",
    country: "USA",
    tax_id: "TAX123456",
    registration_number: "REG123456",
    is_active: true,
    notes: "Demo client for testing",
    company_id: "550e8400-e29b-41d4-a716-446655440000",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockClientStorage = [...MOCK_CLIENTS];

export interface Client {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  registration_number?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export const useClients = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const companyId = user?.companyId;

  const fetchClients = async () => {
    if (!companyId) {
      return [];
    }

    // Check if we're using mock authentication
    const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
    
    if (isMockUser) {
      // Return mock data for mock users
      console.log("Using mock client data");
      return mockClientStorage.filter(client => client.company_id === companyId && client.is_active);
    }

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .order("name");

      if (error) {
        throw error;
      }

      return data as Client[];
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: t("errorFetchingClients"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
      throw error;
    }
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: fetchClients,
    enabled: !!companyId,
  });

  // Add Client Mutation
  const addClientMutation = useMutation({
    mutationFn: async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
      if (!companyId) throw new Error("Company ID is required");
      
      // Check if we're using mock authentication
      const isMockUser = user?.email?.includes('@policyhub.com') || user?.id === "1";
      
      if (isMockUser) {
        // Mock client creation
        const newClient: Client = {
          ...clientData,
          id: `client-${Date.now()}`,
          company_id: companyId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockClientStorage.push(newClient);
        console.log("Mock client created:", newClient);
        return newClient;
      }
      
      const { data, error } = await supabase
        .from("clients")
        .insert({ ...clientData, company_id: companyId })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: t("clientAdded"),
        description: t("clientAddedSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorAddingClient"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Update Client Mutation
  const updateClientMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & Partial<Client>) => {
      const { data, error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: t("clientUpdated"),
        description: t("clientUpdatedSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorUpdatingClient"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  // Delete (Deactivate) Client Mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("clients")
        .update({ is_active: false })
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: t("clientDeactivated"),
        description: t("clientDeactivatedSuccess"),
      });
    },
    onError: (error) => {
      toast({
        title: t("errorDeactivatingClient"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    }
  });

  return {
    clients: data || [],
    isLoading,
    isError,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    addClient: addClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
};
