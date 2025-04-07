
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Insurer } from "@/types/codebook";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useInsurersCrud = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const addInsurerMutation = useMutation({
    mutationFn: async (insurerData: Partial<Insurer>) => {
      // Ensure company_id is set
      const newInsurer = {
        ...insurerData,
        company_id: user?.company_id || ""
      };

      const { data, error } = await supabase
        .from("insurers")
        .insert(newInsurer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurers"] });
      toast({
        title: "Insurer added",
        description: "The insurer has been added successfully.",
      });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error adding insurer:", error);
      setError(error.message || "Failed to add insurer");
      toast({
        title: "Error",
        description: error.message || "Failed to add insurer",
        variant: "destructive",
      });
    }
  });

  // Type definition for the update parameters
  type UpdateInsurerParams = {
    id: string;
    updateData: Partial<Insurer>;
  };

  const updateInsurerMutation = useMutation({
    mutationFn: async ({ id, updateData }: UpdateInsurerParams) => {
      const { data, error } = await supabase
        .from("insurers")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurers"] });
      toast({
        title: "Insurer updated",
        description: "The insurer has been updated successfully.",
      });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error updating insurer:", error);
      setError(error.message || "Failed to update insurer");
      toast({
        title: "Error",
        description: error.message || "Failed to update insurer",
        variant: "destructive",
      });
    }
  });

  const deleteInsurerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("insurers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurers"] });
      toast({
        title: "Insurer deleted",
        description: "The insurer has been deleted successfully.",
      });
      setError(null);
    },
    onError: (error: any) => {
      console.error("Error deleting insurer:", error);
      setError(error.message || "Failed to delete insurer");
      toast({
        title: "Error",
        description: error.message || "Failed to delete insurer",
        variant: "destructive",
      });
    }
  });

  return {
    addInsurer: addInsurerMutation.mutate,
    updateInsurer: updateInsurerMutation.mutate,
    deleteInsurer: deleteInsurerMutation.mutate,
    isAdding: addInsurerMutation.isPending,
    isUpdating: updateInsurerMutation.isPending,
    isDeleting: deleteInsurerMutation.isPending,
    error
  };
};
