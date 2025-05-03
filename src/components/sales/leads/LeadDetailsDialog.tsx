
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
import { ActivityList } from "@/components/codebook/details/ActivityLog";
import { fetchActivityLogs } from "@/utils/activityLogger";

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

  return (
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
          </TabsContent>
          
          <TabsContent value="activities">
            <LeadActivities leadId={lead.id} />
          </TabsContent>
          
          <TabsContent value="history">
            <h4 className="text-sm font-medium mb-3">{t("activityTimeline")}</h4>
            <ActivityList 
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
  );
};

export default LeadDetailsDialog;
