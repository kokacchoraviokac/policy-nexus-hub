
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import CommissionsTable from "@/components/finances/commissions/CommissionsTable";
import CommissionsHeader from "@/components/finances/commissions/CommissionsHeader";
import { useCommissions } from "@/hooks/useCommissions";

const Commissions: React.FC = () => {
  const { t } = useLanguage();
  const commissionsHook = useCommissions();
  
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
        updateCommissionStatus={commissionsHook.updateCommissionStatus}
        isUpdating={commissionsHook.isUpdating}
      />
    </div>
  );
};

export default Commissions;
