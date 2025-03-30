
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FilePlus, AlertTriangle, ArrowRight, FileText, Loader2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

interface PolicyClaimsTabProps {
  policyId: string;
}

interface Claim {
  id: string;
  claim_number: string;
  damage_description: string;
  incident_date: string;
  status: string;
  claimed_amount: number;
  approved_amount: number | null;
  created_at: string;
  documents_count?: number;
}

const PolicyClaimsTab: React.FC<PolicyClaimsTabProps> = ({ policyId }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: claims, isLoading, isError, refetch } = useQuery({
    queryKey: ['policy-claims', policyId, statusFilter],
    queryFn: async () => {
      // Build query
      let query = supabase
        .from('claims')
        .select('*')
        .eq('policy_id', policyId);
      
      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      // Order by created date
      query = query.order('created_at', { ascending: false });
      
      const { data: claimsData, error: claimsError } = await query;
      
      if (claimsError) throw claimsError;
      
      // If there are claims, get document counts for each claim
      if (claimsData && claimsData.length > 0) {
        const claimsWithDocs = await Promise.all(claimsData.map(async (claim) => {
          const { count, error: countError } = await supabase
            .from('claim_documents')
            .select('*', { count: 'exact', head: true })
            .eq('claim_id', claim.id);
            
          return {
            ...claim,
            documents_count: count || 0
          };
        }));
        
        return claimsWithDocs;
      }
      
      return claimsData as Claim[];
    },
  });

  const handleCreateClaim = () => {
    // Navigate to create claim page with policy ID pre-filled
    navigate(`/claims/new?policyId=${policyId}`);
  };

  const handleViewClaim = (claimId: string) => {
    navigate(`/claims/${claimId}`);
  };

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" | "success" = "default";
    
    switch (status.toLowerCase()) {
      case 'accepted':
        variant = "success";
        break;
      case 'rejected':
        variant = "destructive";
        break;
      case 'in processing':
        variant = "secondary";
        break;
      case 'appealed':
        variant = "outline";
        break;
      default:
        variant = "default";
    }
    
    return (
      <Badge variant={variant as any}>
        {status}
      </Badge>
    );
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">{t("policyClaims")}</h3>
            <Button size="sm" disabled>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("createClaim")}
            </Button>
          </div>
          <div className="space-y-4">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center py-6">
            <h3 className="text-lg font-medium text-destructive">{t("errorLoadingClaims")}</h3>
            <p className="text-muted-foreground mt-2">{t("tryRefreshingPage")}</p>
            <Button className="mt-4" onClick={() => refetch()}>
              {t("refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>{t("policyClaims")}</CardTitle>
          <Button size="sm" onClick={handleCreateClaim}>
            <FilePlus className="mr-2 h-4 w-4" />
            {t("createClaim")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex mb-4">
          <div className="w-64 ml-auto">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatuses")}</SelectItem>
                <SelectItem value="in processing">{t("inProcessing")}</SelectItem>
                <SelectItem value="reported">{t("reported")}</SelectItem>
                <SelectItem value="accepted">{t("accepted")}</SelectItem>
                <SelectItem value="rejected">{t("rejected")}</SelectItem>
                <SelectItem value="appealed">{t("appealed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {claims && claims.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("claimNumber")}</TableHead>
                <TableHead>{t("incidentDate")}</TableHead>
                <TableHead>{t("claimedAmount")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("documents")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewClaim(claim.id)}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{claim.claim_number}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{claim.damage_description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(claim.incident_date)}</TableCell>
                  <TableCell>{formatCurrency(claim.claimed_amount)}</TableCell>
                  <TableCell>{getStatusBadge(claim.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{claim.documents_count || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewClaim(claim.id);
                      }}
                    >
                      {t("viewDetails")}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 border rounded-md bg-muted/30">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium">{t("noClaimsFound")}</h3>
            <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
              {t("noClaimsDescription")}
            </p>
            <Button size="sm" onClick={handleCreateClaim}>
              <FilePlus className="mr-2 h-4 w-4" />
              {t("createClaim")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyClaimsTab;
