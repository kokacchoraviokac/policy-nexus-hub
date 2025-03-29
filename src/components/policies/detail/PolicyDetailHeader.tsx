
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Policy } from "@/types/policies";
import { Button } from "@/components/ui/button";
import { Edit, Rotate, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportPoliciesToCSV } from "@/utils/policies/policyExportUtils";

interface PolicyDetailHeaderProps {
  policy: Policy;
  onEdit: () => void;
  onRenew: () => void;
  onExport: () => void;
}

const PolicyDetailHeader: React.FC<PolicyDetailHeaderProps> = ({
  policy,
  onEdit,
  onRenew,
  onExport,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleExportPolicy = () => {
    try {
      // Generate filename with policy number and current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const filename = `policy-${policy.policy_number}-${dateStr}.csv`;
      
      // Export the policy to CSV
      exportPoliciesToCSV([policy], filename);
      
      toast({
        title: t("exportComplete"),
        description: t("policyExportedSuccessfully"),
      });
      
      // Call the parent's onExport callback
      onExport();
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: t("exportFailed"),
        description: t("errorExportingPolicy"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-lg border border-border p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          {policy.policy_number}
          <span className={`
            text-sm px-2 py-1 rounded-full
            ${policy.status === 'active' ? 'bg-green-100 text-green-800' : 
              policy.status === 'expired' ? 'bg-red-100 text-red-800' : 
              'bg-amber-100 text-amber-800'}
          `}>
            {policy.status}
          </span>
        </h1>
        <p className="text-muted-foreground">
          {policy.insurer_name} - {policy.product_name || t("unspecifiedProduct")}
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExportPolicy}>
          <FileDown className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
        
        <Button variant="outline" size="sm" onClick={onRenew}>
          <Rotate className="mr-2 h-4 w-4" />
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
