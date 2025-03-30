
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Loader2, Search, X } from "lucide-react";
import { usePoliciesSearch } from "@/hooks/usePoliciesSearch";
import { Policy } from "@/types/policies";

export interface LinkPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (policyId: string) => void;
  isLoading: boolean;
  paymentReference?: string;
  paymentAmount?: number;
  payerName?: string;
}

const LinkPaymentDialog: React.FC<LinkPaymentDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  paymentReference,
  paymentAmount,
  payerName
}) => {
  const { t, formatCurrency } = useLanguage();
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  
  const {
    policies,
    isLoading: isSearching,
    searchTerm,
    setSearchTerm
  } = usePoliciesSearch();
  
  const handleConfirm = () => {
    if (selectedPolicyId) {
      onConfirm(selectedPolicyId);
    }
  };
  
  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };

  // Reset selected policy when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedPolicyId("");
      setSearchTerm("");
    }
  }, [open, setSearchTerm]);

  const selectedPolicy = policies.find(p => p.id === selectedPolicyId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("linkPaymentToPolicy")}</DialogTitle>
        </DialogHeader>
        
        {paymentReference || paymentAmount || payerName ? (
          <div className="bg-muted/50 p-3 rounded-md mb-4">
            <h4 className="text-sm font-medium mb-2">{t("paymentDetails")}:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {paymentReference && (
                <div>
                  <span className="text-muted-foreground">{t("reference")}: </span>
                  <span className="font-medium">{paymentReference}</span>
                </div>
              )}
              {paymentAmount && (
                <div>
                  <span className="text-muted-foreground">{t("amount")}: </span>
                  <span className="font-medium">{formatCurrency(paymentAmount, "EUR")}</span>
                </div>
              )}
              {payerName && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">{t("payerName")}: </span>
                  <span className="font-medium">{payerName}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="policySearch">{t("searchPolicy")}</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="policySearch"
                placeholder={t("enterPolicyNumberOrPolicyholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t("clearSearch")}</span>
                </Button>
              )}
            </div>
          </div>
          
          {searchTerm.length >= 2 && (
            <div className="border rounded-md max-h-60 overflow-auto">
              {isSearching ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">{t("searching")}</p>
                </div>
              ) : policies.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {t("noPoliciesFound")}
                </div>
              ) : (
                <div className="divide-y">
                  {policies.map((policy) => (
                    <div 
                      key={policy.id}
                      className={`p-3 hover:bg-muted cursor-pointer ${
                        selectedPolicyId === policy.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handlePolicySelect(policy.id)}
                    >
                      <div className="font-medium">{policy.policy_number}</div>
                      <div className="text-sm">{policy.policyholder_name}</div>
                      <div className="text-xs text-muted-foreground">{policy.insurer_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedPolicy && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center text-blue-800">
                <Link className="h-4 w-4 mr-2" />
                {t("willLinkPaymentToPolicy")}:
              </div>
              <div className="text-sm font-medium mt-1">
                {selectedPolicy.policy_number} - {selectedPolicy.policyholder_name}
              </div>
            </div>
          )}
        </div>
        
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
              <>
                <Link className="mr-2 h-4 w-4" />
                {t("linkPayment")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LinkPaymentDialog;
