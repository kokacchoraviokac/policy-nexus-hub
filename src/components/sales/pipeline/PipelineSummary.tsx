
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Grid } from "@/components/ui/grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, DollarSign, ArrowUpRight, BarChart2 } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs flex items-center mt-1">
          <span className={trend.positive ? "text-green-500" : "text-red-500"}>
            <ArrowUpRight className={`h-4 w-4 inline ${!trend.positive ? "rotate-90" : ""}`} />
            {trend.value}%
          </span>{" "}
          <span className="text-muted-foreground ml-1">from last period</span>
        </p>
      )}
    </CardContent>
  </Card>
);

const PipelineSummary = () => {
  const { t } = useLanguage();

  // Mock data - in a real app, this would come from API
  const summaryData = [
    {
      title: t("activeLeads"),
      value: 36,
      icon: <UserPlus className="h-4 w-4 text-blue-500" />,
      trend: { value: 12, positive: true },
    },
    {
      title: t("conversionRate"),
      value: "24%",
      icon: <BarChart2 className="h-4 w-4 text-purple-500" />,
      trend: { value: 5, positive: true },
    },
    {
      title: t("potentialRevenue"),
      value: "€154,200",
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
      trend: { value: 3, positive: false },
    },
  ];

  return (
    <Grid className="grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {summaryData.map((item, index) => (
        <SummaryCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          trend={item.trend}
        />
      ))}
    </Grid>
  );
};

export default PipelineSummary;
