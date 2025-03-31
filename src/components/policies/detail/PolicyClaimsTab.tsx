
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, ExternalLink, Calendar } from "lucide-react";
import { usePolicyClaims } from "@/hooks/claims/usePolicyClaims";
import ClaimStatusBadge from "@/components/claims/ClaimStatusBadge";

interface PolicyClaimsTabProps {
  policyId: string;
}

const PolicyClaimsTab: React.FC<PolicyClaimsTabProps> = ({ policyId }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  
  const { 
    claimsSummary, 
    isLoading 
  } = usePolicyClaims(policyId);
  
  const handleRegisterClaim = () => {
    navigate(`/claims/new?policyId=${policyId}`);
  };
  
  const handleViewClaim = (claimId: string) => {
    navigate(`/claims/${claimId}`);
  };
  
  const handleViewAllClaims = () => {
    navigate("/claims");
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("policyClaims")}</CardTitle>
            <CardDescription>{t("claimsRelatedToPolicy")}</CardDescription>
          </div>
          <Button onClick={handleRegisterClaim}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("registerClaim")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : claimsSummary.claims.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-muted-foreground">
            <p>{t("noClaimsForPolicy")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">{t("totalClaims")}</h3>
                <p className="text-2xl font-bold">{claimsSummary.totalClaims}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">{t("activeClaims")}</h3>
                <p className="text-2xl font-bold">{claimsSummary.activeClaims}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">{t("totalClaimedAmount")}</h3>
                <p className="text-2xl font-bold">{formatCurrency(claimsSummary.totalClaimedAmount)}</p>
              </div>
            </div>
            
            {/* Claims Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("claimNumber")}</TableHead>
                  <TableHead>{t("incidentDate")}</TableHead>
                  <TableHead>{t("claimedAmount")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claimsSummary.claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{claim.claim_number}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {claim.damage_description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {formatDate(claim.incident_date)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(claim.claimed_amount)}</TableCell>
                    <TableCell><ClaimStatusBadge status={claim.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClaim(claim.id)}
                      >
                        {t("viewDetails")}
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {claimsSummary.totalClaims > 5 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={handleViewAllClaims}>
                  {t("viewClaims")}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyClaimsTab;
