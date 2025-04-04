
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, MinusIcon } from "lucide-react";

interface SalesPipelineStatsProps {
  isLoading?: boolean;
  error?: Error | null;
}

const SalesPipelineStats: React.FC<SalesPipelineStatsProps> = ({ 
  isLoading = false,
  error = null
}) => {
  const { t, formatCurrency } = useLanguage();
  
  // Mock data
  const stats = {
    totalDeals: 42,
    activeDeals: 28,
    potentialRevenue: 175000,
    avgDealSize: 6250,
    conversionRate: 35,
    change: {
      totalDeals: 8,
      activeDeals: 2,
      potentialRevenue: 25000,
      avgDealSize: 1200,
      conversionRate: 5
    }
  };
  
  const renderChangeIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="text-emerald-600 flex items-center">
          <ArrowUp className="h-4 w-4 mr-1" />
          +{value}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="text-red-600 flex items-center">
          <ArrowDown className="h-4 w-4 mr-1" />
          {value}%
        </span>
      );
    } else {
      return (
        <span className="text-muted-foreground flex items-center">
          <MinusIcon className="h-4 w-4 mr-1" />
          0%
        </span>
      );
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("pipelineOverview")}</CardTitle>
          <CardDescription>{t("pipelineStatsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("pipelineOverview")}</CardTitle>
          <CardDescription>{t("errorLoadingStats")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-destructive">
          {error.message}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pipelineOverview")}</CardTitle>
        <CardDescription>{t("pipelineStatsDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">{t("totalDeals")}</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stats.totalDeals}</span>
              <span className="text-sm">{renderChangeIndicator(stats.change.totalDeals)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">{t("activeDeals")}</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stats.activeDeals}</span>
              <span className="text-sm">{renderChangeIndicator(stats.change.activeDeals)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">{t("conversionRate")}</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{stats.conversionRate}%</span>
              <span className="text-sm">{renderChangeIndicator(stats.change.conversionRate)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">{t("potentialRevenue")}</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{formatCurrency(stats.potentialRevenue)}</span>
              <span className="text-sm">{renderChangeIndicator(stats.change.potentialRevenue / 1000)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">{t("avgDealSize")}</span>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">{formatCurrency(stats.avgDealSize)}</span>
              <span className="text-sm">{renderChangeIndicator(stats.change.avgDealSize / 100)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPipelineStats;
