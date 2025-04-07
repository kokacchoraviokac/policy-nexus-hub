
import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EntityType } from "@/types/common";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentList from "@/components/documents/unified/DocumentList";
import DocumentUploadDialog from "@/components/documents/unified/DocumentUploadDialog";
import { useActivityLogger } from "@/utils/activityLogger";

interface PolicyDocumentsTabProps {
  policyId: string;
  isComplete: boolean;
  onCompleteChange: (isComplete: boolean) => void;
}

const PolicyDocumentsTab: React.FC<PolicyDocumentsTabProps> = ({
  policyId,
  isComplete: initialIsComplete,
  onCompleteChange,
}) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isComplete, setIsComplete] = useState(initialIsComplete);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { logActivity } = useActivityLogger();
  
  const {
    documents,
    isLoading,
    isError,
    error,
    refetch,
    deleteDocument,
    isDeletingDocument,
  } = useDocuments(EntityType.POLICY, policyId);
  
  useEffect(() => {
    setIsComplete(initialIsComplete);
  }, [initialIsComplete]);
  
  const handleCompleteChange = (checked: boolean) => {
    setIsComplete(checked);
    onCompleteChange(checked);
    
    // Log the activity
    logActivity({
      entity_type: EntityType.POLICY,
      entity_id: policyId,
      action: "update",
      details: {
        status: checked ? "complete" : "incomplete",
        timestamp: new Date().toISOString()
      }
    });
  };
  
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("policyDocuments")}</h3>
          <Button size="sm" onClick={() => setShowUploadDialog(true)}>
            {t("uploadDocument")}
          </Button>
        </div>
        
        <DocumentList
          entityType={EntityType.POLICY}
          entityId={policyId}
          documents={documents}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDelete={deleteDocument}
          isDeleting={isDeletingDocument}
        />
        
        <div className="flex items-center justify-end">
          <label
            htmlFor="isComplete"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("documentsVerified")}
          </label>
          <Checkbox
            id="isComplete"
            checked={isComplete}
            onCheckedChange={handleCompleteChange}
            className="ml-2"
          />
        </div>
      </CardContent>
      
      <DocumentUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        entityType={EntityType.POLICY}
        entityId={policyId}
        onUploadComplete={() => {
          // Invalidate the documents query to refresh the list
          queryClient.invalidateQueries({ queryKey: ["documents", EntityType.POLICY, policyId] });
        }}
      />
    </Card>
  );
};

export default PolicyDocumentsTab;
