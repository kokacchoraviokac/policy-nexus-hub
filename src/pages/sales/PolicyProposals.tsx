
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProposalsList, { Proposal } from "@/components/sales/proposals/ProposalsList";
import CreateProposalDialog from "@/components/sales/proposals/CreateProposalDialog";
import { useProposalsData } from "@/hooks/sales/useProposalsData";

const PolicyProposals = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { 
    proposals, 
    isLoading, 
    createProposal,
    updateProposalStatus,
    proposalsByStatus
  } = useProposalsData({
    searchQuery,
    statusFilter
  });

  const handleCreateProposal = (proposal: Proposal) => {
    createProposal(proposal);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with action button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policyProposals")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("policyProposalsDescription")}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newProposal")}
        </Button>
      </div>
      
      {/* Filter and search controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchProposals")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allProposals")}</SelectItem>
            <SelectItem value="draft">{t("draft")}</SelectItem>
            <SelectItem value="sent">{t("sent")}</SelectItem>
            <SelectItem value="viewed">{t("viewed")}</SelectItem>
            <SelectItem value="accepted">{t("accepted")}</SelectItem>
            <SelectItem value="rejected">{t("rejected")}</SelectItem>
            <SelectItem value="expired">{t("expired")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("totalProposals")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proposals.length}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("draft")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proposalsByStatus.draft || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("sent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proposalsByStatus.sent || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("viewed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proposalsByStatus.viewed || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("accepted")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proposalsByStatus.accepted || 0}</p>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{t("rejected")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proposalsByStatus.rejected || 0}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Proposals table */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>{t("allPolicyProposals")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ProposalsList 
              proposals={proposals}
              onStatusChange={updateProposalStatus}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Create proposal dialog */}
      <CreateProposalDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        salesProcessId="demo-process-id"
        clientName="Demo Client"
        onProposalCreated={handleCreateProposal}
      />
    </div>
  );
};

export default PolicyProposals;
