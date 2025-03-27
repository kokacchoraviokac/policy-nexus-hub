
import React from "react";
import { Book, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface InsurerDetailHeaderProps {
  title?: string;
}

const InsurerDetailHeader: React.FC<InsurerDetailHeaderProps> = ({ title }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2 mb-6">
      <Book className="h-6 w-6 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight">{t("codebook")}</h1>
      <span className="text-muted-foreground">/</span>
      <div className="flex items-center space-x-1">
        <Building2 className="h-5 w-5" />
        <span className="font-medium">{title || t('insuranceCompanyDetails')}</span>
      </div>
    </div>
  );
};

export default InsurerDetailHeader;
