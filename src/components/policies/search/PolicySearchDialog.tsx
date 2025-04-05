
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { usePolicySearch } from "@/hooks/usePolicySearch";

export interface Policy {
  id: string;
  policy_number: string;
  policyholder_name: string;
  insurer_name: string;
  expiry_date: string;
}

export interface PolicySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (policy: Policy) => void;
  searchTerm?: string;
}

const PolicySearchDialog: React.FC<PolicySearchDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
  searchTerm: initialSearchTerm = ""
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  const { policies, isLoading, search } = usePolicySearch();
  
  useEffect(() => {
    if (open && searchTerm) {
      search(searchTerm);
    }
  }, [open, searchTerm, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 3) {
      search(e.target.value);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t("searchPolicy")}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchByPolicyOrPolicyholder")}
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : policies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("noPoliciesFound")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("policyNumber")}</TableHead>
                  <TableHead>{t("policyholder")}</TableHead>
                  <TableHead>{t("insurer")}</TableHead>
                  <TableHead>{t("expiryDate")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>{policy.policyholder_name}</TableCell>
                    <TableCell>{policy.insurer_name}</TableCell>
                    <TableCell>{formatDate(policy.expiry_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelect(policy)}
                      >
                        {t("select")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicySearchDialog;
