
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { AlertCircle, ArrowLeft, Loader2, FilePlus, Download, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentList from "@/components/documents/DocumentList";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";
import UpdateClaimStatusDialog from "@/components/claims/UpdateClaimStatusDialog";

interface ClaimDetailPageProps {
  isEditMode?: boolean;
}

const ClaimDetailPage: React.FC<ClaimDetailPageProps> = ({ isEditMode = false }) => {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  const { t, formatDate, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { data: claim, isLoading, isError, refetch } = useQuery({
    queryKey: ['claim', claimId],
    queryFn: async () => {
      if (!claimId) throw new Error("Claim ID is required");
      
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          policies:policy_id (
            policy_number,
            policyholder_name,
            insurer_name
          )
        `)
        .eq('id', claimId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!claimId
  });

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClaim = () => {
    navigate(`/claims/${claimId}/edit`);
  };

  const handleExportClaim = () => {
    toast({
      title: t("exportStarted"),
      description: t("claimExportInProgress")
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold">{t("errorLoadingClaim")}</h2>
            <p className="text-muted-foreground mt-2">{t("claimNotFoundOrError")}</p>
            <Button className="mt-6" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("goBack")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackClick}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("backToClaims")}
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("claim")} {claim.claim_number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <ClaimStatusBadge status={claim.status} />
            <span className="text-sm text-muted-foreground">
              {t("createdOn")}: {formatDate(claim.created_at)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {!isEditMode && (
            <Button variant="outline" size="sm" onClick={handleEditClaim}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("editClaim")}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleExportClaim}>
            <Download className="mr-2 h-4 w-4" />
            {t("exportClaim")}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
        <ResizablePanel defaultSize={65}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{isEditMode ? t("editClaim") : t("claimDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">{t("details")}</TabsTrigger>
                  <TabsTrigger value="documents">{t("documents")}</TabsTrigger>
                  <TabsTrigger value="history">{t("history")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("policyInformation")}</h3>
                        <div className="mt-1 space-y-2">
                          <p><span className="font-medium">{t("policyNumber")}:</span> {claim.policies?.policy_number}</p>
                          <p><span className="font-medium">{t("policyholder")}:</span> {claim.policies?.policyholder_name}</p>
                          <p><span className="font-medium">{t("insurer")}:</span> {claim.policies?.insurer_name}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("claimInformation")}</h3>
                        <div className="mt-1 space-y-2">
                          <p><span className="font-medium">{t("claimNumber")}:</span> {claim.claim_number}</p>
                          <p><span className="font-medium">{t("incidentDate")}:</span> {formatDate(claim.incident_date)}</p>
                          <p><span className="font-medium">{t("reportedDate")}:</span> {formatDate(claim.created_at)}</p>
                          {claim.incident_location && (
                            <p><span className="font-medium">{t("incident_location")}:</span> {claim.incident_location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("financialDetails")}</h3>
                        <div className="mt-1 space-y-2">
                          <p><span className="font-medium">{t("claimedAmount")}:</span> {formatCurrency(claim.claimed_amount)}</p>
                          {claim.approved_amount !== null && (
                            <p><span className="font-medium">{t("approvedAmount")}:</span> {formatCurrency(claim.approved_amount)}</p>
                          )}
                          {claim.deductible !== null && claim.deductible !== undefined && (
                            <p><span className="font-medium">{t("deductible")}:</span> {formatCurrency(claim.deductible)}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">{t("damageInformation")}</h3>
                        <div className="mt-1 space-y-2">
                          <p><span className="font-medium">{t("damageDescription")}:</span></p>
                          <p className="whitespace-pre-wrap">{claim.damage_description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {claim.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">{t("additionalNotes")}</h3>
                      <p className="mt-1 whitespace-pre-wrap">{claim.notes}</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button onClick={() => setUploadDialogOpen(true)}>
                        <FilePlus className="mr-2 h-4 w-4" />
                        {t("uploadDocument")}
                      </Button>
                    </div>
                    
                    <DocumentList 
                      entityType="claim" 
                      entityId={claimId}
                      onUploadClick={() => setUploadDialogOpen(true)}
                      showUploadButton={false}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="text-center py-10">
                    <p>{t("claimHistoryComingSoon")}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={35}>
          <div className="space-y-4 h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("claimStatus")}</CardTitle>
                <CardDescription>{t("claimStatusDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{t("currentStatus")}</h3>
                      <ClaimStatusBadge status={claim.status} />
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      <Button 
                        className="w-full" 
                        onClick={() => setStatusDialogOpen(true)}
                      >
                        {t("updateStatus")}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">{t("claimTimeline")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                        <div>
                          <p className="font-medium">{t("claimCreated")}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(claim.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="min-w-2 h-2 mt-2 rounded-full bg-primary" />
                        <div>
                          <p className="font-medium">{t("statusUpdated")}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(claim.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
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
        claimId={claimId}
        currentStatus={claim.status}
        onSuccess={refetch}
      />
    </div>
  );
};

export default ClaimDetailPage;
