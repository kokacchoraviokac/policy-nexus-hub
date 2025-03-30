
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import CommissionsTable from "@/components/finances/commissions/CommissionsTable";
import CommissionsHeader from "@/components/finances/commissions/CommissionsHeader";
import { useCommissions } from "@/hooks/useCommissions";
import { CommissionType } from "@/types/finances";

const Commissions: React.FC = () => {
  const { t } = useLanguage();
  const commissionsHook = useCommissions();
  
  // Create a wrapper for updateCommissionStatus to handle the type conversion
  const handleUpdateCommissionStatus = (data: { 
    commissionId: string; 
    status: CommissionType['status']; 
    paymentDate?: string; 
    paidAmount?: number 
  }) => {
    commissionsHook.updateCommissionStatus({
      commissionId: data.commissionId,
      status: data.status,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : undefined,
      paidAmount: data.paidAmount
    });
  };
  
  return (
    <div className="space-y-6">
      <CommissionsHeader 
        onExport={commissionsHook.exportCommissions} 
        filters={commissionsHook.filters}
        setFilters={commissionsHook.setFilters}
      />
      <CommissionsTable 
        commissions={commissionsHook.commissions}
        isLoading={commissionsHook.isLoading}
        pagination={{
          currentPage: commissionsHook.pagination.pageIndex,
          totalPages: Math.ceil(commissionsHook.totalCount / commissionsHook.pagination.pageSize),
          itemsPerPage: commissionsHook.pagination.pageSize,
          totalItems: commissionsHook.totalCount,
          onPageChange: (page) => commissionsHook.setPagination({...commissionsHook.pagination, pageIndex: page}),
          onPageSizeChange: (pageSize) => commissionsHook.setPagination({pageIndex: 0, pageSize})
        }}
        updateCommissionStatus={handleUpdateCommissionStatus}
        isUpdating={commissionsHook.isUpdating}
      />
    </div>
  );
};

export default Commissions;
