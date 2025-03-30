
import React from "react";
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
import { Lead } from "./LeadsTable";
import { Separator } from "@/components/ui/separator";

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{lead.name}</span>
            {getStatusBadge(lead.status)}
          </DialogTitle>
          {lead.company && (
            <DialogDescription>
              {lead.company}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
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
                  {lead.responsible_person || t("notAssigned")}
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
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">{t("activityTimeline")}</h4>
            <p className="text-sm text-muted-foreground italic">{t("noActivity")}</p>
          </div>
        </div>
        
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
