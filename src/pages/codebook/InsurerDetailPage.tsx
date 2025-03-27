
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Book, Building2, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import { Insurer } from "@/types/codebook";
import { exportToCSV } from "@/utils/csv";
import { useToast } from "@/hooks/use-toast";
import DeleteConfirmationDialog from "@/components/codebook/dialogs/DeleteConfirmationDialog";
import InsurerForm from "@/components/codebook/forms/InsurerForm";
import EntityNotFound from "@/components/codebook/details/EntityNotFound";
import EntityLoadError from "@/components/codebook/details/EntityLoadError";
import InsurerDetailTabs from "@/components/codebook/details/InsurerDetailTabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProductForm from "@/components/codebook/forms/ProductForm";
import { useLanguage } from "@/contexts/LanguageContext";

export default function InsurerDetailPage() {
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
      exportToCSV([insurer], `insurer_${insurer!.id}_${new Date().toISOString().split('T')[0]}.csv`);
      
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

  if (isLoading) {
    return <div className="flex justify-center p-8">{t('loadingInsurerDetails')}</div>;
  }

  if (error) {
    return <EntityLoadError entityType={t('insurer')} error={error as Error} />;
  }

  if (!insurer) {
    return <EntityNotFound entityType={t('insurer')} backPath="/codebook/companies" backLabel={t('insuranceCompaniesDirectory')} />;
  }

  const tabs = InsurerDetailTabs({ 
    insurer, 
    activityData, 
    onAddProduct: handleAddProduct 
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{t('codebook')}</h1>
        <span className="text-muted-foreground">/</span>
        <div className="flex items-center space-x-1">
          <Building2 className="h-5 w-5" />
          <span className="font-medium">{t('insuranceCompanyDetails')}</span>
        </div>
      </div>
      
      <EntityDetailsCard
        title={insurer.name}
        subtitle={insurer.contact_person ? `${t('contact')}: ${insurer.contact_person}` : undefined}
        backLink="/codebook/companies"
        backLinkLabel={t('insuranceCompaniesDirectory')}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onExport={handleExport}
        tabs={tabs}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('editInsurer')}</DialogTitle>
            <DialogDescription>
              {t('editInsurerDescription')}
            </DialogDescription>
          </DialogHeader>
          {insurer && (
            <InsurerForm 
              defaultValues={{
                name: insurer.name,
                contact_person: insurer.contact_person || "",
                email: insurer.email || "",
                phone: insurer.phone || "",
                address: insurer.address || "",
                city: insurer.city || "",
                postal_code: insurer.postal_code || "",
                country: insurer.country || "",
                registration_number: insurer.registration_number || "",
                is_active: insurer.is_active,
              }} 
              onSubmit={(values) => {
                handleEditSuccess();
              }}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('addProduct')}</DialogTitle>
            <DialogDescription>
              {t('addProductForInsurerDescription')}
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            defaultValues={{
              code: "",
              name: "",
              category: "",
              description: "",
              is_active: true,
              insurer_id: insurer.id,
            }}
            onSubmit={() => handleProductAdded()}
            onCancel={() => setIsAddProductDialogOpen(false)}
            isSubmitting={false}
            preselectedInsurerId={insurer.id}
            preselectedInsurerName={insurer.name}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        entityName={t('insuranceCompany')}
        entityTitle={insurer.name}
      />
    </div>
  );
}
