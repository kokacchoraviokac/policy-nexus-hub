// Update ProposalsList to use the correct prop types
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Proposal, ProposalStatus } from "@/types/sales";
import UpdateProposalStatusDialog from "./UpdateProposalStatusDialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Eye,
  FileText,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getProposalStatusVariant } from "@/utils/proposalUtils";

export interface ProposalsListProps {
  proposals: Proposal[];
  onStatusChange?: (proposalId: string, newStatus: ProposalStatus) => Promise<boolean>;
}

const ProposalsList: React.FC<ProposalsListProps> = ({ 
  proposals, 
  onStatusChange 
}) => {
  const { t, formatDate: formatLocalDate } = useLanguage();
  const { toast } = useToast();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  
  const getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case ProposalStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-rose-500" />;
      case ProposalStatus.EXPIRED:
        return <Clock className="h-4 w-4 text-amber-500" />;
      case ProposalStatus.SENT:
        return <Send className="h-4 w-4 text-blue-500" />;
      case ProposalStatus.VIEWED:
        return <Eye className="h-4 w-4 text-indigo-500" />;
      case ProposalStatus.DRAFT:
        return <FileText className="h-4 w-4 text-slate-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const handleStatusChange = async (status: ProposalStatus) => {
    if (!selectedProposal || !onStatusChange) return;
    
    try {
      const success = await onStatusChange(selectedProposal.id, status);
      
      if (success) {
        toast({
          title: t("proposalStatusUpdated"),
          description: t("proposalStatusUpdateSuccess"),
        });
      } else {
        toast({
          title: t("proposalStatusUpdateFailed"),
          description: t("proposalStatusUpdateError"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("proposalStatusUpdateFailed"),
        description: t("proposalStatusUpdateError"),
        variant: "destructive",
      });
    } finally {
      setStatusDialogOpen(false);
    }
  };

  if (proposals.length === 0) {
    return (
      <div className="py-10 text-center">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">{t("noProposals")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("noProposalsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{proposal.title}</CardTitle>
                <CardDescription className="mt-1">
                  {t("forClient")}: {proposal.client_name || t("unknownClient")}
                </CardDescription>
              </div>
              <Badge variant={getProposalStatusVariant(proposal.status) as "default" | "destructive" | "outline" | "secondary" | "success" | "warning"}>
                {getStatusIcon(proposal.status)}
                <span className="ml-1">{t(proposal.status)}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("insurer")}
                </p>
                <p className="text-sm">
                  {proposal.insurer_name || t("notSpecified")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("amount")}
                </p>
                <p className="text-sm font-semibold">
                  {proposal.amount
                    ? formatCurrency(proposal.amount, proposal.currency || "EUR")
                    : t("notSpecified")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("created")}
                </p>
                <p className="text-sm">
                  {formatLocalDate(proposal.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("expires")}
                </p>
                <p className="text-sm">
                  {proposal.expiry_date
                    ? formatLocalDate(proposal.expiry_date)
                    : t("notSpecified")}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {t("view")}
            </Button>
            
            {onStatusChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("changeStatus")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedProposal(proposal);
                      setStatusDialogOpen(true);
                    }}
                  >
                    {t("updateStatus")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardFooter>
        </Card>
      ))}
      
      {selectedProposal && (
        <UpdateProposalStatusDialog 
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          currentStatus={selectedProposal.status}
          onUpdateStatus={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ProposalsList;
