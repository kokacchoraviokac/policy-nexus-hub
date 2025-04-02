import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import ProposalViewDialog from "./ProposalViewDialog";
import SendProposalDialog from "./SendProposalDialog";
import UpdateProposalStatusDialog from "./UpdateProposalStatusDialog";
import { Proposal, ProposalStatus } from "@/types/sales";

export interface ProposalsListProps {
  proposals: Proposal[];
  onStatusChange?: (proposalId: string, status: ProposalStatus) => void;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ proposals, onStatusChange }) => {
  const { t, formatDateTime } = useLanguage();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  
  const handleView = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setViewDialogOpen(true);
  };
  
  const handleSend = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setSendDialogOpen(true);
  };
  
  const handleStatusUpdate = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setStatusDialogOpen(true);
  };
  
  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">{t("draft")}</Badge>;
      case "sent":
        return <Badge variant="secondary">{t("sent")}</Badge>;
      case "viewed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">{t("viewed")}</Badge>;
      case "accepted":
        return <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">{t("accepted")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t("rejected")}</Badge>;
      case "expired":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">{t("expired")}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("proposal")}</TableHead>
              <TableHead>{t("client")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t("noProposalsFound")}
                </TableCell>
              </TableRow>
            ) : (
              proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {proposal.title}
                    </div>
                  </TableCell>
                  <TableCell>{proposal.clientName}</TableCell>
                  <TableCell>{formatDateTime(proposal.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleView(proposal)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t("viewProposal")}</span>
                      </Button>
                      
                      {proposal.status === "draft" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleSend(proposal)}
                        >
                          <Send className="h-4 w-4" />
                          <span className="sr-only">{t("sendProposal")}</span>
                        </Button>
                      )}
                      
                      {["sent", "viewed"].includes(proposal.status) && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleStatusUpdate(proposal)}
                        >
                          <Clock className="h-4 w-4" />
                          <span className="sr-only">{t("updateStatus")}</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedProposal && (
        <>
          <ProposalViewDialog 
            proposal={selectedProposal} 
            open={viewDialogOpen} 
            onOpenChange={setViewDialogOpen} 
          />
          
          <SendProposalDialog 
            proposal={selectedProposal} 
            open={sendDialogOpen} 
            onOpenChange={setSendDialogOpen} 
            onSend={() => {
              if (onStatusChange) {
                onStatusChange(selectedProposal.id, "sent");
              }
            }} 
          />
          
          <UpdateProposalStatusDialog 
            proposal={selectedProposal} 
            open={statusDialogOpen} 
            onOpenChange={setStatusDialogOpen} 
            onStatusChange={(status) => {
              if (onStatusChange) {
                onStatusChange(selectedProposal.id, status);
              }
            }} 
          />
        </>
      )}
    </>
  );
};

export default ProposalsList;
