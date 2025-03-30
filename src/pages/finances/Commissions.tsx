
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download, RefreshCw, Calculator, FileCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Commission {
  id: string;
  policy_id: string;
  policy_number?: string;
  insurer_name?: string;
  policyholder_name?: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  paid_amount?: number;
  payment_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Commissions = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch commissions
  const { data: commissions, isLoading, isError, refetch } = useQuery({
    queryKey: ['commissions', activeTab, searchTerm],
    queryFn: async () => {
      try {
        let query = supabase
          .from('commissions')
          .select(`
            *,
            policies(policy_number, insurer_name, policyholder_name)
          `);
  
        if (activeTab !== 'all') {
          query = query.eq('status', activeTab);
        }
  
        if (searchTerm) {
          query = query.or(`policies.policy_number.ilike.%${searchTerm}%,policies.policyholder_name.ilike.%${searchTerm}%`);
        }
  
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
  
        // Transform the data to match our Commission interface
        return data.map((commission: any) => ({
          ...commission,
          policy_number: commission.policies?.policy_number,
          insurer_name: commission.policies?.insurer_name,
          policyholder_name: commission.policies?.policyholder_name
        })) as Commission[];
      } catch (error) {
        console.error("Error fetching commissions:", error);
        throw error;
      }
    }
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'due':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Due</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
      case 'calculating':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Calculating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleExport = () => {
    toast({
      title: t("exportStarted"),
      description: t("exportingCommissionsData"),
    });
  };
  
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("commissions")}</h1>
          <p className="text-muted-foreground">
            {t("commissionsDescription")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
          <Button>
            <Calculator className="mr-2 h-4 w-4" />
            {t("calculateCommissions")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("commissionManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchCommissions")}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            
            <Button variant="outline" size="icon" onClick={handleRefresh} title={t("refresh")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">{t("allCommissions")}</TabsTrigger>
              <TabsTrigger value="due">{t("dueCommissions")}</TabsTrigger>
              <TabsTrigger value="paid">{t("paidCommissions")}</TabsTrigger>
              <TabsTrigger value="calculating">{t("calculatingCommissions")}</TabsTrigger>
            </TabsList>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("policyNumber")}</TableHead>
                    <TableHead>{t("policyholder")}</TableHead>
                    <TableHead>{t("insurer")}</TableHead>
                    <TableHead className="text-right">{t("baseAmount")}</TableHead>
                    <TableHead className="text-center">{t("rate")}</TableHead>
                    <TableHead className="text-right">{t("commission")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">{t("loadingCommissions")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-destructive">
                        {t("errorLoadingCommissions")}
                      </TableCell>
                    </TableRow>
                  ) : commissions && commissions.length > 0 ? (
                    commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">{commission.policy_number || '-'}</TableCell>
                        <TableCell>{commission.policyholder_name || '-'}</TableCell>
                        <TableCell>{commission.insurer_name || '-'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(commission.base_amount, "EUR")}</TableCell>
                        <TableCell className="text-center">{commission.rate}%</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(commission.calculated_amount, "EUR")}</TableCell>
                        <TableCell>{getStatusBadge(commission.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileCheck className="h-4 w-4 mr-1" />
                            {t("details")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        {t("noCommissionsFound")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Commissions;
