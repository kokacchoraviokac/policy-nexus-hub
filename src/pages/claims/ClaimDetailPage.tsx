
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import UpdateClaimStatusDialog from "@/components/claims/UpdateClaimStatusDialog";
import ClaimHeader from "@/components/claims/detail/ClaimHeader";
import ClaimDetailsContent from "@/components/claims/detail/ClaimDetailsContent";
import ClaimStatusSidebar from "@/components/claims/detail/ClaimStatusSidebar";
import { ClaimLoading, ClaimError } from "@/components/claims/detail/ClaimLoadingAndError";
import { useClaimDetail } from "@/hooks/claims/useClaimDetail";

interface ClaimDetailPageProps {
  isEditMode?: boolean;
}

const ClaimDetailPage: React.FC<ClaimDetailPageProps> = ({ isEditMode = false }) => {
  const { claimId } = useParams<{ claimId: string }>();
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { claim, isLoading, isError, refetch } = useClaimDetail(claimId);

  if (isLoading) {
    return <ClaimLoading isLoading={true} />;
  }

  if (isError || !claim) {
    return <ClaimError isError={true} />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ClaimHeader
        claimNumber={claim.claim_number}
        status={claim.status}
        createdAt={claim.created_at}
        isEditMode={isEditMode}
        claimId={claimId || ""}
      />

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
        <ResizablePanel defaultSize={65}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{isEditMode ? t("editClaim") : t("claimDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ClaimDetailsContent 
                claim={claim} 
                onUploadClick={() => setUploadDialogOpen(true)} 
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={35}>
          <div className="space-y-4 h-full">
            <Card className="h-full">
              <ClaimStatusSidebar 
                claim={claim} 
                onUpdateStatusClick={() => setStatusDialogOpen(true)} 
              />
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType="claim"
        entityId={claimId}
      />
      
      <UpdateClaimStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        claimId={claimId || ""}
        currentStatus={claim.status}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ClaimDetailPage;
