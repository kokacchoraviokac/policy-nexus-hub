
import React from "react";
import { FileText, TrendingUp, ClipboardCheck, DollarSign, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ListCard from "@/components/dashboard/ListCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Mock data for the dashboard
  const upcomingPolicies = [
    { 
      id: "1", 
      primary: "Auto Insurance - John Doe", 
      secondary: "Policy #A123456", 
      tertiary: "Jul 15", 
      status: "warning" as const,
      tooltipContent: "This policy is approaching expiry and requires review within the next 10 days." 
    },
    { 
      id: "2", 
      primary: "Home Insurance - Jane Smith", 
      secondary: "Policy #H789012", 
      tertiary: "Jul 18", 
      status: "warning" as const,
      tooltipContent: "Premium payment due in 5 days. Customer has been notified via email." 
    },
    { 
      id: "3", 
      primary: "Life Insurance - Mike Johnson", 
      secondary: "Policy #L345678", 
      tertiary: "Jul 22", 
      status: "info" as const,
      tooltipContent: "Standard renewal notice should be sent 14 days before expiry." 
    },
  ];
  
  const incompletePolicies = [
    { 
      id: "4", 
      primary: "Travel Insurance - Sarah Williams", 
      secondary: "Missing commission details", 
      tertiary: "3 days", 
      status: "error" as const,
      tooltipContent: "Commission structure needs to be assigned. Policy is held until completion." 
    },
    { 
      id: "5", 
      primary: "Business Insurance - Tech Solutions", 
      secondary: "Missing documentation", 
      tertiary: "1 day", 
      status: "error" as const,
      tooltipContent: "Required certificates not yet uploaded. Flagged as high priority." 
    },
  ];
  
  const openClaims = [
    { 
      id: "6", 
      primary: "Car Accident - Robert Brown", 
      secondary: "Claim #C987654", 
      tertiary: "$12,500", 
      status: "warning" as const,
      tooltipContent: "Waiting for repair shop estimate. Customer expecting update by end of week." 
    },
    { 
      id: "7", 
      primary: "Property Damage - Lisa Garcia", 
      secondary: "Claim #C654321", 
      tertiary: "$8,200", 
      status: "error" as const,
      tooltipContent: "Delayed processing due to missing documentation. Follow-up required." 
    },
    { 
      id: "8", 
      primary: "Medical Claim - David Wilson", 
      secondary: "Claim #C234567", 
      tertiary: "$5,750", 
      status: "success" as const,
      tooltipContent: "Pre-approved. Awaiting final documentation before payout." 
    },
  ];

  const handleCardClick = (destination: string, title: string) => {
    toast.info(`Navigating to ${title}`, {
      description: `Loading ${title.toLowerCase()} details...`,
    });
    navigate(destination);
  };

  const handlePolicyClick = (id: string) => {
    toast.info(`Opening policy details`, {
      description: `Loading details for policy #${id}...`,
    });
    // In a real app, this would navigate to the specific policy
    navigate(`/policies?id=${id}`);
  };

  const handleClaimClick = (id: string) => {
    toast.info(`Opening claim details`, {
      description: `Loading details for claim #${id}...`,
    });
    // In a real app, this would navigate to the specific claim
    navigate(`/claims?id=${id}`);
  };

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
          tooltipContent="Total active policies across all clients. Increased by 12% from last month."
          onClick={() => handleCardClick("/policies", "Policies")}
        />
        <StatCard 
          title={t("salesPipeline")} 
          value="$1.2M" 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          trend={{ value: 8, positive: true }}
          tooltipContent="Projected value of all active sales opportunities in the pipeline."
          onClick={() => handleCardClick("/sales/pipeline-overview", "Sales Pipeline")}
        />
        <StatCard 
          title={t("openClaims")} 
          value="24" 
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />} 
          trend={{ value: 3, positive: false }}
          tooltipContent="Total unresolved claims. Increased by 3% from last month, requiring attention."
          onClick={() => handleCardClick("/claims", "Claims")}
        />
        <StatCard 
          title={t("monthlyRevenue")} 
          value="$45,821" 
          icon={<DollarSign className="h-5 w-5 text-primary" />} 
          trend={{ value: 5, positive: true }}
          tooltipContent="Total revenue for the current month, including commissions and fees."
          onClick={() => handleCardClick("/finances", "Finances")}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ListCard 
          title={t("upcomingPolicies")} 
          items={upcomingPolicies} 
          icon={<Calendar className="h-5 w-5" />}
          onItemClick={handlePolicyClick}
          actionLabel={t("viewAll")}
          onAction={() => handleCardClick("/policies", "All Policies")}
        />
        
        <ListCard 
          title={t("incompletePolicies")} 
          items={incompletePolicies} 
          icon={<AlertTriangle className="h-5 w-5" />}
          onItemClick={handlePolicyClick}
          actionLabel={t("processAll")}
          onAction={() => handleCardClick("/policies/workflow", "Policy Workflow")}
        />
        
        <ListCard 
          title={t("openClaims")} 
          items={openClaims} 
          icon={<ClipboardCheck className="h-5 w-5" />}
          onItemClick={handleClaimClick}
          actionLabel={t("viewAll")}
          onAction={() => handleCardClick("/claims", "All Claims")}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
          <CardHeader>
            <CardTitle>{t("salesPipelineOverview")}</CardTitle>
            <CardDescription>{t("currentLeadsByStage")}</CardDescription>
          </CardHeader>
          <CardContent 
            className="h-[200px] flex items-center justify-center cursor-pointer"
            onClick={() => handleCardClick("/sales/pipeline-overview", "Sales Pipeline")}
          >
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
        
        <Card className="border shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20">
          <CardHeader>
            <CardTitle>{t("readyToInputPolicies")}</CardTitle>
            <CardDescription>{t("policiesWithCompleteData")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md transition-all duration-200 hover:bg-secondary/50 cursor-pointer" 
                onClick={() => handlePolicyClick("H567890")}
              >
                <div>
                  <p className="font-medium">Health Insurance - Mark Davis</p>
                  <p className="text-xs text-muted-foreground">Policy #H567890</p>
                </div>
                <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md transition-colors">
                  {t("finalize")}
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md transition-all duration-200 hover:bg-secondary/50 cursor-pointer"
                onClick={() => handlePolicyClick("P123456")}
              >
                <div>
                  <p className="font-medium">Pet Insurance - Emily Parker</p>
                  <p className="text-xs text-muted-foreground">Policy #P123456</p>
                </div>
                <button className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md transition-colors">
                  {t("finalize")}
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                <button 
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  onClick={() => handleCardClick("/policies/workflow", "Policy Workflow")}
                >
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
