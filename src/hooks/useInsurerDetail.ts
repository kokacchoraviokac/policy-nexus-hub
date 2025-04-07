
import { useQuery, useMutation } from "@tanstack/react-query";
import { Insurer } from "@/types/codebook";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useActivityLogger, fetchActivityLogs } from "@/utils/activityLogger";
import { EntityType } from "@/types/common";

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  userEmail?: string;
  details?: string;
}

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
          entity_type: EntityType.INSURER,
          entity_id: data.id,
          action: "view"
        });
      }
      
      return data as Insurer;
    }
  });

  // Fetch activity logs
  const { data: activityData = [], isLoading: isLoadingActivity } = useQuery({
    queryKey: ['insurer-activity', insurerId],
    queryFn: async () => {
      if (!insurerId) return [];
      
      const logs = await fetchActivityLogs(EntityType.INSURER, insurerId);
      
      // Transform data to include stringified details for the UI
      return logs.map(log => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        user: log.user,
        details: log.details ? JSON.stringify(log.details) : undefined
      })) as ActivityItem[];
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
        entity_type: EntityType.INSURER,
        entity_id: insurer.id,
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
      
      // Log export activity using 'update' action since 'export' is not in the allowed types
      logActivity({
        entity_type: EntityType.INSURER,
        entity_id: insurer.id,
        action: "update", // Using update instead of export to match allowed types
        details: { action_type: "export", format: "CSV" }
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
