
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const CHART_COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", 
  "#00C49F", "#FFBB28", "#FF8042", "#a4de6c", "#d0ed57"
];

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface PolicyDistributionChartProps {
  data: ChartData[];
  title: string;
}

export const PolicyDistributionChart: React.FC<PolicyDistributionChartProps> = ({ data, title }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value, t("policies")]} 
              labelFormatter={(name) => name}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface TimeSeriesData {
  name: string;
  policies: number;
  premium?: number;
  commission?: number;
}

interface PolicyTrendChartProps {
  data: TimeSeriesData[];
  title: string;
  showPremium?: boolean;
  showCommission?: boolean;
}

export const PolicyTrendChart: React.FC<PolicyTrendChartProps> = ({ 
  data, 
  title, 
  showPremium = false,
  showCommission = false
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" />
            {(showPremium || showCommission) && (
              <YAxis yAxisId="right" orientation="right" />
            )}
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="policies"
              name={t("policies")}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            {showPremium && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="premium"
                name={t("premium")}
                stroke="#82ca9d"
              />
            )}
            {showCommission && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="commission"
                name={t("commission")}
                stroke="#ffc658"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface PolicyBarChartProps {
  data: ChartData[];
  title: string;
}

export const PolicyBarChart: React.FC<PolicyBarChartProps> = ({ data, title }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name={t("policies")} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
