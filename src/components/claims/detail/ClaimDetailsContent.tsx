
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentList from "@/components/documents/DocumentList";
import ClaimStatusHistory from "./ClaimStatusHistory";

interface ClaimDetailsContentProps {
  claim: any;
  onUploadClick: () => void;
}

const ClaimDetailsContent: React.FC<ClaimDetailsContentProps> = ({
  claim,
  onUploadClick
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();

  return (
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
            <Button onClick={onUploadClick}>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("uploadDocument")}
            </Button>
          </div>
          
          <DocumentList 
            entityType="claim" 
            entityId={claim.id}
            onUploadClick={onUploadClick}
            showUploadButton={false}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="history">
        <div className="space-y-4">
          <ClaimStatusHistory statusHistory={claim.status_history || []} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ClaimDetailsContent;
