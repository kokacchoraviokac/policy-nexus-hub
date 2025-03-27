
import { useQuery, useMutation } from "@tanstack/react-query";
import { Insurer } from "@/types/codebook";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { fetchActivityLogs, useActivityLogger } from "@/utils/activityLogger";

export function useInsurerDetail() {
  const { insurerId } = useParams<{ insurerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const { logActivity } = useActivityLogger();

  const { data: insurer, isLoading, error, refetch } = useQuery({
    queryKey: ['insurer', insurerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurers')
        .select('*')
        .eq('id', insurerId)
        .single();
      
      if (error) throw error;
      
      // Log view activity
      if (data) {
        logActivity({
          entityType: "insurer",
          entityId: data.id,
          action: "view"
        });
      }
      
      return data as Insurer;
    }
  });

  // Fetch real activity logs instead of using mock data
  const { data: activityData = [], isLoading: isLoadingActivity } = useQuery({
    queryKey: ['insurer-activity', insurerId],
    queryFn: async () => {
      if (!insurerId) return [];
      return fetchActivityLogs("insurer", insurerId);
    },
    enabled: !!insurerId
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!insurer) throw new Error("No insurer data");
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', insurer.id);
      
      if (error) throw error;
      
      // Log delete activity
      await logActivity({
        entityType: "insurer",
        entityId: insurer.id,
        action: "delete",
        details: { name: insurer.name }
      });
    },
    onSuccess: () => {
      toast({
        title: t('insurerDeleted'),
        description: t('insurerDeletedDescription').replace('{0}', insurer!.name),
      });
      navigate('/codebook/companies');
    },
    onError: (err: any) => {
      toast({
        title: t('errorDeletingInsurer'),
        description: err.message,
        variant: 'destructive',
      });
    }
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleExport = () => {
    try {
      if (!insurer) return;
      
      const { exportToCSV } = require('@/utils/csv');
      exportToCSV([insurer], `insurer_${insurer.id}_${new Date().toISOString().split('T')[0]}.csv`);
      
      // Log export activity
      logActivity({
        entityType: "insurer",
        entityId: insurer.id,
        action: "export",
        details: { format: "CSV" }
      });
      
      toast({
        title: t('exportSuccessful'),
        description: t('insurerDataExported'),
      });
    } catch (error: any) {
      toast({
        title: t('exportFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditSuccess = async () => {
    setIsEditDialogOpen(false);
    await refetch();
    toast({
      title: t('insurerUpdated'),
      description: t('insurerUpdatedDescription'),
    });
  };

  const handleAddProduct = () => {
    setIsAddProductDialogOpen(true);
  };

  const handleProductAdded = () => {
    setIsAddProductDialogOpen(false);
    toast({
      title: t('productAdded'),
      description: t('productAddedDescription'),
    });
  };

  return {
    insurer,
    isLoading,
    error,
    refetch,
    activityData,
    isLoadingActivity,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isAddProductDialogOpen,
    setIsAddProductDialogOpen,
    handleDelete,
    handleExport,
    handleEditSuccess,
    handleAddProduct,
    handleProductAdded
  };
}
