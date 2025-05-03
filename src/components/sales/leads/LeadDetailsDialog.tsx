
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lead } from "@/types/sales/leads";
import LeadActivities from "./LeadActivities";
import { ActivityLog } from "@/components/codebook/details/ActivityLog";
import { fetchActivityLogs } from "@/utils/activityLogger";
import LeadScoreIndicator from "./LeadScoreIndicator";
import { Star } from "lucide-react";
import LeadScoringDialog from "./LeadScoringDialog";
import { Progress } from "@/components/ui/progress";

interface LeadDetailsDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({
  lead,
  open,
  onOpenChange,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("info");
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [showScoringDialog, setShowScoringDialog] = useState(false);

  // Load activity logs when the history tab is selected
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    
    if (value === "history" && !activityLogs.length) {
      setIsLoadingLogs(true);
      try {
        const logs = await fetchActivityLogs("lead", lead.id);
        setActivityLogs(logs);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setIsLoadingLogs(false);
      }
    }
  };

  // Lead status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t("newLeads")}</Badge>;
      case 'qualified':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">{t("qualifiedLeads")}</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("convertedLeads")}</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{t("lostLeads")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle dialog reload when lead score is updated
  const handleLeadScored = () => {
    // Could trigger a refresh of the lead data if needed
    console.log("Lead has been scored");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{lead.name}</span>
              {getStatusBadge(lead.status)}
            </DialogTitle>
            {lead.company_name && (
              <DialogDescription>
                {lead.company_name}
              </DialogDescription>
            )}
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="info">{t("information")}</TabsTrigger>
              <TabsTrigger value="activities">{t("activities")}</TabsTrigger>
              <TabsTrigger value="history">{t("history")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              {/* Lead Score Section */}
              <div className="border p-4 rounded-lg bg-muted/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{t("leadQualificationScore")}</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowScoringDialog(true)}
                    className="h-7 gap-1"
                  >
                    <Star className="h-3.5 w-3.5" />
                    <span className="text-xs">{t("updateScore")}</span>
                  </Button>
                </div>
                
                {lead.score !== undefined ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {t("bant")}:
                          <span className="ml-1 text-foreground">
                            {lead.budget_score || 0}B + {lead.authority_score || 0}A + {lead.need_score || 0}N + {lead.timeline_score || 0}T
                          </span>
                        </div>
                        <Progress value={lead.score} className="h-2" />
                      </div>
                      <LeadScoreIndicator score={lead.score} size="lg" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    {t("noLeadScore")}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("contactInformation")}</h4>
                  <div className="mt-1 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">{t("email")}: </span>
                      {lead.email}
                    </p>
                    {lead.phone && (
                      <p className="text-sm">
                        <span className="font-medium">{t("phone")}: </span>
                        {lead.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">{t("leadDetails")}</h4>
                  <div className="mt-1 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">{t("source")}: </span>
                      {lead.source || t("notSpecified")}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{t("createdAt")}: </span>
                      {format(new Date(lead.created_at), "PPP")}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{t("responsiblePerson")}: </span>
                      {lead.assigned_to || t("notAssigned")}
                    </p>
                  </div>
                </div>
              </div>
              
              {lead.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("notes")}</h4>
                    <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                  </div>
                </>
              )}
              
              {/* BANT Notes (when available) */}
              {(lead.budget_notes || lead.authority_notes || lead.need_notes || lead.timeline_notes) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("qualificationNotes")}</h4>
                    
                    {lead.budget_notes && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">{t("budget")}:</p>
                        <p className="text-sm whitespace-pre-wrap">{lead.budget_notes}</p>
                      </div>
                    )}
                    
                    {lead.authority_notes && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">{t("authority")}:</p>
                        <p className="text-sm whitespace-pre-wrap">{lead.authority_notes}</p>
                      </div>
                    )}
                    
                    {lead.need_notes && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">{t("need")}:</p>
                        <p className="text-sm whitespace-pre-wrap">{lead.need_notes}</p>
                      </div>
                    )}
                    
                    {lead.timeline_notes && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">{t("timeline")}:</p>
                        <p className="text-sm whitespace-pre-wrap">{lead.timeline_notes}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="activities">
              <LeadActivities leadId={lead.id} />
            </TabsContent>
            
            <TabsContent value="history">
              <h4 className="text-sm font-medium mb-3">{t("activityTimeline")}</h4>
              <ActivityLog 
                items={activityLogs} 
                isLoading={isLoadingLogs}
                maxItems={10}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Lead Scoring Dialog */}
      {showScoringDialog && (
        <LeadScoringDialog
          lead={lead}
          open={showScoringDialog}
          onOpenChange={setShowScoringDialog}
          onLeadScored={handleLeadScored}
        />
      )}
    </>
  );
};

export default LeadDetailsDialog;
