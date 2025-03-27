
import React from "react";
import { useInsurerDetail } from "@/hooks/useInsurerDetail";
import InsurerDetailHeader from "@/components/codebook/details/insurers/InsurerDetailHeader";
import { EntityDetailsCard } from "@/components/codebook/details/EntityDetailsCard";
import { EntityLoadError } from "@/components/codebook/details/EntityLoadError";
import InsurerDetailTabs from "@/components/codebook/details/InsurerDetailTabs";
import DeleteInsurerDialog from "@/components/codebook/dialogs/DeleteInsurerDialog";
import EditInsurerDialog from "@/components/codebook/details/insurers/EditInsurerDialog";
import AddProductDialog from "@/components/codebook/details/insurers/AddProductDialog";
import { EntityNotFound } from "@/components/codebook/details/EntityNotFound";
import { useLanguage } from "@/contexts/LanguageContext";

const InsurerDetailPage = () => {
  const { t } = useLanguage();
  const {
    insurer,
    isLoading,
    error,
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
  } = useInsurerDetail();

  if (isLoading) {
    return (
      <div className="container py-6">
        <InsurerDetailHeader />
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <EntityLoadError error={error} entityType="insurer" />;
  }

  if (!insurer) {
    return <EntityNotFound entityType="insurer" />;
  }

  const tabs = InsurerDetailTabs({
    insurer,
    activityData,
    isLoadingActivity,
    onAddProduct: handleAddProduct
  });

  return (
    <div className="container py-6">
      <InsurerDetailHeader title={insurer.name} />
      
      <EntityDetailsCard
        title={insurer.name}
        subtitle={insurer.is_active ? t('activeInsurer') : t('inactiveInsurer')}
        backLink="/codebook/companies"
        backLinkLabel={t('insuranceCompanies')}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onExport={handleExport}
        tabs={tabs}
      />
      
      <DeleteInsurerDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        insurer={insurer}
      />
      
      <EditInsurerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        insurer={insurer}
        onEditSuccess={handleEditSuccess}
      />
      
      <AddProductDialog
        open={isAddProductDialogOpen}
        onOpenChange={setIsAddProductDialogOpen}
        insurer={insurer}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default InsurerDetailPage;
