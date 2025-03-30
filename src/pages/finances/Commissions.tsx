
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  RefreshCw,
  Calculator,
  FileUp,
  FileCheck,
  CreditCard
} from "lucide-react";
import { useCommissions } from "@/hooks/useCommissions";
import { CommissionType } from "@/types/finances";
import CommissionsFilters from "@/components/finances/commissions/CommissionsFilters";
import CommissionStatusBadge from "@/components/finances/commissions/CommissionStatusBadge";
import CalculationUploadDialog from "@/components/finances/commissions/CalculationUploadDialog";
import UpdateCommissionStatusDialog from "@/components/finances/commissions/UpdateCommissionStatusDialog";
import { PaginationController } from "@/components/ui/pagination-controller";

const Commissions = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<CommissionType & { currency?: string }>();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  
  const {
    commissions,
    totalCount,
    isLoading,
    isError,
    refetch,
    filters,
    setFilters,
    pagination,
    setPagination,
    updateCommissionStatus,
    isUpdating,
    exportCommissions
  } = useCommissions();
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };
  
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
  };
  
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setPagination({ pageIndex: 0, pageSize: rowsPerPage });
  };
  
  const handleStatusUpdate = (commission: CommissionType & { currency?: string }) => {
    setSelectedCommission(commission);
    setShowUpdateDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("commissions")}</h1>
          <p className="text-muted-foreground">
            {t("commissionsDescription")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportCommissions}>
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
          <Button onClick={() => setShowUploadDialog(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            {t("uploadCalculation")}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("commissionManagement")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <CommissionsFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
            
            <div className="flex justify-end">
              <Button variant="outline" size="icon" onClick={() => refetch()} title={t("refresh")}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
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
                    <TableHead>{t("paymentDate")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2">{t("loadingCommissions")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24 text-destructive">
                        {t("errorLoadingCommissions")}
                      </TableCell>
                    </TableRow>
                  ) : commissions.length > 0 ? (
                    commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">{commission.policy_number || '-'}</TableCell>
                        <TableCell>{commission.policyholder_name || '-'}</TableCell>
                        <TableCell>{commission.insurer_name || '-'}</TableCell>
                        <TableCell className="text-right">{formatCurrency(commission.base_amount, commission.currency || "EUR")}</TableCell>
                        <TableCell className="text-center">{commission.rate}%</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(commission.calculated_amount, commission.currency || "EUR")}
                          {commission.paid_amount && commission.paid_amount !== commission.calculated_amount && (
                            <div className="text-xs text-muted-foreground">
                              {t("paid")}: {formatCurrency(commission.paid_amount, commission.currency || "EUR")}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <CommissionStatusBadge status={commission.status} />
                        </TableCell>
                        <TableCell>
                          {commission.payment_date ? formatDate(new Date(commission.payment_date)) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusUpdate(commission)}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            {t("updateStatus")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                        {t("noCommissionsFound")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {commissions.length > 0 && (
              <PaginationController
                currentPage={pagination.pageIndex}
                totalPages={Math.ceil(totalCount / pagination.pageSize)}
                totalItems={totalCount}
                itemsPerPage={pagination.pageSize}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleRowsPerPageChange}
                itemsPerPageOptions={[10, 25, 50, 100]}
                showingText={t("showingItemsOf")}
                ofText={t("of")}
                itemsText={t("commissions").toLowerCase()}
                nextText={t("next")}
                previousText={t("previous")}
                pageText={t("page")}
                pageXOfYText={t("pageXOfY")}
                rowsPerPageText={t("rowsPerPage")}
                goToText={t("goTo")}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Upload Calculation Dialog */}
      <CalculationUploadDialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
      />
      
      {/* Update Commission Status Dialog */}
      {selectedCommission && (
        <UpdateCommissionStatusDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          commission={selectedCommission}
          onUpdateStatus={updateCommissionStatus}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default Commissions;
