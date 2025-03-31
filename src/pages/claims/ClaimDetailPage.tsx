
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
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
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ClaimDetailPageProps {
  isEditMode?: boolean;
}

const ClaimDetailPage: React.FC<ClaimDetailPageProps> = ({ isEditMode = false }) => {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { claim, isLoading, isError, refetch } = useClaimDetail(claimId);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <ClaimLoading isLoading={true} />;
  }

  if (isError || !claim) {
    return <ClaimError isError={true} />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="hover:bg-primary/10 hover:text-primary transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>
      
      <ClaimHeader
        claimNumber={claim.claim_number}
        status={claim.status}
        createdAt={claim.created_at}
        isEditMode={isEditMode}
        claimId={claimId || ""}
      />

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
        <ResizablePanel defaultSize={65}>
          <Card className="h-full border hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>{isEditMode ? t("editClaim") : t("claimDetails")}</CardTitle>
              <CardDescription>{t("claimDetailsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimDetailsContent 
                claim={claim} 
                onUploadClick={() => {
                  setUploadDialogOpen(true);
                  toast.info(t("uploadingDocuments"), {
                    description: t("uploadingDocumentsDescription")
                  });
                }}
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={35}>
          <div className="space-y-4 h-full">
            <Card className="h-full border hover:shadow-md transition-all duration-200">
              <ClaimStatusSidebar 
                claim={claim} 
                onUpdateStatusClick={() => {
                  setStatusDialogOpen(true);
                  toast.info(t("updatingClaimStatus"), {
                    description: t("updatingClaimStatusDescription")
                  });
                }} 
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
        onSuccess={() => {
          refetch();
          toast.success(t("claimStatusUpdated"), {
            description: t("claimStatusUpdatedDescription")
          });
        }}
      />
    </div>
  );
};

export default ClaimDetailPage;
