
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { UnlinkedPayment } from "@/hooks/useUnlinkedPayments";
import { Policy } from "@/types/policies";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LinkPaymentDialogProps {
  payment: UnlinkedPayment | null;
  open: boolean;
  onClose: () => void;
  onLinkPayment: (paymentId: string, policyId: string) => void;
  isLinking: boolean;
}

const LinkPaymentDialog: React.FC<LinkPaymentDialogProps> = ({
  payment,
  open,
  onClose,
  onLinkPayment,
  isLinking,
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { data: policies, isLoading } = useQuery({
    queryKey: ["policies-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const { data, error } = await supabase
        .from("policies")
        .select("id, policy_number, policyholder_name, insurer_name, premium, currency")
        .or(
          `policy_number.ilike.%${searchTerm}%,policyholder_name.ilike.%${searchTerm}%,insurer_name.ilike.%${searchTerm}%`
        )
        .limit(10);

      if (error) throw error;
      return data as Policy[];
    },
    enabled: searchTerm.length >= 2,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
  };

  const handleConfirmLinkPayment = () => {
    if (payment && selectedPolicy) {
      onLinkPayment(payment.id, selectedPolicy.id);
      setConfirmDialogOpen(false);
      onClose();
    }
  };

  const handleLinkClick = () => {
    if (selectedPolicy) {
      setConfirmDialogOpen(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("linkPaymentToPolicy")}</DialogTitle>
            <DialogDescription>
              {t("selectPolicy")}
            </DialogDescription>
          </DialogHeader>

          {payment && (
            <div className="space-y-4">
              <div className="border p-3 rounded-md bg-muted/30 space-y-2">
                <h4 className="font-medium text-sm">{t("paymentDetails")}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">{t("reference")}</div>
                  <div>{payment.reference || "-"}</div>
                  <div className="text-muted-foreground">{t("payer")}</div>
                  <div>{payment.payer_name || "-"}</div>
                  <div className="text-muted-foreground">{t("amount")}</div>
                  <div>{formatCurrency(payment.amount, payment.currency)}</div>
                  <div className="text-muted-foreground">{t("paymentDate")}</div>
                  <div>{formatDate(payment.payment_date)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchPolicyPlaceholder")}
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="border rounded-md max-h-[200px] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : policies && policies.length > 0 ? (
                    <div className="divide-y">
                      {policies.map((policy) => (
                        <div
                          key={policy.id}
                          className={`p-3 cursor-pointer hover:bg-muted ${
                            selectedPolicy?.id === policy.id ? "bg-muted" : ""
                          }`}
                          onClick={() => handleSelectPolicy(policy)}
                        >
                          <div className="font-medium">
                            {policy.policy_number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {policy.policyholder_name} • {policy.insurer_name}
                          </div>
                          <div className="text-sm">
                            {formatCurrency(policy.premium, policy.currency)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchTerm.length >= 2 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {t("noResults")}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      {t("searchForPolicy")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleLinkClick}
              disabled={!selectedPolicy || isLinking}
            >
              {isLinking && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("linkToPolicy")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmLinkPayment")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmLinkPaymentDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {payment && selectedPolicy && (
            <div className="space-y-4 my-4">
              <div className="border p-3 rounded-md bg-muted/30 space-y-2">
                <h4 className="font-medium text-sm">{t("paymentDetails")}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">{t("amount")}</div>
                  <div>{formatCurrency(payment.amount, payment.currency)}</div>
                  <div className="text-muted-foreground">{t("paymentDate")}</div>
                  <div>{formatDate(payment.payment_date)}</div>
                </div>
              </div>
              
              <div className="border p-3 rounded-md bg-muted/30 space-y-2">
                <h4 className="font-medium text-sm">{t("policyDetails")}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">{t("policyNumber")}</div>
                  <div>{selectedPolicy.policy_number}</div>
                  <div className="text-muted-foreground">{t("client")}</div>
                  <div>{selectedPolicy.policyholder_name}</div>
                  <div className="text-muted-foreground">{t("premium")}</div>
                  <div>{formatCurrency(selectedPolicy.premium, selectedPolicy.currency)}</div>
                </div>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLinkPayment} disabled={isLinking}>
              {isLinking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("apply")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LinkPaymentDialog;
