
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUnlinkedPayments } from "@/hooks/useUnlinkedPayments";
import { useUnlinkedPaymentsFilters, FilterOptions } from "@/hooks/unlinked-payments/useUnlinkedPaymentsFilters";
import { useUnlinkedPaymentsPagination } from "@/hooks/unlinked-payments/useUnlinkedPaymentsPagination";
import UnlinkedPaymentsTable from "@/components/finances/unlinked-payments/UnlinkedPaymentsTable";
import UnlinkedPaymentsFilters from "@/components/finances/unlinked-payments/UnlinkedPaymentsFilters";
import LinkPaymentDialog from "@/components/finances/unlinked-payments/LinkPaymentDialog";
import { UnlinkedPaymentType } from "@/types/finances";
import { RefreshCw } from "lucide-react";
import { RefetchOptions } from "@tanstack/react-query";

const UnlinkedPayments: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { pagination, setPagination } = useUnlinkedPaymentsPagination();
  const { filters, setFilters } = useUnlinkedPaymentsFilters();
  const [selectedPayment, setSelectedPayment] = useState<UnlinkedPaymentType | null>(null);
  
  const { 
    payments, 
    totalCount, 
    isLoading, 
    linkPayment, 
    isLinking, 
    refetch 
  } = useUnlinkedPayments(pagination, filters);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, page: 1, pageIndex: 0 }));
    
    // Handle date filters properly
    if (newFilters.dateFrom) {
      setFilters(prev => ({ 
        ...prev, 
        dateFrom: newFilters.dateFrom,
        startDate: newFilters.dateFrom // Map to both properties
      }));
    }
    
    if (newFilters.dateTo) {
      setFilters(prev => ({ 
        ...prev, 
        dateTo: newFilters.dateTo,
        endDate: newFilters.dateTo // Map to both properties
      }));
    }
    
    // Handle other filters
    setFilters(prev => ({
      ...prev,
      searchTerm: newFilters.searchTerm,
      status: newFilters.status
    }));
  };
  
  const handleLinkPayment = async (paymentId: string, policyId: string) => {
    try {
      await linkPayment({ paymentId, policyId });
      setSelectedPayment(null);
      toast({
        title: t("paymentLinkSuccess"),
        description: t("paymentSuccessfullyLinked")
      });
    } catch (error) {
      toast({
        title: t("errorLinkingPayment"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("refresh")}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("unlinkedPayments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UnlinkedPaymentsFilters 
            filters={filters}
            onFilterChange={handleFilterChange} 
            onRefresh={refetch}
            isLoading={isLoading}
          />
          
          <div className="mt-6">
            <UnlinkedPaymentsTable 
              payments={payments as UnlinkedPaymentType[]}
              isLoading={isLoading}
              onLinkPayment={(payment) => setSelectedPayment(payment)}
              pagination={{
                currentPage: pagination.page,
                totalPages: Math.ceil(totalCount / pagination.pageSize),
                itemsPerPage: pagination.pageSize,
                totalItems: totalCount,
                onPageChange: (page) => setPagination({ ...pagination, page, pageIndex: page - 1 }),
                onPageSizeChange: (pageSize) => setPagination({ page: 1, pageSize, pageIndex: 0 })
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {selectedPayment && (
        <LinkPaymentDialog 
          open={!!selectedPayment}
          payment={selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
          onLink={handleLinkPayment}
          isLinking={isLinking}
        />
      )}
    </div>
  );
};

export default UnlinkedPayments;
