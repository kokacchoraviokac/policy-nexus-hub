
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Proposal, ProposalStatus } from "@/types/reports";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit,
  Eye,
  Loader2,
  Search,
  AlertTriangle,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewProposalDialog from "./ViewProposalDialog";
import UpdateProposalStatusDialog from "./UpdateProposalStatusDialog";

interface ProposalsListProps {
  proposals: Proposal[];
  isLoading: boolean;
  error?: Error | null;
  onUpdateStatus: (proposalId: string, newStatus: ProposalStatus) => Promise<void>;
  onEdit?: (proposalId: string) => void;
}

const ProposalsList: React.FC<ProposalsListProps> = ({
  proposals,
  isLoading,
  error,
  onUpdateStatus,
  onEdit,
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewProposal, setViewProposal] = useState<Proposal | null>(null);
  const [updateStatusProposal, setUpdateStatusProposal] = useState<Proposal | null>(null);
  
  // Filter proposals based on search term
  const filteredProposals = proposals.filter((proposal) =>
    proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (proposal.client_name && proposal.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is handled above
  };
  
  const handleStatusUpdate = async (status: ProposalStatus) => {
    if (updateStatusProposal) {
      await onUpdateStatus(updateStatusProposal.id, status);
      setUpdateStatusProposal(null);
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "sent":
        return "warning";
      case "viewed":
        return "info";
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      case "approved":
        return "success";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-3.5 w-3.5" />;
      case "sent":
        return <Send className="h-3.5 w-3.5" />;
      case "viewed":
        return <Eye className="h-3.5 w-3.5" />;
      case "accepted":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "rejected":
        return <XCircle className="h-3.5 w-3.5" />;
      case "approved":
        return <CheckCircle className="h-3.5 w-3.5" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("proposals")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-9 w-20 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("proposals")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium">{t("failedToLoadProposals")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("proposals")}</CardTitle>
            <Button
              onClick={() => navigate("/sales/proposals/new")}
              size="sm"
            >
              {t("newProposal")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("searchProposals")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">{t("search")}</Button>
          </form>
          
          {filteredProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t("noProposalsFound")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("createYourFirstProposal")}
              </p>
              <Button
                onClick={() => navigate("/sales/proposals/new")}
                className="mt-4"
              >
                {t("newProposal")}
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("title")}</TableHead>
                    <TableHead>{t("client")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("createdDate")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        {proposal.title}
                      </TableCell>
                      <TableCell>{proposal.client_name || "-"}</TableCell>
                      <TableCell>
                        {proposal.amount
                          ? formatCurrency(
                              proposal.amount,
                              proposal.currency || "EUR"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>{formatDate(proposal.created_at)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(proposal.status as string)}
                          className="flex w-fit items-center gap-1"
                        >
                          {getStatusIcon(proposal.status as string)}
                          {t(proposal.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewProposal(proposal)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {onEdit && proposal.status === "draft" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(proposal.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {proposal.status === "draft" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setUpdateStatusProposal(proposal);
                              }}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* View Proposal Dialog */}
      {viewProposal && (
        <ViewProposalDialog
          proposal={viewProposal}
          open={!!viewProposal}
          onOpenChange={(open) => {
            if (!open) setViewProposal(null);
          }}
        />
      )}
      
      {/* Update Status Dialog */}
      {updateStatusProposal && (
        <UpdateProposalStatusDialog
          open={!!updateStatusProposal}
          onOpenChange={(open) => {
            if (!open) setUpdateStatusProposal(null);
          }}
          onUpdate={(status: ProposalStatus) => handleStatusUpdate(status as ProposalStatus)}
          currentStatus={updateStatusProposal.status as ProposalStatus}
        />
      )}
    </>
  );
};

export default ProposalsList;
