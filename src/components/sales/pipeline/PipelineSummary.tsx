
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  Percent, 
  DollarSign, 
  PieChart as PieChartIcon, 
  BarChart2 
} from "lucide-react";

// Mock data for the charts
const conversionData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 60 },
  { name: "Aug", value: 70 },
  { name: "Sep", value: 65 },
];

const stageData = [
  { name: t => t("leadProspect"), value: 18, color: "#38bdf8" },
  { name: t => t("quoteManagement"), value: 12, color: "#a78bfa" },
  { name: t => t("insurerQuotes"), value: 7, color: "#fb923c" },
  { name: t => t("clientSelection"), value: 5, color: "#4ade80" },
];

const insuranceTypeData = [
  { name: t => t("life"), value: 15, color: "#f472b6" },
  { name: t => t("nonLife"), value: 20, color: "#60a5fa" },
  { name: t => t("health"), value: 10, color: "#4ade80" },
  { name: t => t("property"), value: 8, color: "#facc15" },
  { name: t => t("auto"), value: 12, color: "#fb923c" },
];

const PipelineSummary: React.FC = () => {
  const { t } = useLanguage();
  
  // Custom tooltip formatter for the charts
  const formatTooltipValue = (value: number) => [value, "Leads"];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border shadow-sm col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              {t("conversionTrend")}
            </div>
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            {t("last9Months")}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={conversionData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  contentStyle={{ 
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorValue)" 
                />
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">
            <div className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2 text-primary" />
              {t("leadsByStage")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  nameKey={(entry) => entry.name(t)}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Tooltip 
                  formatter={(value) => [value, t("leads")]}
                  contentStyle={{ 
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    fontSize: "12px"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm col-span-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-primary" />
              {t("insuranceTypes")}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insuranceTypeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey={(entry) => entry.name(t)} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [value, t("leads")]}
                  contentStyle={{ 
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="value">
                  {insuranceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm col-span-1 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{t("salesStats")}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("totalLeads")}</span>
            </div>
            <div className="text-2xl font-bold">42</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("conversionRate")}</span>
            </div>
            <div className="text-2xl font-bold">24%</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("activeSales")}</span>
            </div>
            <div className="text-2xl font-bold">15</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("potentialValue")}</span>
            </div>
            <div className="text-2xl font-bold">€248K</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineSummary;
