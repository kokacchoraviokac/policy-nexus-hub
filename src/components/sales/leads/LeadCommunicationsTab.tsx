
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, Phone, Calendar, MessageCircle } from "lucide-react";
import { useCommunications } from "@/hooks/useCommunications";
import CommunicationsTimeline from "../communications/CommunicationsTimeline";
import ComposeEmailDialog from "../communications/ComposeEmailDialog";
import CreateNoteDialog from "../communications/CreateNoteDialog";
import LogCallDialog from "../communications/LogCallDialog";
import LogMeetingDialog from "../communications/LogMeetingDialog";
import LeadCommunicationStats from "./LeadCommunicationStats";
import { Skeleton } from "@/components/ui/skeleton";

interface LeadCommunicationsTabProps {
  lead: {
    id: string;
    name: string;
    email?: string;
    company_id: string;
  };
}

const LeadCommunicationsTab: React.FC<LeadCommunicationsTabProps> = ({ lead }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("timeline");
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  
  const { 
    communications, 
    isLoading, 
    fetchCommunications, 
    fetchTemplates, 
    templates 
  } = useCommunications(lead.id);

  useEffect(() => {
    if (lead.id) {
      fetchCommunications();
      fetchTemplates();
    }
  }, [lead.id, fetchCommunications, fetchTemplates]);

  const handleSendEmail = () => {
    if (!lead.email) {
      // If lead has no email, you might want to show a dialog to add email
      alert(t("leadEmailMissing"));
      return;
    }
    setShowEmailDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("communications")}</h2>
        <div className="flex gap-2">
          <Button
            size="sm" 
            variant="outline"
            onClick={() => setShowNoteDialog(true)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("addNote")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCallDialog(true)}
          >
            <Phone className="h-4 w-4 mr-2" />
            {t("logCall")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowMeetingDialog(true)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {t("scheduleMeeting")}
          </Button>
          <Button 
            size="sm" 
            onClick={handleSendEmail}
            disabled={!lead.email}
          >
            <Send className="h-4 w-4 mr-2" />
            {t("sendEmail")}
          </Button>
        </div>
      </div>

      <LeadCommunicationStats communications={communications} isLoading={isLoading} />

      <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">{t("timeline")}</TabsTrigger>
          <TabsTrigger value="emails">{t("emails")}</TabsTrigger>
          <TabsTrigger value="calls">{t("calls")}</TabsTrigger>
          <TabsTrigger value="meetings">{t("meetings")}</TabsTrigger>
          <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <CommunicationsTimeline 
              communications={communications} 
              onRefresh={() => fetchCommunications()} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="emails" className="mt-4">
          <CommunicationsTimeline 
            communications={communications.filter(c => c.type === 'email')}
            onRefresh={() => fetchCommunications()} 
          />
        </TabsContent>
        
        <TabsContent value="calls" className="mt-4">
          <CommunicationsTimeline 
            communications={communications.filter(c => c.type === 'call')}
            onRefresh={() => fetchCommunications()} 
          />
        </TabsContent>
        
        <TabsContent value="meetings" className="mt-4">
          <CommunicationsTimeline 
            communications={communications.filter(c => c.type === 'meeting')}
            onRefresh={() => fetchCommunications()} 
          />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <CommunicationsTimeline 
            communications={communications.filter(c => c.type === 'note')}
            onRefresh={() => fetchCommunications()} 
          />
        </TabsContent>
      </Tabs>

      <ComposeEmailDialog 
        open={showEmailDialog} 
        onOpenChange={setShowEmailDialog} 
        lead={lead} 
        templates={templates}
        onEmailSent={() => fetchCommunications()}
      />

      <CreateNoteDialog
        open={showNoteDialog}
        onOpenChange={setShowNoteDialog}
        leadId={lead.id}
        onNoteCreated={() => fetchCommunications()}
      />

      <LogCallDialog
        open={showCallDialog}
        onOpenChange={setShowCallDialog}
        leadId={lead.id}
        onCallLogged={() => fetchCommunications()}
      />

      <LogMeetingDialog
        open={showMeetingDialog}
        onOpenChange={setShowMeetingDialog}
        leadId={lead.id}
        onMeetingLogged={() => fetchCommunications()}
      />
    </div>
  );
};

export default LeadCommunicationsTab;
