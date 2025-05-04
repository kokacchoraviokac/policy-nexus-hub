
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, previousValue, icon }) => {
  let percentChange: number | null = null;
  let isIncrease = false;
  
  if (previousValue !== undefined && typeof previousValue === 'number' && typeof value === 'number') {
    if (previousValue !== 0) {
      percentChange = ((value - previousValue) / previousValue) * 100;
      isIncrease = percentChange > 0;
    }
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="h-8 w-8 rounded-md bg-primary/10 p-1.5 text-primary">{icon}</div>}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{value}</p>
          
          {percentChange !== null && (
            <div className={`mt-1 flex items-center text-xs ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
              {isIncrease ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
              <span>{Math.abs(percentChange).toFixed(1)}% {isIncrease ? 'increase' : 'decrease'}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface PolicySummaryMetricsProps {
  totalPolicies: number;
  totalPremium: number;
  totalCommission: number;
  avgCommissionRate: number;
  expiringPolicies: number;
  newPolicies: number;
  currency?: string;
  previousPeriod?: {
    totalPolicies?: number;
    totalPremium?: number;
    totalCommission?: number;
  };
}

const PolicySummaryMetrics: React.FC<PolicySummaryMetricsProps> = ({
  totalPolicies,
  totalPremium,
  totalCommission,
  avgCommissionRate,
  expiringPolicies,
  newPolicies,
  currency = "EUR",
  previousPeriod,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <MetricCard 
        title={t("totalPolicies")} 
        value={totalPolicies}
        previousValue={previousPeriod?.totalPolicies}
      />
      
      <MetricCard 
        title={t("newPolicies")} 
        value={newPolicies}
      />
      
      <MetricCard 
        title={t("expiringPolicies")} 
        value={expiringPolicies}
      />
      
      <MetricCard 
        title={t("totalPremium")} 
        value={formatCurrency(totalPremium, currency)}
        previousValue={previousPeriod?.totalPremium}
      />
      
      <MetricCard 
        title={t("totalCommission")} 
        value={formatCurrency(totalCommission, currency)}
        previousValue={previousPeriod?.totalCommission}
      />
      
      <MetricCard 
        title={t("avgCommissionRate")} 
        value={`${avgCommissionRate.toFixed(2)}%`}
      />
    </div>
  );
};

export default PolicySummaryMetrics;
