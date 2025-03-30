
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, FileText, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Policy } from "@/types/policies";
import { BankTransaction } from "@/types/finances";

export interface MatchTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (transactionId: string, policyId: string) => void;
  transaction: BankTransaction | null;
  isLoading: boolean;
}

const MatchTransactionDialog: React.FC<MatchTransactionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  transaction,
  isLoading
}) => {
  const { t, formatCurrency } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  
  // Query to fetch policies based on search term
  const { data: policies, isLoading: isPoliciesLoading } = useQuery({
    queryKey: ['policies-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const { data, error } = await supabase
        .from('policies')
        .select('*')
        .or(`policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      return data as Policy[];
    },
    enabled: searchTerm.length >= 2,
  });
  
  const handleConfirm = () => {
    if (transaction && selectedPolicyId) {
      onConfirm(transaction.id, selectedPolicyId);
    }
  };
  
  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{t("linkTransactionToPolicy")}</DialogTitle>
        </DialogHeader>
        
        {transaction && (
          <div className="grid gap-4 py-4">
            <div className="bg-muted/40 p-3 rounded-md border">
              <h3 className="font-medium text-sm">{t("transactionDetails")}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">{t("date")}</div>
                  <div className="text-sm">{new Date(transaction.transaction_date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{t("amount")}</div>
                  <div className="text-sm font-medium">{formatCurrency(transaction.amount)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">{t("description")}</div>
                  <div className="text-sm">{transaction.description}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">{t("reference")}</div>
                  <div className="text-sm">{transaction.reference || "-"}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policySearch">{t("searchPolicy")}</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="policySearch"
                  placeholder={t("searchByPolicyOrPolicyholder")}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {searchTerm.length < 2 && (
              <div className="text-sm text-muted-foreground text-center py-2">
                {t("enterAtLeastTwoCharacters")}
              </div>
            )}
            
            {searchTerm.length >= 2 && isPoliciesLoading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            
            {searchTerm.length >= 2 && !isPoliciesLoading && policies && policies.length === 0 && (
              <div className="text-center p-4 border rounded-md">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">{t("noPoliciesFound")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("tryDifferentSearchTerms")}
                </p>
              </div>
            )}
            
            {searchTerm.length >= 2 && !isPoliciesLoading && policies && policies.length > 0 && (
              <div className="border rounded-md max-h-60 overflow-auto">
                <div className="divide-y">
                  {policies.map((policy) => (
                    <div 
                      key={policy.id}
                      className={`p-2 hover:bg-muted cursor-pointer ${
                        selectedPolicyId === policy.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handlePolicySelect(policy.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{policy.policy_number}</div>
                          <div className="text-sm text-muted-foreground">{policy.policyholder_name}</div>
                        </div>
                        <div className="text-sm text-right">
                          <div>{policy.insurer_name}</div>
                          <div className="text-muted-foreground">{formatCurrency(policy.premium)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedPolicyId && (
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-900">
                <div className="flex items-center text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t("policySelected")}
                </div>
                <div className="text-sm mt-1">
                  {policies?.find(p => p.id === selectedPolicyId)?.policy_number} - 
                  {policies?.find(p => p.id === selectedPolicyId)?.policyholder_name}
                </div>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedPolicyId || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </>
            ) : (
              t("matchTransaction")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchTransactionDialog;
