
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialReportData } from "@/utils/reports/financialReportUtils";
import { ArrowDownIcon, ArrowUpIcon, CircleDollarSign, Receipt, CreditCard, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface FinancialReportSummaryProps {
  data: FinancialReportData;
}

const FinancialReportSummary: React.FC<FinancialReportSummaryProps> = ({ data }) => {
  const { t, language } = useLanguage();
  const { summary } = data;
  
  const cards = [
    {
      title: "totalIncome",
      value: summary.totalIncome,
      icon: ArrowUpIcon,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      currency: "EUR"
    },
    {
      title: "totalExpenses",
      value: summary.totalExpenses,
      icon: ArrowDownIcon,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      currency: "EUR"
    },
    {
      title: "netIncome",
      value: summary.netIncome,
      icon: ArrowRightLeft,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      currency: "EUR"
    },
    {
      title: "commissionEarned",
      value: summary.commissionEarned,
      icon: CircleDollarSign,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      currency: "EUR"
    },
    {
      title: "invoicesPaid",
      value: summary.invoicesPaid,
      icon: Receipt,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
      currency: "EUR"
    },
    {
      title: "outstandingInvoices",
      value: summary.outstandingInvoices,
      icon: CreditCard,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      currency: "EUR"
    }
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t("financialSummary")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {t(card.title)}
                </CardTitle>
                <div className={`rounded-full p-2 ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(card.value, language, card.currency)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialReportSummary;
