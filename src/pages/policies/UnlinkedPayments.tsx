
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, Link2, DownloadCloud, Eye, CircleDollarSign } from "lucide-react";
import { useUnlinkedPayments, UnlinkedPayment } from "@/hooks/useUnlinkedPayments";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/ui/data-table";
import EmptyState from "@/components/ui/empty-state";
import UnlinkedPaymentsFilters from "@/components/policies/unlinked-payments/UnlinkedPaymentsFilters";
import LinkPaymentDialog from "@/components/policies/unlinked-payments/LinkPaymentDialog";

const UnlinkedPayments = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const [selectedPayment, setSelectedPayment] = useState<UnlinkedPayment | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  
  const {
    payments,
    totalCount,
    isLoading,
    filters,
    setFilters,
    pagination,
    setPagination,
    refetch,
    linkPayment,
    isLinking
  } = useUnlinkedPayments();

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const handlePageSizeChange = (size: number) => {
    setPagination({ pageIndex: 0, pageSize: size });
  };

  const handleLinkPayment = (payment: UnlinkedPayment) => {
    setSelectedPayment(payment);
    setLinkDialogOpen(true);
  };

  const handleConfirmLinkPayment = (paymentId: string, policyId: string) => {
    linkPayment({ paymentId, policyId });
  };

  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleExportPayments = () => {
    // For future implementation - export functionality
    console.log("Export payments");
  };

  const columns = [
    {
      header: t("reference"),
      accessorKey: "reference",
      sortable: true,
      cell: (row: UnlinkedPayment) => (
        <div>
          {row.reference || "-"}
          {row.linked_policy_id && (
            <Badge variant="outline" className="ml-2">
              {t("linked")}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: t("payer"),
      accessorKey: "payer_name",
      sortable: true,
    },
    {
      header: t("amount"),
      accessorKey: "amount",
      sortable: true,
      cell: (row: UnlinkedPayment) => formatCurrency(row.amount, row.currency),
    },
    {
      header: t("paymentDate"),
      accessorKey: "payment_date",
      sortable: true,
      cell: (row: UnlinkedPayment) => formatDate(row.payment_date),
    },
    {
      header: t("actions"),
      accessorKey: "id",
      cell: (row: UnlinkedPayment) => (
        <div className="flex space-x-2">
          {!row.linked_policy_id && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleLinkPayment(row)}
            >
              <Link2 className="h-4 w-4 mr-1" />
              {t("linkPolicy")}
            </Button>
          )}
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const renderPaymentsTable = () => {
    if (payments.length === 0 && !isLoading && filters.status === "unlinked") {
      return (
        <EmptyState
          icon={<CircleDollarSign className="h-8 w-8" />}
          title={t("noUnlinkedPayments")}
          description={t("allPaymentsLinked")}
        />
      );
    }

    return (
      <DataTable
        data={payments}
        columns={columns}
        isLoading={isLoading}
        emptyState={{
          title: t("noResults"),
          description: t("noResultsDescription"),
        }}
        pagination={{
          pageSize: pagination.pageSize,
          currentPage: pagination.pageIndex,
          totalItems: totalCount,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
          pageSizeOptions: [10, 20, 50],
        }}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
          <p className="text-muted-foreground">
            {t("unlinkedPaymentsDescription")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPayments}>
            <DownloadCloud className="mr-2 h-4 w-4" />
            {t("exportPayments")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setFilters({ ...filters, status: "all" })}>
            {t("all")}
          </TabsTrigger>
          <TabsTrigger value="unlinked" onClick={() => setFilters({ ...filters, status: "unlinked" })}>
            {t("unlinked")}
          </TabsTrigger>
          <TabsTrigger value="linked" onClick={() => setFilters({ ...filters, status: "linked" })}>
            {t("linked")}
          </TabsTrigger>
        </TabsList>

        <UnlinkedPaymentsFilters
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={refetch}
        />

        <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-lg border border-border">
          {renderPaymentsTable()}
        </div>
      </Tabs>

      <LinkPaymentDialog
        payment={selectedPayment}
        open={linkDialogOpen}
        onClose={handleCloseLinkDialog}
        onLinkPayment={handleConfirmLinkPayment}
        isLinking={isLinking}
      />
    </div>
  );
};

export default UnlinkedPayments;
