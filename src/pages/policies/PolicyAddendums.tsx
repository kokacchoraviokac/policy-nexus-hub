
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, Plus, Search, Filter } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolicyAddendum } from "@/types/policies";
import AddendumList from "@/components/policies/addendums/AddendumList";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import SelectAddendumPolicyDialog from "@/components/policies/addendums/SelectAddendumPolicyDialog";
import { useToast } from "@/hooks/use-toast";

const PolicyAddendums = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workflowStatusFilter, setWorkflowStatusFilter] = useState("all");
  const [showSelectPolicyDialog, setShowSelectPolicyDialog] = useState(false);

  const { data: addendums, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['policy-addendums', searchTerm, statusFilter, workflowStatusFilter],
    queryFn: async () => {
      let query = supabase
        .from('policy_addendums')
        .select(`
          *,
          policies:policy_id (
            policy_number
          )
        `)
        .order('created_at', { ascending: false });

      // Apply search filter if provided
      if (searchTerm) {
        query = query.ilike('addendum_number', `%${searchTerm}%`);
      }

      // Apply status filter if provided
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply workflow status filter if provided
      if (workflowStatusFilter !== 'all') {
        query = query.eq('workflow_status', workflowStatusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to include the policy number directly
      return data.map(item => ({
        ...item,
        policy_number: item.policies?.policy_number || 'Unknown'
      })) as (PolicyAddendum & { policy_number: string })[];
    }
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleWorkflowStatusFilterChange = (value: string) => {
    setWorkflowStatusFilter(value);
  };

  const handleCreateAddendum = () => {
    setShowSelectPolicyDialog(true);
  };

  const handleCloseSelectPolicyDialog = () => {
    setShowSelectPolicyDialog(false);
  };

  const handlePolicySelected = (policyId: string, policyNumber: string) => {
    // Navigate to the policy detail page with the addendums tab open
    navigate(`/policies/${policyId}?tab=addendums`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 flex justify-center">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-24 bg-muted rounded"></div>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-8">
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
            <h3 className="font-semibold">{t("errorLoadingAddendums")}</h3>
            <p className="text-sm mt-2">{error instanceof Error ? error.message : t("unknownError")}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              {t("tryAgain")}
            </Button>
          </div>
        </div>
      );
    }

    if (!addendums || addendums.length === 0) {
      return (
        <EmptyState
          icon="file-edit"
          title={t("noPolicyAddendums")}
          description={t("noPolicyAddendumsDescription")}
          action={
            <Button onClick={handleCreateAddendum}>
              <FileText className="mr-2 h-4 w-4" />
              {t("createAddendum")}
            </Button>
          }
        />
      );
    }

    return (
      <AddendumList
        addendums={addendums}
        policyNumber={""}
        onRefresh={refetch}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policyAddendums")}</h1>
          <p className="text-muted-foreground">
            {t("policyAddendumsDescription")}
          </p>
        </div>
        <Button onClick={handleCreateAddendum}>
          <Plus className="mr-2 h-4 w-4" />
          {t("createAddendum")}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("addendumManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchAddendums")}
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={workflowStatusFilter} onValueChange={handleWorkflowStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filterByWorkflowStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allWorkflowStatuses")}</SelectItem>
                  <SelectItem value="draft">{t("draft")}</SelectItem>
                  <SelectItem value="in_review">{t("inReview")}</SelectItem>
                  <SelectItem value="ready">{t("ready")}</SelectItem>
                  <SelectItem value="complete">{t("complete")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {renderContent()}
        </CardContent>
      </Card>

      {showSelectPolicyDialog && (
        <SelectAddendumPolicyDialog 
          open={showSelectPolicyDialog}
          onClose={handleCloseSelectPolicyDialog}
          onPolicySelected={handlePolicySelected}
        />
      )}
    </div>
  );
};

export default PolicyAddendums;
