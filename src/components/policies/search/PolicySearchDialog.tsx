
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { usePolicySearch } from '@/hooks/usePolicySearch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDateToLocal } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';
import LoadingState from '@/components/ui/loading-state';
import EmptyState from '@/components/ui/empty-state';

interface PolicySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (policy: any) => void;
  initialSearch?: string;
}

const PolicySearchDialog: React.FC<PolicySearchDialogProps> = ({
  open,
  onOpenChange,
  onSelect,
  initialSearch = ''
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  const { policies, isLoading, search } = usePolicySearch();
  
  useEffect(() => {
    if (open && searchTerm) {
      search(searchTerm);
    }
  }, [open, searchTerm]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(searchTerm);
  };
  
  const handleSelect = (policy: any) => {
    onSelect(policy);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("searchPolicies")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex items-center gap-2 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchByPolicyNumberClientOrInsurer")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">{t("search")}</Button>
        </form>
        
        <div className="mt-4">
          {isLoading ? (
            <LoadingState>{t("searchingPolicies")}</LoadingState>
          ) : policies.length === 0 ? (
            <EmptyState
              title={t("noPoliciesFound")}
              description={t("trySearchingWithDifferentTerms")}
            />
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("policyNumber")}</TableHead>
                    <TableHead>{t("policyholder")}</TableHead>
                    <TableHead>{t("insurer")}</TableHead>
                    <TableHead>{t("validFrom")}</TableHead>
                    <TableHead>{t("premium")}</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies.map((policy) => (
                    <TableRow key={policy.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleSelect(policy)}>
                      <TableCell className="font-medium">{policy.policy_number}</TableCell>
                      <TableCell>{policy.policyholder_name}</TableCell>
                      <TableCell>{policy.insurer_name}</TableCell>
                      <TableCell>{formatDateToLocal(policy.start_date)}</TableCell>
                      <TableCell>
                        {formatCurrency(policy.premium, policy.currency)}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => handleSelect(policy)}>
                          {t("select")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicySearchDialog;
