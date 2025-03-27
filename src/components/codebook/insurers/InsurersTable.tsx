
import React from "react";
import DataTable from "@/components/ui/data-table";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Insurer } from "@/types/codebook";
import getInsurerColumns from "@/components/codebook/insurers/InsurersColumns";

interface InsurersTableProps {
  insurers: Insurer[];
  isLoading: boolean;
  canAddInsurer: boolean;
  onViewDetails: (id: string) => void;
  onAddInsurer: () => void;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions: number[];
  };
}

const InsurersTable: React.FC<InsurersTableProps> = ({
  insurers,
  isLoading,
  canAddInsurer,
  onViewDetails,
  onAddInsurer,
  pagination
}) => {
  const { t } = useLanguage();

  return (
    <DataTable
      data={insurers}
      columns={getInsurerColumns(onViewDetails)}
      isLoading={isLoading}
      emptyState={{
        title: t("noInsurersFound"),
        description: t("noInsurersFoundDescription"),
        action: canAddInsurer ? (
          <Button onClick={onAddInsurer}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("addInsurer")}
          </Button>
        ) : undefined
      }}
      pagination={pagination}
    />
  );
};

export default InsurersTable;
