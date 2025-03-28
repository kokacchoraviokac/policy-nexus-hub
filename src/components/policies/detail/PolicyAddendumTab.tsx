
import React, { useState } from "react";
import { usePolicyAddendums } from "@/hooks/usePolicyAddendums";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import AddendumList from "@/components/policies/addendums/AddendumList";
import AddendumFormDialog from "@/components/policies/addendums/AddendumFormDialog";

interface PolicyAddendumTabProps {
  policyId: string;
  policyNumber: string;
}

const PolicyAddendumTab: React.FC<PolicyAddendumTabProps> = ({
  policyId,
  policyNumber,
}) => {
  const { t } = useLanguage();
  const [showAddendumForm, setShowAddendumForm] = useState(false);
  
  const {
    addendums,
    isLoading,
    isError,
    error,
    refetch
  } = usePolicyAddendums(policyId);
  
  const handleCreateAddendum = () => {
    setShowAddendumForm(true);
  };
  
  const handleAddendumFormClose = () => {
    setShowAddendumForm(false);
  };
  
  const handleAddendumCreated = () => {
    refetch();
    setShowAddendumForm(false);
  };
  
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
          <h3 className="font-semibold">{t("errorLoadingAddendums")}</h3>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : t("unknownError")}</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            {t("tryAgain")}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("policyAddendums")}</h2>
        <Button onClick={handleCreateAddendum}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createAddendum")}
        </Button>
      </div>
      
      <Separator />
      
      {addendums && addendums.length > 0 ? (
        <AddendumList addendums={addendums} onRefresh={refetch} />
      ) : (
        <EmptyState
          icon="file-edit"
          title={t("noAddendums")}
          description={t("noAddendumsDescription")}
          action={
            <Button onClick={handleCreateAddendum}>
              {t("createFirstAddendum")}
            </Button>
          }
        />
      )}
      
      {showAddendumForm && (
        <AddendumFormDialog
          policyId={policyId}
          policyNumber={policyNumber}
          open={showAddendumForm}
          onClose={handleAddendumFormClose}
          onSuccess={handleAddendumCreated}
        />
      )}
    </div>
  );
};

export default PolicyAddendumTab;
