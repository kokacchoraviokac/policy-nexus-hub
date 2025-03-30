
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface EmptyPaymentsStateProps {
  onClearFilters: () => void;
}

const EmptyPaymentsState: React.FC<EmptyPaymentsStateProps> = ({ onClearFilters }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-muted-foreground">{t("noPaymentsFound")}</p>
      <Button 
        variant="link" 
        className="mt-2" 
        onClick={onClearFilters}
      >
        {t("clearFilters")}
      </Button>
    </div>
  );
};

export default EmptyPaymentsState;
