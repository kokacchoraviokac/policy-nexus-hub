
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, FileUp, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { Column } from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import CommissionCalculator from "@/components/finances/CommissionCalculator";
import CommissionUploadDialog from "@/components/finances/CommissionUploadDialog";

interface Commission {
  id: string;
  policy_id: string;
  policy_number: string;
  insurer_name: string;
  client_name: string;
  base_amount: number;
  rate: number;
  calculated_amount: number;
  status: string;
  created_at: string;
  payment_date: string | null;
}

const Commissions = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    insurer: "",
    dateRange: "",
    searchTerm: "",
  });
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["commissions", activeTab, pagination, filters],
    queryFn: async () => {
      let query = supabase
        .from("commissions")
        .select(
          `
          *,
          policies(policy_number, insurer_name, client_id),
          clients:policies.client_id(name)
        `,
          { count: "exact" }
        );

      // Apply status filter
      if (activeTab === "pending") {
        query = query.eq("status", "pending");
      } else if (activeTab === "processed") {
        query = query.eq("status", "processed");
      } else if (activeTab === "confirmed") {
        query = query.eq("status", "confirmed");
      } else if (activeTab === "invoiced") {
        query = query.eq("status", "invoiced");
      }

      // Apply search/filters if any
      if (filters.insurer) {
        query = query.eq("policies.insurer_name", filters.insurer);
      }

      if (filters.searchTerm) {
        query = query.or(
          `policies.policy_number.ilike.%${filters.searchTerm}%,policies.insurer_name.ilike.%${filters.searchTerm}%`
        );
      }

      // Apply pagination
      const from = pagination.pageIndex * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      const formattedData = data.map((item) => ({
        id: item.id,
        policy_id: item.policy_id,
        policy_number: item.policies?.policy_number || "N/A",
        insurer_name: item.policies?.insurer_name || "N/A",
        client_name: item.clients?.name || "N/A",
        base_amount: item.base_amount,
        rate: item.rate,
        calculated_amount: item.calculated_amount,
        status: item.status,
        created_at: item.created_at,
        payment_date: item.payment_date,
      }));

      return {
        data: formattedData,
        count: count || 0,
      };
    },
  });

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ pageIndex: 0, pageSize: size });
  };

  const handleProcessCommission = (commissionId: string) => {
    toast({
      title: t("processCommission"),
      description: t("processingCommission"),
    });
    // Implementation would call API to process the commission
  };

  const handleConfirmCommission = (commissionId: string) => {
    toast({
      title: t("confirmCommission"),
      description: t("confirmingCommission"),
    });
    // Implementation would call API to confirm the commission
  };

  const handleGenerateInvoice = (commissionId: string) => {
    toast({
      title: t("generateInvoice"),
      description: t("generatingInvoice"),
    });
    // Implementation would call API to generate an invoice for the commission
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value });
  };

  const handleInsurerFilterChange = (value: string) => {
    setFilters({ ...filters, insurer: value });
  };

  const handleExportCommissions = () => {
    toast({
      title: t("exportCommissions"),
      description: t("exportingCommissions"),
    });
    // Implementation would export commissions data
  };

  const handleCalculateCommissions = () => {
    setUploadDialogOpen(true);
  };

  const columns: Column<Commission>[] = [
    {
      header: t("policyNumber"),
      accessorKey: "policy_number",
      sortable: true,
    },
    {
      header: t("insurer"),
      accessorKey: "insurer_name",
      sortable: true,
    },
    {
      header: t("client"),
      accessorKey: "client_name",
      sortable: true,
    },
    {
      header: t("baseAmount"),
      accessorKey: "base_amount",
      sortable: true,
      cell: (row: Commission) => formatCurrency(row.base_amount, "EUR"),
    },
    {
      header: t("rate"),
      accessorKey: "rate",
      sortable: true,
      cell: (row: Commission) => `${row.rate}%`,
    },
    {
      header: t("calculatedAmount"),
      accessorKey: "calculated_amount",
      sortable: true,
      cell: (row: Commission) => formatCurrency(row.calculated_amount, "EUR"),
    },
    {
      header: t("status"),
      accessorKey: "status",
      sortable: true,
      cell: (row: Commission) => (
        <Badge
          variant={
            row.status === "invoiced"
              ? "default"
              : row.status === "confirmed"
              ? "success"
              : row.status === "processed"
              ? "secondary"
              : "outline"
          }
        >
          {t(row.status)}
        </Badge>
      ),
    },
    {
      header: t("createdAt"),
      accessorKey: "created_at",
      sortable: true,
      cell: (row: Commission) => formatDate(row.created_at),
    },
    {
      header: t("actions"),
      accessorKey: ((row: Commission) => row.id) as any,
      cell: (row: Commission) => (
        <div className="flex space-x-2">
          {row.status === "pending" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleProcessCommission(row.id)}
            >
              {t("process")}
            </Button>
          )}
          {row.status === "processed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleConfirmCommission(row.id)}
            >
              {t("confirm")}
            </Button>
          )}
          {row.status === "confirmed" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleGenerateInvoice(row.id)}
            >
              {t("invoice")}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{t("commissionManagement")}</h2>
          <p className="text-muted-foreground">{t("manageCommissionCalculations")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleExportCommissions}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
          <Button
            onClick={handleCalculateCommissions}
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            {t("calculateCommissions")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("commissionOverview")}</CardTitle>
          <CardDescription>
            {t("trackAndManageCommissions")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-1 gap-2">
              <div className="relative w-full">
                <Input
                  placeholder={t("searchCommissionsByPolicy")}
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 sm:justify-end">
              <div className="w-48">
                <Select
                  value={filters.insurer}
                  onValueChange={handleInsurerFilterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("filterByInsurer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("all")}</SelectItem>
                    <SelectItem value="InsuranceCompany1">
                      Insurance Company 1
                    </SelectItem>
                    <SelectItem value="InsuranceCompany2">
                      Insurance Company 2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="pending"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4 flex justify-start w-full">
              <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
              <TabsTrigger value="processed">{t("processed")}</TabsTrigger>
              <TabsTrigger value="confirmed">{t("confirmed")}</TabsTrigger>
              <TabsTrigger value="invoiced">{t("invoiced")}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="pt-2">
              {data && data.data.length > 0 ? (
                <DataTable
                  data={data.data}
                  columns={columns}
                  isLoading={isLoading}
                  pagination={{
                    pageSize: pagination.pageSize,
                    currentPage: pagination.pageIndex,
                    totalItems: data.count,
                    onPageChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                    pageSizeOptions: [10, 20, 30, 50],
                  }}
                />
              ) : (
                <EmptyState
                  icon={<Calculator className="h-8 w-8 text-muted-foreground" />}
                  title={t("noCommissionsFound")}
                  description={t("noCommissionsDescription")}
                  action={
                    <Button
                      onClick={handleCalculateCommissions}
                      className="flex items-center gap-2"
                    >
                      <Calculator className="h-4 w-4" />
                      {t("calculateCommissions")}
                    </Button>
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CommissionUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      />
    </div>
  );
};

export default Commissions;
