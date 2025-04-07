
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Proposal, ProposalStatus } from "@/types/sales";
import DocumentUploadDialog from "@/components/documents/DocumentUploadDialog";
import { DocumentCategory, EntityType } from "@/types/common";

interface CreateProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesProcessId: string;
  clientName: string;
  onProposalCreated: (proposal: Proposal) => void;
}

const CreateProposalDialog: React.FC<CreateProposalDialogProps> = ({
  open,
  onOpenChange,
  salesProcessId,
  clientName,
  onProposalCreated
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [insurerName, setInsurerName] = useState("");
  const [coverageDetails, setCoverageDetails] = useState("");
  const [premium, setPremium] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  
  const handleCreate = () => {
    if (!title) {
      toast.error(t("titleRequired"));
      return;
    }
    
    setSaving(true);
    
    // Simulate saving process
    setTimeout(() => {
      const newProposal: Proposal = {
        id: `proposal-${Date.now()}`,
        title,
        client_name: clientName,
        sales_process_id: salesProcessId,
        created_at: new Date().toISOString(),
        status: ProposalStatus.DRAFT,
        insurer_name: insurerName,
        coverage_details: coverageDetails,
        premium: premium ? parseFloat(premium) : 0,
        notes,
        document_ids: [],
        created_by: "", // Add a default value
        updated_at: new Date().toISOString(),
        amount: 0, // Add a default value
        company_id: "" // Add a default value
      };
      
      setSaving(false);
      onProposalCreated(newProposal);
      toast.success(t("proposalCreated"), {
        description: t("proposalCreatedDescription")
      });
      onOpenChange(false);
    }, 1000);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("createProposal")}</DialogTitle>
            <DialogDescription>
              {t("createProposalDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("proposalTitle")}</Label>
              <Input
                id="title"
                placeholder={t("enterProposalTitle")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("client")}</Label>
                <Input value={clientName} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurer">{t("insurer")}</Label>
                <Input
                  id="insurer"
                  placeholder={t("enterInsurerName")}
                  value={insurerName}
                  onChange={(e) => setInsurerName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverage-details">{t("coverageDetails")}</Label>
              <Textarea
                id="coverage-details"
                placeholder={t("enterCoverageDetails")}
                rows={4}
                value={coverageDetails}
                onChange={(e) => setCoverageDetails(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="premium">{t("premium")}</Label>
              <Input
                id="premium"
                placeholder={t("enterPremium")}
                value={premium}
                onChange={(e) => setPremium(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea
                id="notes"
                placeholder={t("optionalNotesForProposal")}
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="pt-2">
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(true)}>
                {t("attachDocuments")}
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                {t("attachRelevantDocuments")}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-b-transparent" />
                  {t("saving")}
                </>
              ) : (
                t("createProposal")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        entityType={EntityType.SALES_PROCESS}
        entityId={salesProcessId}
        defaultCategory={DocumentCategory.PROPOSAL}
      />
    </>
  );
};

export default CreateProposalDialog;
