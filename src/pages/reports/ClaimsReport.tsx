
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileDown, Search, RefreshCw, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClaimsReportFilters {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  searchTerm?: string;
}

interface ClaimReportData {
  id: string;
  claim_number: string;
  policy_number: string;
  policyholder_name: string;
  incident_date: string;
  claimed_amount: number;
  approved_amount?: number;
  status: string;
  policy_id: string;
}

const ClaimsReport = () => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filters, setFilters] = useState<ClaimsReportFilters>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
    status: "all"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['claims-report', filters],
    queryFn: async () => {
      let query = supabase
        .from('claims')
        .select(`
          id,
          claim_number,
          incident_date,
          claimed_amount,
          approved_amount,
          status,
          policy_id,
          policies:policy_id (
            policy_number,
            policyholder_name
          )
        `)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.status && filters.status !== "all") {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate) {
        const startDateString = filters.startDate.toISOString().split('T')[0];
        query = query.gte('incident_date', startDateString);
      }
      
      if (filters.endDate) {
        const endDateString = filters.endDate.toISOString().split('T')[0];
        query = query.lte('incident_date', endDateString);
      }
      
      if (searchTerm) {
        query = query.or(`claim_number.ilike.%${searchTerm}%,policies.policy_number.ilike.%${searchTerm}%,policies.policyholder_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map and format the data
      const formattedData: ClaimReportData[] = data.map(claim => ({
        id: claim.id,
        claim_number: claim.claim_number,
        policy_number: claim.policies?.policy_number || "-",
        policyholder_name: claim.policies?.policyholder_name || "-",
        incident_date: claim.incident_date,
        claimed_amount: claim.claimed_amount,
        approved_amount: claim.approved_amount,
        status: claim.status,
        policy_id: claim.policy_id
      }));
      
      return formattedData;
    }
  });
  
  const handleBackToReports = () => {
    navigate("/reports");
  };
  
  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast({
        title: t("noDataToExport"),
        description: t("pleaseRefineFilters"),
        variant: "destructive"
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Convert data to CSV
      const headers = [
        "Claim Number",
        "Policy Number",
        "Policyholder",
        "Incident Date",
        "Claimed Amount",
        "Approved Amount",
        "Status"
      ];
      
      const rows = data.map(claim => [
        claim.claim_number,
        claim.policy_number,
        claim.policyholder_name,
        formatDate(claim.incident_date),
        claim.claimed_amount.toString(),
        claim.approved_amount ? claim.approved_amount.toString() : "-",
        claim.status
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "claims-report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: t("exportSuccessful"),
        description: t("reportHasBeenDownloaded")
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: t("exportFailed"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewClaim = (claimId: string) => {
    navigate(`/claims/${claimId}`);
  };
  
  // Calculate summary data
  const totalClaimedAmount = data?.reduce((sum, claim) => sum + claim.claimed_amount, 0) || 0;
  const totalApprovedAmount = data?.reduce((sum, claim) => sum + (claim.approved_amount || 0), 0) || 0;
  const claimCount = data?.length || 0;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-4"
        onClick={handleBackToReports}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t("backToReports")}
      </Button>
      
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{t("claimsReport")}</h1>
        <p className="text-muted-foreground">
          {t("claimsReportDescription")}
        </p>
      </div>
      
      {/* Filters */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>{t("filters")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium block mb-2">{t("status")}</label>
              <Select
                value={filters.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allStatuses")}</SelectItem>
                  <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
                  <SelectItem value="reported">{t("reported")}</SelectItem>
                  <SelectItem value="accepted">{t("accepted")}</SelectItem>
                  <SelectItem value="rejected">{t("rejected")}</SelectItem>
                  <SelectItem value="appealed">{t("appealed")}</SelectItem>
                  <SelectItem value="partially accepted">{t("partiallyAccepted")}</SelectItem>
                  <SelectItem value="withdrawn">{t("withdrawn")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-2.5 top-9 h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium block mb-2">{t("search")}</label>
              <Input
                type="search"
                placeholder={t("searchClaims")}
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                title={t("refresh")}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("refresh")}
              </Button>
              
              <Button 
                onClick={handleExport}
                disabled={isExporting || !data || data.length === 0}
              >
                <FileDown className="h-4 w-4 mr-2" />
                {t("exportToCsv")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("summary")}</CardTitle>
          <CardDescription>{t("claimsReportSummary")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">{t("totalClaims")}</h3>
              <p className="text-2xl font-bold">{claimCount}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">{t("totalClaimedAmount")}</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalClaimedAmount)}</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">{t("totalApprovedAmount")}</h3>
              <p className="text-2xl font-bold">{formatCurrency(totalApprovedAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("claimsList")}</CardTitle>
          <CardDescription>{t("claimsMatchingFilters")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>{t("loadingClaims")}</p>
            </div>
          ) : !data || data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("noClaimsFound")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("claimNumber")}</TableHead>
                  <TableHead>{t("policyNumber")}</TableHead>
                  <TableHead>{t("policyholder")}</TableHead>
                  <TableHead>{t("incidentDate")}</TableHead>
                  <TableHead>{t("claimedAmount")}</TableHead>
                  <TableHead>{t("approvedAmount")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((claim) => (
                  <TableRow 
                    key={claim.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewClaim(claim.id)}
                  >
                    <TableCell className="font-medium">{claim.claim_number}</TableCell>
                    <TableCell>{claim.policy_number}</TableCell>
                    <TableCell>{claim.policyholder_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(claim.incident_date)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(claim.claimed_amount)}</TableCell>
                    <TableCell>
                      {claim.approved_amount ? 
                        formatCurrency(claim.approved_amount) : 
                        "-"}
                    </TableCell>
                    <TableCell>
                      <ClaimStatusBadge status={claim.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsReport;
