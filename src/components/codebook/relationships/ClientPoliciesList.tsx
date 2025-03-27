
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";

interface ClientPoliciesListProps {
  clientId: string;
}

interface PolicyItem {
  id: string;
  policy_number: string;
  insurer_name: string;
  product_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  status: string;
}

export const ClientPoliciesList: React.FC<ClientPoliciesListProps> = ({ clientId }) => {
  const navigate = useNavigate();
  
  const { data: policies, isLoading, isError } = useQuery({
    queryKey: ['client_policies', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policies')
        .select('id, policy_number, insurer_name, product_name, start_date, expiry_date, premium, currency, status')
        .eq('client_id', clientId)
        .order('expiry_date', { ascending: false });
      
      if (error) throw error;
      return data as PolicyItem[];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center p-4 bg-destructive/10 text-destructive rounded-md">
        <AlertCircle className="h-5 w-5 mr-2" />
        <span>Failed to load policies. Please try again later.</span>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status.toLowerCase()) {
      case 'active':
        variant = "default";
        break;
      case 'expired':
        variant = "destructive";
        break;
      case 'pending':
        variant = "secondary";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Client Policies</h3>
      
      {policies && policies.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Number</TableHead>
              <TableHead>Insurer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map(policy => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.policy_number}</TableCell>
                <TableCell>{policy.insurer_name}</TableCell>
                <TableCell>{policy.product_name}</TableCell>
                <TableCell className="text-sm">
                  <div>{new Date(policy.start_date).toLocaleDateString()}</div>
                  <div className="text-muted-foreground">to {new Date(policy.expiry_date).toLocaleDateString()}</div>
                </TableCell>
                <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
                <TableCell>{getStatusBadge(policy.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/policies/${policy.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-8 text-center border rounded-md bg-muted/50">
          <p className="text-muted-foreground">No policies associated with this client.</p>
        </div>
      )}
    </div>
  );
};
