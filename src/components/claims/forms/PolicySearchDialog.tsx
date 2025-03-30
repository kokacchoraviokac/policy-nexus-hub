
import React from "react";
import { Search, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PolicySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  isLoading: boolean;
  policies: any[] | null;
  onPolicySelect: (policyId: string) => void;
}

const PolicySearchDialog = ({
  open,
  onOpenChange,
  searchTerm,
  onSearchTermChange,
  isLoading,
  policies,
  onPolicySelect,
}: PolicySearchDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("searchPolicy")}</DialogTitle>
          <DialogDescription>{t("searchPolicyDescription")}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchByPolicyOrPolicyholder")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : policies && policies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("policyNumber")}</TableHead>
                  <TableHead>{t("policyholder")}</TableHead>
                  <TableHead>{t("insurer")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.policy_number}</TableCell>
                    <TableCell>{policy.policyholder_name}</TableCell>
                    <TableCell>{policy.insurer_name}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => onPolicySelect(policy.id)}
                      >
                        {t("select")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">{t("noPoliciesFound")}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicySearchDialog;
