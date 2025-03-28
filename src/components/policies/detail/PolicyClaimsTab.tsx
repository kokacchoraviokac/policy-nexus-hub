
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { FilePlus, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
}

const PolicyClaimsTab: React.FC<PolicyClaimsTabProps> = ({ policyId }) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const navigate = useNavigate();

  const { data: claims, isLoading, isError, refetch } = useQuery({
    queryKey: ['policy-claims', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Claim[];
    },
  });

  const handleCreateClaim = () => {
    // Navigate to create claim page or open modal
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
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">{t("policyClaims")}</h3>
          <Button size="sm" onClick={handleCreateClaim}>
            <FilePlus className="mr-2 h-4 w-4" />
            {t("createClaim")}
          </Button>
        </div>

        {claims && claims.length > 0 ? (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="border rounded-md p-4 hover:border-primary transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{claim.claim_number}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{claim.damage_description}</p>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("incidentDate")}</p>
                    <p className="font-medium">{formatDate(claim.incident_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("claimedAmount")}</p>
                    <p className="font-medium">{formatCurrency(claim.claimed_amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("approvedAmount")}</p>
                    <p className="font-medium">
                      {claim.approved_amount !== null 
                        ? formatCurrency(claim.approved_amount) 
                        : '—'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleViewClaim(claim.id)}
                  >
                    {t("viewDetails")}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
