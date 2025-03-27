
import { useQuery } from "@tanstack/react-query";
import { Insurer } from "@/types/codebook";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export function useInsurerDetail() {
  const { insurerId } = useParams<{ insurerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  const { data: insurer, isLoading, error, refetch } = useQuery({
    queryKey: ['insurer', insurerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurers')
        .select('*')
        .eq('id', insurerId)
        .single();
      
      if (error) throw error;
      return data as Insurer;
    }
  });

  // Mock activity data - in a real app, this would be fetched from the database
  const activityData = [
    {
      id: '1',
      action: 'Updated insurer details',
      timestamp: new Date().toISOString(),
      user: 'Jane Smith',
      details: 'Changed contact person and updated address'
    },
    {
      id: '2',
      action: 'Created insurer record',
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      user: 'John Doe'
    }
  ];

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('insurers')
        .delete()
        .eq('id', insurer!.id);
      
      if (error) throw error;
      
      toast({
        title: t('insurerDeleted'),
        description: t('insurerDeletedDescription').replace('{0}', insurer!.name),
      });
      
      navigate('/codebook/companies');
    } catch (err: any) {
      toast({
        title: t('errorDeletingInsurer'),
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    try {
      if (!insurer) return;
      
      const { exportToCSV } = require('@/utils/csv');
      exportToCSV([insurer], `insurer_${insurer.id}_${new Date().toISOString().split('T')[0]}.csv`);
      
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

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    refetch();
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
