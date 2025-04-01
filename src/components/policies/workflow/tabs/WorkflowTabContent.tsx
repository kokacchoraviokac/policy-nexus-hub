
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import WorkflowPoliciesList from "@/components/policies/workflow/WorkflowPoliciesList";
import { WorkflowPolicy } from "@/utils/policies/policyMappers";

interface WorkflowTabContentProps {
  title: string;
  description: string;
  policies: WorkflowPolicy[];
  isLoading: boolean;
  isError: boolean;
  onReviewPolicy: (policyId: string) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  workflowStatus: string;
  onStatusChange: (status: string) => void;
}

const WorkflowTabContent: React.FC<WorkflowTabContentProps> = ({
  title,
  description,
  policies,
  isLoading,
  isError,
  onReviewPolicy,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  workflowStatus,
  onStatusChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="mt-6">
      <div className="mb-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {description}
          </AlertDescription>
        </Alert>
      </div>
      
      <WorkflowPoliciesList 
        policies={policies}
        isLoading={isLoading}
        isError={isError}
        onReviewPolicy={onReviewPolicy}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        workflowStatus={workflowStatus}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default WorkflowTabContent;
