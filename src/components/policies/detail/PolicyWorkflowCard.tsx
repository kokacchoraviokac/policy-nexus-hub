
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PolicyStatusWorkflow from "@/components/policies/workflow/PolicyStatusWorkflow";
import { Policy } from "@/types/policies";

interface PolicyWorkflowCardProps {
  policy: {
    id: string;
    status: string;
    workflow_status: string;
    updated_at: string;
  };
}

const PolicyWorkflowCard: React.FC<PolicyWorkflowCardProps> = ({ policy }) => {
  const { t, formatDate } = useLanguage();
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'active':
        return "default";
      case 'pending':
        return "secondary";
      case 'expired':
      case 'cancelled':
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const getWorkflowStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'complete':
        return "default";
      case 'in_review':
      case 'ready':
        return "secondary";
      case 'draft':
        return "outline";
      default:
        return "outline";
    }
  };

  // Create a Policy object from the limited data we have
  const policyData: Policy = {
    id: policy.id,
    policy_number: "", // We don't have this data, but it's required by the Policy type
    policy_type: "",
    policyholder_name: "",
    insurer_name: "",
    start_date: "",
    expiry_date: "",
    premium: 0,
    currency: "",
    status: policy.status,
    workflow_status: policy.workflow_status,
    created_at: "",
    updated_at: policy.updated_at,
    company_id: ""
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start mb-4">
          <ClipboardList className="h-5 w-5 text-muted-foreground mr-2" />
          <h3 className="font-semibold">{t("workflowManagement")}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">{t("policyStatus")}</span>
              <Badge variant={getStatusVariant(policy.status)}>
                {policy.status}
              </Badge>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm text-muted-foreground">{t("workflowStatus")}</span>
              <Badge variant={getWorkflowStatusVariant(policy.workflow_status)}>
                {policy.workflow_status}
              </Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {t("lastUpdated")}: {formatDate(policy.updated_at)} 
            ({formatDistanceToNow(new Date(policy.updated_at), { addSuffix: true })})
          </div>
          
          {/* Pass the full Policy object instead of just the ID */}
          <PolicyStatusWorkflow 
            policy={policyData}
            onStatusUpdated={() => {}}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyWorkflowCard;
