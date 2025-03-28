
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PolicyFinancialCardProps {
  premium: number;
  currency: string;
  startDate: string;
  expiryDate: string;
  paymentFrequency: string;
}

const PolicyFinancialCard: React.FC<PolicyFinancialCardProps> = ({
  premium,
  currency,
  startDate,
  expiryDate,
  paymentFrequency,
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <CircleDollarSign className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("financialDetails")}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("premium")}</span>
            <div className="text-right">
              <span className="font-medium">{formatCurrency(premium, currency)}</span>
              <div className="text-xs text-muted-foreground">{t("paymentFrequency")}: {paymentFrequency}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("startDate")}</span>
              <span className="text-sm">{formatDate(startDate)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("expiryDate")}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{formatDate(expiryDate)}</span>
                {new Date(expiryDate) < new Date() && (
                  <Badge variant="destructive">{t("expired")}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyFinancialCard;
