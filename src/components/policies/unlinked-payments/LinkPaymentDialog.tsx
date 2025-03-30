
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Loader2, Search } from "lucide-react";

export interface LinkPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (policyId: string) => void;
  isLoading: boolean;
}

const LinkPaymentDialog: React.FC<LinkPaymentDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  
  // Mock policy search results for now
  const mockPolicies = [
    { id: "p1", policy_number: "POL-2023-001", policyholder_name: "Acme Inc." },
    { id: "p2", policy_number: "POL-2023-002", policyholder_name: "XYZ Corporation" },
    { id: "p3", policy_number: "POL-2023-003", policyholder_name: "ABC Ltd." }
  ];
  
  const filteredPolicies = searchTerm 
    ? mockPolicies.filter(p => 
        p.policy_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.policyholder_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const handleConfirm = () => {
    if (selectedPolicyId) {
      onConfirm(selectedPolicyId);
    }
  };
  
  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicyId(policyId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("linkPaymentToPolicy")}</DialogTitle>
        </DialogHeader>
        
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
            </div>
          </div>
          
          {searchTerm && (
            <div className="border rounded-md max-h-40 overflow-auto">
              {filteredPolicies.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {t("noPoliciesFound")}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPolicies.map((policy) => (
                    <div 
                      key={policy.id}
                      className={`p-2 hover:bg-muted cursor-pointer ${
                        selectedPolicyId === policy.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handlePolicySelect(policy.id)}
                    >
                      <div className="font-medium">{policy.policy_number}</div>
                      <div className="text-sm text-muted-foreground">{policy.policyholder_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {selectedPolicyId && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center text-blue-800">
                <Link className="h-4 w-4 mr-2" />
                {t("willLinkPaymentToPolicy")}:
              </div>
              <div className="text-sm font-medium mt-1">
                {mockPolicies.find(p => p.id === selectedPolicyId)?.policy_number}
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
