
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lead } from '@/types/sales/leads';
import LeadCommunicationsTab from './LeadCommunicationsTab';
import LeadActivities from './LeadActivities';
import { useLeadsData } from '@/hooks/sales/useLeadsData';

export interface LeadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string;
  lead?: Lead;
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  leadId,
  lead: propLead 
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const { getLeadById } = useLeadsData();
  const [lead, setLead] = useState<Lead | undefined>(propLead);

  useEffect(() => {
    if (leadId && !lead) {
      const fetchLead = async () => {
        const fetchedLead = await getLeadById(leadId);
        if (fetchedLead) {
          setLead(fetchedLead);
        }
      };
      
      fetchLead();
    } else if (propLead) {
      setLead(propLead);
    }
  }, [leadId, propLead, getLeadById, lead]);

  if (!lead && !leadId) {
    return null;
  }

  if (!lead) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("leadDetails")}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lead?.company_name || t("leadDetails")}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="communications">{t("communications")}</TabsTrigger>
            <TabsTrigger value="activities">{t("activities")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium mb-2">{t("companyInformation")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("companyName")}</span>
                    <span>{lead?.company_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("website")}</span>
                    <span>{lead?.website || t("notProvided")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("industry")}</span>
                    <span>{lead?.industry || t("notProvided")}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-4">
                <h3 className="font-medium mb-2">{t("contactInformation")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("contactName")}</span>
                    <span>{lead?.contact_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("email")}</span>
                    <span>{lead?.contact_email || t("notProvided")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("phone")}</span>
                    <span>{lead?.contact_phone || t("notProvided")}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-medium mb-2">{t("leadDetails")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("status")}</span>
                    <span>{lead?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("source")}</span>
                    <span>{lead?.source || t("notProvided")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("leadScore")}</span>
                    <span>{lead?.score || '0'}/100</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("assignedTo")}</span>
                    <span>{lead?.assigned_to_name || t("unassigned")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("createdAt")}</span>
                    <span>{lead?.created_at ? new Date(lead.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
              
              {lead?.notes && (
                <div className="mt-4">
                  <h4 className="font-medium mb-1">{t("notes")}</h4>
                  <p className="text-muted-foreground">{lead.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="communications">
            <LeadCommunicationsTab lead={lead} />
          </TabsContent>
          
          <TabsContent value="activities">
            <LeadActivities leadId={lead.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
