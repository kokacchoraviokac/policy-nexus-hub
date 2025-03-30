
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Loader2 } from "lucide-react";
import { Policy } from "@/types/policies";

interface CalculateCommissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: Policy;
  onCalculate: (data: any) => void;
  isCalculating: boolean;
}

const CalculateCommissionDialog: React.FC<CalculateCommissionDialogProps> = ({
  open,
  onOpenChange,
  policy,
  onCalculate,
  isCalculating
}) => {
  const { t, formatCurrency } = useLanguage();
  const [baseAmount, setBaseAmount] = useState(policy.premium || 0);
  const [rate, setRate] = useState(policy.commission_percentage || 0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [baseAmountError, setBaseAmountError] = useState("");
  const [rateError, setRateError] = useState("");

  // Calculate commission amount when inputs change
  useEffect(() => {
    if (baseAmount > 0 && rate >= 0) {
      setCalculatedAmount(baseAmount * (rate / 100));
    } else {
      setCalculatedAmount(0);
    }
  }, [baseAmount, rate]);

  const handleBaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBaseAmount(value);
    
    if (isNaN(value) || value <= 0) {
      setBaseAmountError(t("amountMustBePositive"));
    } else {
      setBaseAmountError("");
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setRate(value);
    
    if (isNaN(value) || value < 0) {
      setRateError(t("rateMustBeNonNegative"));
    } else if (value > 100) {
      setRateError(t("rateCannotExceed100"));
    } else {
      setRateError("");
    }
  };

  const handleCalculate = () => {
    // Validate inputs
    if (baseAmount <= 0) {
      setBaseAmountError(t("amountMustBePositive"));
      return;
    }
    
    if (rate < 0) {
      setRateError(t("rateMustBeNonNegative"));
      return;
    }
    
    if (rate > 100) {
      setRateError(t("rateCannotExceed100"));
      return;
    }
    
    // Submit calculation
    onCalculate({
      policy,
      baseAmount,
      rate,
      calculatedAmount
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("calculateCommissionForPolicy", { policyNumber: policy.policy_number })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="baseAmount">{t("baseAmount")}</Label>
            <Input
              id="baseAmount"
              type="number"
              value={baseAmount}
              onChange={handleBaseAmountChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            {baseAmountError && (
              <p className="text-sm text-destructive">{baseAmountError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rate">{t("commissionRate")} (%)</Label>
            <Input
              id="rate"
              type="number"
              value={rate}
              onChange={handleRateChange}
              placeholder="0.00"
              min="0"
              max="100"
              step="0.01"
              required
            />
            {rateError && (
              <p className="text-sm text-destructive">{rateError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>{t("calculatedCommission")}</Label>
            <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
              <span className="font-medium">
                {formatCurrency(calculatedAmount, policy.currency)}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCalculate}
            disabled={isCalculating || !!baseAmountError || !!rateError}
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("calculating")}
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                {t("calculateAndSave")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateCommissionDialog;
