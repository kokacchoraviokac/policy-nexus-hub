
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lead } from '@/types/sales/leads';
import LeadCommunicationsTab from './LeadCommunicationsTab';
import LeadActivities from './LeadActivities';

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
  lead 
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  if (!lead && !leadId) {
    return null;
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
                    <span>{lead?.contact_email}</span>
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
                    <span>{lead?.source}</span>
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
            <LeadCommunicationsTab leadId={leadId || lead?.id || ''} />
          </TabsContent>
          
          <TabsContent value="activities">
            <LeadActivities leadId={leadId || lead?.id || ''} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
