
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInsurerDetail } from "@/hooks/useInsurerDetail";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import DeleteConfirmationDialog from "@/components/codebook/dialogs/DeleteConfirmationDialog";
import EntityNotFound from "@/components/codebook/details/EntityNotFound";
import EntityLoadError from "@/components/codebook/details/EntityLoadError";
import InsurerDetailTabs from "@/components/codebook/details/InsurerDetailTabs";
import InsurerDetailHeader from "@/components/codebook/details/insurers/InsurerDetailHeader";
import EditInsurerDialog from "@/components/codebook/details/insurers/EditInsurerDialog";
import AddProductDialog from "@/components/codebook/details/insurers/AddProductDialog";

export default function InsurerDetailPage() {
  const { t } = useLanguage();
  const {
    insurer,
    isLoading,
    error,
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
  } = useInsurerDetail();

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
      <InsurerDetailHeader />
      
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
      {insurer && (
        <EditInsurerDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          insurer={insurer}
          onEditSuccess={handleEditSuccess}
        />
      )}

      {/* Add Product Dialog */}
      {insurer && (
        <AddProductDialog
          open={isAddProductDialogOpen}
          onOpenChange={setIsAddProductDialogOpen}
          insurer={insurer}
          onProductAdded={handleProductAdded}
        />
      )}

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
