
import React, { useState } from "react";
import { 
  FileText, 
  RefreshCw, 
  Calendar, 
  Users, 
  Search,
  FilePlus
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/format";

interface Policy {
  id: string;
  policy_number: string;
  insurer_name: string;
  product_name: string;
  policyholder_name: string;
  start_date: string;
  expiry_date: string;
  premium: number;
  currency: string;
  status: string;
}

const Policies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: policies, isLoading, isError, refetch } = useQuery({
    queryKey: ['policies', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('policies')
        .select('id, policy_number, insurer_name, product_name, policyholder_name, start_date, expiry_date, premium, currency, status');
      
      if (searchTerm) {
        query = query.or(
          `policy_number.ilike.%${searchTerm}%,` +
          `policyholder_name.ilike.%${searchTerm}%,` +
          `insurer_name.ilike.%${searchTerm}%,` +
          `product_name.ilike.%${searchTerm}%`
        );
      }
      
      const { data, error } = await query
        .order('expiry_date')
        .limit(10);
      
      if (error) throw error;
      return data as Policy[];
    }
  });
  
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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Policies</h1>
          <p className="text-muted-foreground">
            Manage all policy-related activities including creation, updates, renewals, and documentation.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Upcoming Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Active Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">128</p>
            <p className="text-xs text-muted-foreground">Across 42 clients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Unassigned Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-border">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <h2 className="font-semibold">Recent Policies</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search policies..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Loading policies...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-destructive">Error loading policies. Please try again.</p>
            </div>
          ) : policies && policies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Insurer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>{policy.policyholder_name}</TableCell>
                    <TableCell>{policy.insurer_name}</TableCell>
                    <TableCell>{policy.product_name}</TableCell>
                    <TableCell>{formatDate(policy.expiry_date)}</TableCell>
                    <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
                    <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No policies found. Try modifying your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Policies;
