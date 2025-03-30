
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { FileDown, Upload, Calculator } from "lucide-react";
import CommissionsFilters from "@/components/finances/commissions/CommissionsFilters";
import CalculationUploadDialog from "@/components/finances/commissions/CalculationUploadDialog";
import { CommissionFilterOptions } from "@/hooks/commissions/useCommissionFilters";

interface CommissionsHeaderProps {
  onExport: () => void;
  filters: CommissionFilterOptions;
  setFilters: (filters: CommissionFilterOptions) => void;
}

const CommissionsHeader: React.FC<CommissionsHeaderProps> = ({
  onExport,
  filters,
  setFilters
}) => {
  const { t } = useLanguage();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("commissions")}</h1>
          <p className="text-muted-foreground">{t("commissionsModuleDescription")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Upload className="h-4 w-4" />
            {t("uploadCalculation")}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={onExport}
          >
            <FileDown className="h-4 w-4" />
            {t("export")}
          </Button>
        </div>
      </div>
      
      <CommissionsFilters 
        filters={filters} 
        onFilterChange={setFilters} 
      />
      
      {uploadDialogOpen && (
        <CalculationUploadDialog 
          open={uploadDialogOpen} 
          onClose={() => setUploadDialogOpen(false)} 
        />
      )}
    </div>
  );
};

export default CommissionsHeader;
