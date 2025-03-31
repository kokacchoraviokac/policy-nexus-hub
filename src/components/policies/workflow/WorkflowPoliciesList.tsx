
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileEdit, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkflowPolicy } from "@/hooks/useWorkflowPolicies";

interface WorkflowPoliciesListProps {
  policies: WorkflowPolicy[];
  isLoading: boolean;
  onReviewPolicy: (policyId: string) => void;
}

const WorkflowPoliciesList: React.FC<WorkflowPoliciesListProps> = ({ 
  policies, 
  isLoading, 
  onReviewPolicy 
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary animate-spin mr-2" />
        <span>{t("loading")}</span>
      </div>
    );
  }
  
  if (policies.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md bg-muted/50 my-4">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <h3 className="font-medium text-lg">{t("noPoliciesFound")}</h3>
        <p className="text-muted-foreground">{t("noPoliciesInWorkflowDescription")}</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("policyNumber")}</TableHead>
          <TableHead>{t("insurer")}</TableHead>
          <TableHead>{t("client")}</TableHead>
          <TableHead>{t("startDate")}</TableHead>
          <TableHead>{t("expiryDate")}</TableHead>
          <TableHead>{t("premium")}</TableHead>
          <TableHead className="text-right">{t("actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policies.map((policy) => (
          <TableRow key={policy.id}>
            <TableCell className="font-medium">{policy.policyNumber}</TableCell>
            <TableCell>{policy.insurer}</TableCell>
            <TableCell>{policy.client}</TableCell>
            <TableCell>{formatDate(policy.startDate)}</TableCell>
            <TableCell>{formatDate(policy.endDate)}</TableCell>
            <TableCell>{formatCurrency(policy.premium, policy.currency)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReviewPolicy(policy.id)}
              >
                <FileEdit className="h-4 w-4 mr-2" />
                {t("review")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default WorkflowPoliciesList;
