
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MoreHorizontal, 
  PencilIcon,
  Trash2,
  ExternalLink,
  ActivityIcon,
  Mail,
  PhoneCall,
  MessageSquare,
  Calendar,
  Share2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Lead } from '@/types/sales/leads';
import { Badge } from '@/components/ui/badge';
import LeadScoreIndicator from './LeadScoreIndicator';
import LeadScoringDialog from './LeadScoringDialog';
import DeleteLeadDialog from './DeleteLeadDialog';
import EditLeadDialog from './EditLeadDialog';
import ConvertLeadDialog from './ConvertLeadDialog';
import LeadDetailsDialog from './LeadDetailsDialog';
import ComposeEmailDialog from '@/components/sales/communications/ComposeEmailDialog';
import LogCallDialog from '@/components/sales/communications/LogCallDialog';
import CreateNoteDialog from '@/components/sales/communications/CreateNoteDialog';
import LogMeetingDialog from '@/components/sales/communications/LogMeetingDialog';

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
  onEdit: (lead: Lead) => void;
  onConvert?: (lead: Lead) => void;
  onRefresh: () => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ 
  leads, 
  onDelete, 
  onEdit, 
  onConvert,
  onRefresh
}) => {
  const { t } = useLanguage();
  
  const [leadToScore, setLeadToScore] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [leadToView, setLeadToView] = useState<Lead | null>(null);
  
  // Communication dialogs
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [selectedLeadForComm, setSelectedLeadForComm] = useState<Lead | null>(null);

  const handleScoreUpdate = (leadId: string, newScore: number) => {
    onRefresh();
  };
  
  const handleScoreClick = (leadId: string) => {
    setLeadToScore(leadId);
  };
  
  const handleDeleteConfirm = () => {
    if (leadToDelete) {
      onDelete(leadToDelete);
      setLeadToDelete(null);
    }
  };
  
  const handleEditSave = (updatedLead: Lead) => {
    onEdit(updatedLead);
    setLeadToEdit(null);
  };
  
  const handleConvertConfirm = (lead: Lead) => {
    if (onConvert && leadToConvert) {
      onConvert(leadToConvert);
      setLeadToConvert(null);
    }
  };

  const openCommunicationDialog = (
    lead: Lead,
    dialogType: 'email' | 'call' | 'note' | 'meeting'
  ) => {
    setSelectedLeadForComm(lead);
    switch (dialogType) {
      case 'email':
        setEmailDialogOpen(true);
        break;
      case 'call':
        setCallDialogOpen(true);
        break;
      case 'note':
        setNoteDialogOpen(true);
        break;
      case 'meeting':
        setMeetingDialogOpen(true);
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Badge variant="outline">{status}</Badge>;
      case 'contacted':
        return <Badge variant="secondary">{status}</Badge>;
      case 'qualified':
        return <Badge variant="success">{status}</Badge>;
      case 'converted':
        return <Badge variant="success" className="bg-green-600">{status}</Badge>;
      case 'lost':
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("companyName")}</TableHead>
              <TableHead>{t("contactPerson")}</TableHead>
              <TableHead>{t("leadSource")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("assignedTo")}</TableHead>
              <TableHead>{t("score")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {t("noLeadsFound")}
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div>{lead.company_name}</div>
                    {lead.industry && <div className="text-xs text-muted-foreground">{lead.industry}</div>}
                  </TableCell>
                  <TableCell>
                    <div>{lead.contact_name}</div>
                    <div className="text-xs text-muted-foreground">{lead.contact_email}</div>
                    {lead.contact_phone && <div className="text-xs text-muted-foreground">{lead.contact_phone}</div>}
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>{lead.assigned_to_name || t("unassigned")}</TableCell>
                  <TableCell>
                    <LeadScoreIndicator 
                      score={lead.score || 0} 
                      onClick={() => handleScoreClick(lead.id)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("openMenu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setLeadToView(lead)}>
                          <ExternalLink className="w-4 h-4 mr-2" /> {t("viewDetails")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLeadToEdit(lead)}>
                          <PencilIcon className="w-4 h-4 mr-2" /> {t("edit")}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>{t("communication")}</DropdownMenuLabel>
                        
                        <DropdownMenuItem onClick={() => openCommunicationDialog(lead, 'email')}>
                          <Mail className="w-4 h-4 mr-2" /> {t("sendEmail")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCommunicationDialog(lead, 'call')}>
                          <PhoneCall className="w-4 h-4 mr-2" /> {t("logCall")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCommunicationDialog(lead, 'meeting')}>
                          <Calendar className="w-4 h-4 mr-2" /> {t("scheduleMeeting")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openCommunicationDialog(lead, 'note')}>
                          <MessageSquare className="w-4 h-4 mr-2" /> {t("addNote")}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>{t("advanced")}</DropdownMenuLabel>
                        
                        <DropdownMenuItem onClick={() => handleScoreClick(lead.id)}>
                          <ActivityIcon className="w-4 h-4 mr-2" /> {t("updateScore")}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setLeadToConvert(lead)}
                          disabled={lead.status === 'converted'}
                        >
                          <Share2 className="w-4 h-4 mr-2" /> {t("convertToSales")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setLeadToDelete(lead.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialogs */}
      <LeadScoringDialog
        open={!!leadToScore}
        onOpenChange={(open) => !open && setLeadToScore(null)}
        leadId={leadToScore || ''}
        onScoreUpdate={(newScore) => handleScoreUpdate(leadToScore || '', newScore)}
      />
      
      <DeleteLeadDialog
        open={!!leadToDelete}
        onOpenChange={(open) => !open && setLeadToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
      
      <EditLeadDialog
        open={!!leadToEdit}
        onOpenChange={(open) => !open && setLeadToEdit(null)}
        lead={leadToEdit}
        onSave={handleEditSave}
      />
      
      <ConvertLeadDialog
        open={!!leadToConvert}
        onOpenChange={(open) => !open && setLeadToConvert(null)}
        lead={leadToConvert}
        onConvert={handleConvertConfirm}
      />
      
      <LeadDetailsDialog
        open={!!leadToView}
        onOpenChange={(open) => !open && setLeadToView(null)}
        lead={leadToView || undefined}
      />
      
      {/* Communication dialogs */}
      <ComposeEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        recipient={selectedLeadForComm?.contact_email || ''}
        recipientName={selectedLeadForComm?.contact_name || ''}
        leadId={selectedLeadForComm?.id || ''}
        onEmailSent={onRefresh}
      />
      
      <LogCallDialog
        open={callDialogOpen}
        onOpenChange={setCallDialogOpen}
        contactName={selectedLeadForComm?.contact_name || ''}
        leadId={selectedLeadForComm?.id || ''}
        onCallLogged={onRefresh}
      />
      
      <CreateNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        leadId={selectedLeadForComm?.id || ''}
        onNoteCreated={onRefresh}
      />
      
      <LogMeetingDialog
        open={meetingDialogOpen}
        onOpenChange={setMeetingDialogOpen}
        contactName={selectedLeadForComm?.contact_name || ''}
        leadId={selectedLeadForComm?.id || ''}
        onMeetingLogged={onRefresh}
      />
    </>
  );
};

export default LeadsTable;
