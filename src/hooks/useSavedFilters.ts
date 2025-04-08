
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CodebookFilterState, SavedFilter } from "@/types/codebook";
import { useToast } from "@/hooks/use-toast";

export const useSavedFilters = (entityType: "clients" | "insurers" | "products") => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSavedFilters = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("saved_filters")
        .select("*")
        .eq("user_id", user.id)
        .eq("entity_type", entityType)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setSavedFilters(data as SavedFilter[]);
    } catch (err) {
      console.error("Error fetching saved filters:", err);
      setError(err as Error);
      toast({
        title: "Error fetching saved filters",
        description: "Could not load your saved filters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedFilters();
  }, [user, entityType]);

  const saveFilter = async (name: string, filters: CodebookFilterState): Promise<void> => {
    if (!user) throw new Error("User not authenticated");

    const newFilter = {
      name,
      entity_type: entityType,
      user_id: user.id,
      filters,
      company_id: user.company_id
    };

    const { error } = await supabase
      .from("saved_filters")
      .insert(newFilter);

    if (error) throw error;
    
    // Refresh the list after saving
    fetchSavedFilters();
  };

  const deleteFilter = async (filterId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("saved_filters")
      .delete()
      .eq("id", filterId)
      .eq("user_id", user.id);

    if (error) throw error;
    
    // Refresh the list after deleting
    fetchSavedFilters();
  };

  return {
    savedFilters,
    isLoading,
    error,
    saveFilter,
    deleteFilter,
    refreshFilters: fetchSavedFilters
  };
};
