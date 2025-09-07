
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lead } from "@/types/sales/leads";
import LeadScoringForm, { LeadScoringFormValues } from "./LeadScoringForm";
import { useToast } from "@/hooks/use-toast";
import { useLeads } from "@/hooks/sales/useLeads";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useLeadScoring } from "@/hooks/sales/useLeadScoring";
import { useNotificationService } from "@/hooks/useNotificationService";

interface LeadScoringDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadScored?: () => void;
}

const LeadScoringDialog: React.FC<LeadScoringDialogProps> = ({
  lead,
  open,
  onOpenChange,
  onLeadScored
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { updateLead } = useLeads();
  const { shouldQualifyLead } = useLeadScoring();
  const { createLeadStatusChangeNotification } = useNotificationService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: LeadScoringFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Calculate total score
      const totalScore = values.budgetScore + values.authorityScore + values.needScore + values.timelineScore;
      
      // Prepare update data
      const updateData: any = {
        score: totalScore,
        budget_score: values.budgetScore,
        authority_score: values.authorityScore,
        need_score: values.needScore,
        timeline_score: values.timelineScore,
        budget_notes: values.budgetNotes,
        authority_notes: values.authorityNotes,
        need_notes: values.needNotes,
        timeline_notes: values.timelineNotes,
      };
      
      // Check if we should recommend status change to qualified
      let statusUpdateMessage = "";
      const previousStatus = lead.status;
      
      // Only suggest changing to 'qualified' if current status is 'new' and score is high enough
      if (lead.status === 'new' && shouldQualifyLead(totalScore)) {
        // Add status to update data if user confirms
        if (window.confirm(t("leadQualificationConfirm"))) {
          updateData.status = 'qualified';
          statusUpdateMessage = t("leadStatusUpdated");
        }
      }
      
      // Update lead
      await updateLead(lead.id, updateData);
      
      // Create notification if status changed
      if (updateData.status && updateData.status !== previousStatus) {
        await createLeadStatusChangeNotification({
          ...lead,
          status: updateData.status
        }, previousStatus);
      }
      
      // Show success message
      toast({
        title: t("leadScoreUpdated"),
        description: statusUpdateMessage ? `${t("leadScoreUpdatedMessage")} ${statusUpdateMessage}` : t("leadScoreUpdatedMessage")
      });
      
      // Close dialog and refresh
      onOpenChange(false);
      if (onLeadScored) onLeadScored();
      
    } catch (error) {
      console.error("Error updating lead score:", error);
      toast({
        title: t("errorUpdatingLeadScore"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("scoreLead")}</DialogTitle>
          <DialogDescription>
            {t("scoreLeadDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4 bg-muted/20 p-2 rounded">
          <div>
            <p className="font-medium">{lead.name}</p>
            {lead.company_name && <p className="text-sm text-muted-foreground">{lead.company_name}</p>}
          </div>
          
          <Badge variant={lead.status === 'new' ? 'default' : lead.status === 'qualified' ? 'secondary' : lead.status === 'converted' ? 'success' : 'outline'}>
            {t(lead.status)}
          </Badge>
        </div>
        
        {lead.status === 'lost' && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {t("lostLeadScoringWarning")}
            </AlertDescription>
          </Alert>
        )}
        
        <LeadScoringForm lead={lead} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};

export default LeadScoringDialog;
