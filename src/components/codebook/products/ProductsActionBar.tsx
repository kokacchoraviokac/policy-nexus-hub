
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImportExportButtons from "../ImportExportButtons";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductsActionBarProps {
  onAddProduct: () => void;
  onImport: (importedProducts: any[]) => Promise<void>;
  getExportData: () => any[];
}

const ProductsActionBar: React.FC<ProductsActionBarProps> = ({
  onAddProduct,
  onImport,
  getExportData
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <ImportExportButtons
          onImport={onImport}
          getData={getExportData}
          entityName={t("insuranceProducts")}
        />
        <Button className="flex items-center gap-1" onClick={onAddProduct}>
          <Plus className="h-4 w-4" /> {t("addProduct")}
        </Button>
      </div>
    </div>
  );
};

export default ProductsActionBar;
