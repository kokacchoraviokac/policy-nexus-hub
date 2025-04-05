
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePolicySearch } from '@/hooks/usePolicySearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { formatDateToLocal } from '@/utils/dateUtils';
import LoadingState from '@/components/ui/loading-state';

interface PolicySearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPolicySelected: (policy: any) => void;
}

const PolicySearchDialog: React.FC<PolicySearchDialogProps> = ({
  open,
  onOpenChange,
  onPolicySelected
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const { policies, isLoading, search } = usePolicySearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      search(searchTerm);
    }
  };

  const handlePolicySelect = (policy: any) => {
    onPolicySelected(policy);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("searchPolicies")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchByPolicyNumberOrPolicyholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit">{t("search")}</Button>
        </form>
        
        {isLoading ? (
          <LoadingState>{t("searchingPolicies")}</LoadingState>
        ) : policies.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2 font-medium">{t("policyNumber")}</th>
                  <th className="text-left p-2 font-medium">{t("policyholder")}</th>
                  <th className="text-left p-2 font-medium">{t("insurer")}</th>
                  <th className="text-left p-2 font-medium">{t("expiryDate")}</th>
                </tr>
              </thead>
              <tbody>
                {policies.map(policy => (
                  <tr 
                    key={policy.id} 
                    onClick={() => handlePolicySelect(policy)}
                    className="cursor-pointer hover:bg-muted/50 border-t"
                  >
                    <td className="p-2">{policy.policy_number}</td>
                    <td className="p-2">{policy.policyholder_name}</td>
                    <td className="p-2">{policy.insurer_name}</td>
                    <td className="p-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {formatDateToLocal(policy.expiry_date)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : searchTerm && (
          <div className="text-center p-4 border rounded-md">
            <p className="text-muted-foreground">{t("noPoliciesFound")}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PolicySearchDialog;
