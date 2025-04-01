
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Loader2, FileArchive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddendumList from "@/components/policies/addendums/AddendumList";
import SelectAddendumPolicyDialog from "@/components/policies/addendums/SelectAddendumPolicyDialog";

const PolicyAddendums = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workflowFilter, setWorkflowFilter] = useState("all");
  const [showSelectPolicyDialog, setShowSelectPolicyDialog] = useState(false);
  
  // Fetch all addendums
  const { data: addendums, isLoading, isError, refetch } = useQuery({
    queryKey: ['all-policy-addendums', searchTerm, statusFilter, workflowFilter],
    queryFn: async () => {
      let query = supabase
        .from('policy_addendums')
        .select(`
          *,
          policies(policy_number)
        `);
      
      if (searchTerm) {
        query = query.or(`addendum_number.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      if (workflowFilter !== "all") {
        query = query.eq('workflow_status', workflowFilter);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
  
  const handleAddAddendum = () => {
    setShowSelectPolicyDialog(true);
  };
  
  const handlePolicySelected = (policyId: string) => {
    setShowSelectPolicyDialog(false);
    navigate(`/policies/addendums/new?policyId=${policyId}`);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policyAddendums")}</h1>
          <p className="text-muted-foreground">
            {t("policyAddendumsDescription")}
          </p>
        </div>
        
        <Button onClick={handleAddAddendum} className="md:w-auto w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("addAddendum")}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("addendumManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex items-center relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchAddendums")}
                className="pl-9"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
                <SelectItem value="active">{t("active")}</SelectItem>
                <SelectItem value="rejected">{t("rejected")}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={workflowFilter}
              onValueChange={setWorkflowFilter}
            >
              <SelectTrigger className="w-[180px]">
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
          
          <AddendumList 
            addendums={addendums || []}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
          />
        </CardContent>
      </Card>
      
      <SelectAddendumPolicyDialog 
        open={showSelectPolicyDialog}
        onClose={() => setShowSelectPolicyDialog(false)}
        onPolicySelected={handlePolicySelected}
      />
    </div>
  );
};

export default PolicyAddendums;
