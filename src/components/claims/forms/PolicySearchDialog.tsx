
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Policy {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  product_name?: string;
}

interface PolicySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  policies: Policy[];
  isLoading: boolean;
  onPolicySelect: (policyId: string) => void;
}

const PolicySearchDialog: React.FC<PolicySearchDialogProps> = ({
  open,
  onOpenChange,
  searchTerm,
  onSearchTermChange,
  policies,
  isLoading,
  onPolicySelect,
}) => {
  const { t } = useLanguage();
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedPolicyId(null);
    }
  }, [open]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(e.target.value);
  };

  const handleSelectPolicy = () => {
    if (selectedPolicyId) {
      onPolicySelect(selectedPolicyId);
    }
  };

  const handleRowClick = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("searchPolicy")}</DialogTitle>
          <DialogDescription>
            {t("searchPolicyDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchByPolicyOrPolicyholder")}
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : policies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("policyNumber")}</TableHead>
                  <TableHead>{t("policyholder")}</TableHead>
                  <TableHead>{t("insurer")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow 
                    key={policy.id} 
                    className={`cursor-pointer hover:bg-muted/50 ${selectedPolicyId === policy.id ? 'bg-muted' : ''}`}
                    onClick={() => handleRowClick(policy.id)}
                  >
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>{policy.policyholder_name}</TableCell>
                    <TableCell>{policy.insurer_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-6 border rounded-md">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-lg font-medium">{t("noPoliciesFound")}</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                {searchTerm.length > 0 
                  ? t("noMatchingPoliciesFound") 
                  : t("enterSearchTermForPolicies")}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSelectPolicy}
            disabled={!selectedPolicyId}
          >
            {t("select")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicySearchDialog;
