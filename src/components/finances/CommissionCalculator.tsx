
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

const CommissionCalculator = () => {
  const { t, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const [baseAmount, setBaseAmount] = React.useState<number>(0);
  const [rate, setRate] = React.useState<number>(10);
  const [result, setResult] = React.useState<number | null>(null);

  const handleCalculate = () => {
    const calculatedAmount = (baseAmount * rate) / 100;
    setResult(calculatedAmount);
    
    toast({
      title: t("commissionCalculated"),
      description: t("commissionCalculationResult", {
        amount: formatCurrency(calculatedAmount, "EUR")
      }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t("commissionCalculator")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="baseAmount">{t("baseAmount")}</Label>
          <Input
            id="baseAmount"
            type="number"
            min="0"
            step="0.01"
            value={baseAmount || ""}
            onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">{t("commissionRate")}</Label>
          <div className="flex items-center gap-2">
            <Input
              id="rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={rate || ""}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="flex-1"
            />
            <span className="text-lg">%</span>
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full mt-4">
          {t("calculateCommission")}
        </Button>

        {result !== null && (
          <div className="p-4 border rounded-md mt-4">
            <div className="text-sm text-muted-foreground">
              {t("calculatedCommission")}
            </div>
            <div className="text-xl font-bold mt-1">
              {formatCurrency(result, "EUR")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionCalculator;
