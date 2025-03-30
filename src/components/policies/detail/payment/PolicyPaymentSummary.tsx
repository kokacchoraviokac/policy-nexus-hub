
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface PolicyPaymentSummaryProps {
  premium: number;
  currency: string;
  totalPaid: number;
}

const PolicyPaymentSummary: React.FC<PolicyPaymentSummaryProps> = ({ 
  premium, 
  currency, 
  totalPaid 
}) => {
  const { t, formatCurrency } = useLanguage();
  
  const paymentPercentage = premium > 0 ? Math.min(100, (totalPaid / premium) * 100) : 0;
  const remainingAmount = Math.max(0, premium - totalPaid);
  const isFullyPaid = totalPaid >= premium;
  const isOverpaid = totalPaid > premium;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("paymentSummary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-md bg-muted/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("totalPremium")}</p>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(premium, currency)}
                </p>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-muted/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("totalPaid")}</p>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(totalPaid, currency)}
                </p>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={isFullyPaid ? (isOverpaid ? "destructive" : "default") : "outline"} className="ml-2">
                      {isOverpaid ? t("overpaid") : isFullyPaid ? t("fullyPaid") : t("partiallyPaid")}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isOverpaid 
                      ? t("policyIsOverpaidBy", { amount: formatCurrency(totalPaid - premium, currency) }) 
                      : isFullyPaid 
                        ? t("policyIsFullyPaid") 
                        : t("policyIsPartiallyPaid", { percent: Math.round(paymentPercentage) })}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="p-4 border rounded-md bg-muted/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t("remainingAmount")}</p>
                <p className="text-xl font-semibold mt-1">
                  {formatCurrency(remainingAmount, currency)}
                </p>
              </div>
              {isOverpaid && (
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">{t("paymentProgress")}</p>
            <p className="text-sm">{Math.round(paymentPercentage)}%</p>
          </div>
          <Progress value={paymentPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyPaymentSummary;
