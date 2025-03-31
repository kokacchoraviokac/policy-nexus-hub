
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface UnlinkedPaymentsHeaderProps {
  onExport: () => void;
}

const UnlinkedPaymentsHeader: React.FC<UnlinkedPaymentsHeaderProps> = ({ onExport }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{t("unlinkedPayments")}</h1>
        <p className="text-muted-foreground">
          {t("unlinkedPaymentsDescription")}
        </p>
      </div>
      
      <Button variant="outline" onClick={onExport} className="self-start md:self-auto">
        <Download className="mr-2 h-4 w-4" />
        {t("exportPayments")}
      </Button>
    </div>
  );
};

export default UnlinkedPaymentsHeader;
