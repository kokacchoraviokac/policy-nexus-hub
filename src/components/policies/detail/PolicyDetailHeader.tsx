
import React from "react";
import { Edit, FileDown, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface PolicyDetailHeaderProps {
  policy: any; // This will be properly typed when we have the full schema
  onEdit: () => void;
  onRenew: () => void;
  onExport: () => void;
}

const PolicyDetailHeader: React.FC<PolicyDetailHeaderProps> = ({
  policy,
  onEdit,
  onRenew,
  onExport
}) => {
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";
    
    switch (status.toLowerCase()) {
      case 'active':
        variant = "default";
        break;
      case 'expired':
        variant = "destructive";
        break;
      case 'pending':
        variant = "secondary";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {policy.policy_number}
          </h1>
          {getStatusBadge(policy.status)}
        </div>
        <p className="text-muted-foreground">
          {policy.insurer_name} - {policy.product_name || t("notSpecified")}
        </p>
      </div>
      
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <Button variant="outline" size="sm" onClick={onExport}>
          <FileDown className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
        <Button variant="outline" size="sm" onClick={onRenew}>
          <Repeat className="mr-2 h-4 w-4" />
          {t("renew")}
        </Button>
        <Button size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          {t("edit")}
        </Button>
      </div>
    </div>
  );
};

export default PolicyDetailHeader;
