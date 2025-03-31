
import React from "react";
import { FileText, TrendingUp, ClipboardCheck, DollarSign, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ListCard from "@/components/dashboard/ListCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();
  
  // Mock data for the dashboard
  const upcomingPolicies = [
    { id: "1", primary: "Auto Insurance - John Doe", secondary: "Policy #A123456", tertiary: "Jul 15", status: "warning" as const },
    { id: "2", primary: "Home Insurance - Jane Smith", secondary: "Policy #H789012", tertiary: "Jul 18", status: "warning" as const },
    { id: "3", primary: "Life Insurance - Mike Johnson", secondary: "Policy #L345678", tertiary: "Jul 22", status: "info" as const },
  ];
  
  const incompletePolicies = [
    { id: "4", primary: "Travel Insurance - Sarah Williams", secondary: "Missing commission details", tertiary: "3 days", status: "error" as const },
    { id: "5", primary: "Business Insurance - Tech Solutions", secondary: "Missing documentation", tertiary: "1 day", status: "error" as const },
  ];
  
  const openClaims = [
    { id: "6", primary: "Car Accident - Robert Brown", secondary: "Claim #C987654", tertiary: "$12,500", status: "warning" as const },
    { id: "7", primary: "Property Damage - Lisa Garcia", secondary: "Claim #C654321", tertiary: "$8,200", status: "error" as const },
    { id: "8", primary: "Medical Claim - David Wilson", secondary: "Claim #C234567", tertiary: "$5,750", status: "success" as const },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("todayOverview")}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t("totalPolicies")} 
          value="248" 
          icon={<FileText className="h-5 w-5 text-primary" />} 
          trend={{ value: 12, positive: true }} 
        />
        <StatCard 
          title={t("salesPipeline")} 
          value="$1.2M" 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          trend={{ value: 8, positive: true }}
        />
        <StatCard 
          title={t("openClaims")} 
          value="24" 
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />} 
          trend={{ value: 3, positive: false }}
        />
        <StatCard 
          title={t("monthlyRevenue")} 
          value="$45,821" 
          icon={<DollarSign className="h-5 w-5 text-primary" />} 
          trend={{ value: 5, positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ListCard 
          title={t("upcomingPolicies")} 
          items={upcomingPolicies} 
          icon={<Calendar className="h-5 w-5" />}
          onItemClick={(id) => console.log("Clicked policy", id)}
          actionLabel={t("viewAll")}
          onAction={() => console.log("View all upcoming policies")}
        />
        
        <ListCard 
          title={t("incompletePolicies")} 
          items={incompletePolicies} 
          icon={<AlertTriangle className="h-5 w-5" />}
          onItemClick={(id) => console.log("Clicked incomplete policy", id)}
          actionLabel={t("processAll")}
          onAction={() => console.log("Process all incomplete policies")}
        />
        
        <ListCard 
          title={t("openClaims")} 
          items={openClaims} 
          icon={<ClipboardCheck className="h-5 w-5" />}
          onItemClick={(id) => console.log("Clicked claim", id)}
          actionLabel={t("viewAll")}
          onAction={() => console.log("View all open claims")}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>{t("salesPipelineOverview")}</CardTitle>
            <CardDescription>{t("currentLeadsByStage")}</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <div className="relative w-full h-full bg-secondary/30 rounded-md overflow-hidden">
              <div className="absolute bottom-0 left-0 w-1/4 h-[70%] bg-primary/20 rounded-t-md"></div>
              <div className="absolute bottom-0 left-1/4 w-1/4 h-[50%] bg-primary/30 rounded-t-md"></div>
              <div className="absolute bottom-0 left-2/4 w-1/4 h-[35%] bg-primary/40 rounded-t-md"></div>
              <div className="absolute bottom-0 left-3/4 w-1/4 h-[20%] bg-primary/50 rounded-t-md"></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                {t("currentLeadsByStage")}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>{t("readyToInputPolicies")}</CardTitle>
            <CardDescription>{t("policiesWithCompleteData")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                <div>
                  <p className="font-medium">Health Insurance - Mark Davis</p>
                  <p className="text-xs text-muted-foreground">Policy #H567890</p>
                </div>
                <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md transition-colors">
                  {t("finalize")}
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                <div>
                  <p className="font-medium">Pet Insurance - Emily Parker</p>
                  <p className="text-xs text-muted-foreground">Policy #P123456</p>
                </div>
                <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md transition-colors">
                  {t("finalize")}
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  {t("viewAllReadyPolicies")}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
