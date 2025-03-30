
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Policy } from "@/types/policies";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FileEdit, 
  FileCheck, 
  ClipboardCheck, 
  Clock, 
  Plus, 
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const PolicyWorkflow = () => {
  const { t, formatDate } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch policies based on workflow status
  const fetchPoliciesByWorkflowStatus = async (status: string) => {
    let query = supabase
      .from('policies')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (status === 'pending') {
      // In the pending tab, show both draft and in_review status policies
      query = query.in('workflow_status', ['draft', 'in_review']);
    } else if (status === 'ready') {
      query = query.eq('workflow_status', 'ready');
    } else if (status === 'completed') {
      query = query.eq('workflow_status', 'complete');
    }
    
    // Add search term filtering if present
    if (searchTerm) {
      query = query.or(
        `policy_number.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%`
      );
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Policy[];
  };
  
  const { 
    data: policies, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['policies-workflow', activeTab, searchTerm],
    queryFn: () => fetchPoliciesByWorkflowStatus(activeTab)
  });
  
  const handleStatusChange = (newStatus: string) => {
    setActiveTab(newStatus);
  };
  
  const handleViewPolicy = (policyId: string) => {
    navigate(`/policies/${policyId}`);
  };
  
  const handleReviewPolicy = (policyId: string) => {
    navigate(`/policies/${policyId}/review`);
  };
  
  const handleRefresh = () => {
    refetch();
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge>Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getWorkflowStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Draft</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">In Review</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Ready</Badge>;
      case 'complete':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("policiesWorkflow")}</h1>
          <p className="text-muted-foreground">
            {t("policiesWorkflowDescription")}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate("/policies/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("importPolicy")}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPolicies")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {t("filter")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                {t("showAll")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("showInternationalOnly")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("showDomesticOnly")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {t("sort")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                {t("newestFirst")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("oldestFirst")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("policyNumberAsc")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t("policyNumberDesc")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleStatusChange}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {t("pendingReview")}
          </TabsTrigger>
          <TabsTrigger value="ready" className="flex items-center">
            <FileCheck className="mr-2 h-4 w-4" />
            {t("readyForFinalization")}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            {t("finalizedPolicies")}
          </TabsTrigger>
        </TabsList>
        
        <Separator className="my-4" />
        
        {["pending", "ready", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p>{t("loading")}...</p>
              </div>
            ) : isError ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-destructive">
                    <p>{t("errorLoadingPolicies")}</p>
                    <p className="text-sm">{error instanceof Error ? error.message : t("unknownError")}</p>
                    <Button variant="outline" onClick={handleRefresh} className="mt-4">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t("retry")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : !policies || policies.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <p>{t("noPoliciesFound")}</p>
                    <Button variant="outline" onClick={() => navigate("/policies/new")} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      {t("importPolicy")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("policyNumber")}</TableHead>
                      <TableHead>{t("insurer")}</TableHead>
                      <TableHead>{t("policyholder")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("workflowStatus")}</TableHead>
                      <TableHead>{t("lastUpdated")}</TableHead>
                      <TableHead className="text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">{policy.policy_number}</TableCell>
                        <TableCell>{policy.insurer_name}</TableCell>
                        <TableCell>{policy.policyholder_name}</TableCell>
                        <TableCell>{getStatusBadge(policy.status)}</TableCell>
                        <TableCell>{getWorkflowStatusBadge(policy.workflow_status)}</TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm">
                            {formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPolicy(policy.id)}
                            >
                              {t("view")}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleReviewPolicy(policy.id)}
                            >
                              {tab === "completed" ? t("view") : t("review")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {tab === "pending" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("importedPolicies")}</CardTitle>
                  <CardDescription>{t("reviewAndFinalizeImportedPolicies")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t("policiesInPendingDescription")}
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/policies/new")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t("importPolicy")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {tab === "ready" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("readyForFinalization")}</CardTitle>
                  <CardDescription>{t("finalizePoliciesReadyForApproval")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t("policiesReadyDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {tab === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("finalizedPolicies")}</CardTitle>
                  <CardDescription>{t("viewFinalizedPoliciesHistory")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t("policiesCompletedDescription")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PolicyWorkflow;
