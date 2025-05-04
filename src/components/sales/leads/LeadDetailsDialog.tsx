import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadActivities from "./LeadActivities";
import LeadCommunicationsTab from "./LeadCommunicationsTab";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { toast } from "sonner";

interface LeadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  onLeadUpdated?: () => void;
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({
  open,
  onOpenChange,
  leadId,
  onLeadUpdated
}) => {
  const { t } = useLanguage();
  const [lead, setLead] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (open && leadId) {
      fetchLeadDetails();
    }
  }, [open, leadId]);

  const fetchLeadDetails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error) {
      console.error("Error fetching lead:", error);
      toast.error("Error loading lead details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{lead.name}</h2>
              <p className="text-sm text-muted-foreground">
                {lead.company_name && `${lead.company_name} • `}
                {lead.status && <span className="capitalize">{t(lead.status.toLowerCase() + "Lead")}</span>}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
            <TabsTrigger value="activities">{t("activities")}</TabsTrigger>
            <TabsTrigger value="communications">{t("communications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="space-y-4">
              {/* Contact information */}
              <div>
                <h3 className="font-medium mb-2">{t("contactInformation")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("contactPerson")}</p>
                    <p>{lead.contact_person || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("company")}</p>
                    <p>{lead.company_name || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("email")}</p>
                    <p>{lead.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("phone")}</p>
                    <p>{lead.phone || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Lead information */}
              <div>
                <h3 className="font-medium mb-2">{t("leadInformation")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("source")}</p>
                    <p>{lead.source || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("status")}</p>
                    <p className="capitalize">{lead.status ? t(lead.status.toLowerCase() + "Lead") : "-"}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-medium mb-2">{t("notes")}</h3>
                <p className="text-sm whitespace-pre-wrap">{lead.notes || "-"}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <LeadActivities leadId={lead.id} />
          </TabsContent>

          <TabsContent value="communications">
            <LeadCommunicationsTab lead={lead} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;
