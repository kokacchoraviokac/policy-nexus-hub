
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogger } from "@/utils/activityLogger";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle, Clock, Hourglass } from "lucide-react";

interface PolicyStatusWorkflowProps {
  policyId: string;
  currentStatus: string;
  currentWorkflowStatus: string;
  onStatusUpdated: () => void;
}

const PolicyStatusWorkflow: React.FC<PolicyStatusWorkflowProps> = ({
  policyId,
  currentStatus,
  currentWorkflowStatus,
  onStatusUpdated,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogger();
  
  const [isOpen, setIsOpen] = useState(false);
  const [statusType, setStatusType] = useState<"status" | "workflow">("status");
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [newWorkflowStatus, setNewWorkflowStatus] = useState(currentWorkflowStatus);
  const [statusNote, setStatusNote] = useState("");
  
  const statusOptions = [
    { value: "active", label: t("active"), icon: CheckCircle, color: "text-green-500" },
    { value: "pending", label: t("pending"), icon: Clock, color: "text-yellow-500" },
    { value: "expired", label: t("expired"), icon: XCircle, color: "text-red-500" },
    { value: "cancelled", label: t("cancelled"), icon: XCircle, color: "text-gray-500" },
  ];
  
  const workflowStatusOptions = [
    { value: "draft", label: t("draft"), icon: Hourglass, color: "text-blue-500" },
    { value: "in_review", label: t("inReview"), icon: AlertCircle, color: "text-orange-500" },
    { value: "ready", label: t("ready"), icon: CheckCircle, color: "text-green-500" },
    { value: "complete", label: t("complete"), icon: CheckCircle, color: "text-green-500" },
  ];
  
  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      
      if (statusType === "status") {
        updateData.status = newStatus;
      } else {
        updateData.workflow_status = newWorkflowStatus;
      }
      
      const { data, error } = await supabase
        .from("policies")
        .update(updateData)
        .eq("id", policyId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['policy', policyId] });
      
      // Log the activity
      logActivity({
        entityType: "policy",
        entityId: policyId,
        action: "update",
        details: {
          changes: statusType === "status" 
            ? { status: { old: currentStatus, new: newStatus } }
            : { workflow_status: { old: currentWorkflowStatus, new: newWorkflowStatus } },
          note: statusNote
        }
      });
      
      toast({
        title: t("statusUpdated"),
        description: statusType === "status" 
          ? t("policyStatusHasBeenUpdated") 
          : t("workflowStatusHasBeenUpdated"),
      });
      
      setIsOpen(false);
      onStatusUpdated();
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        title: t("errorUpdatingStatus"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    updateStatusMutation.mutate();
  };
  
  const getStatusIcon = (status: string, type: "status" | "workflow") => {
    const options = type === "status" ? statusOptions : workflowStatusOptions;
    const option = options.find(opt => opt.value === status);
    
    if (!option) return null;
    
    const Icon = option.icon;
    return <Icon className={`h-5 w-5 ${option.color}`} />;
  };
  
  const getStatusLabel = (status: string, type: "status" | "workflow") => {
    const options = type === "status" ? statusOptions : workflowStatusOptions;
    const option = options.find(opt => opt.value === status);
    return option ? option.label : status;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">{t("policyStatus")}</h4>
          <div className="flex items-center space-x-2">
            {getStatusIcon(currentStatus, "status")}
            <span className="font-medium">{getStatusLabel(currentStatus, "status")}</span>
          </div>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setStatusType("status");
                setNewStatus(currentStatus);
              }}
            >
              {t("changeStatus")}
            </Button>
          </DialogTrigger>
        </div>
        
        <div className="flex flex-col space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">{t("workflowStatus")}</h4>
          <div className="flex items-center space-x-2">
            {getStatusIcon(currentWorkflowStatus, "workflow")}
            <span className="font-medium">{getStatusLabel(currentWorkflowStatus, "workflow")}</span>
          </div>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setStatusType("workflow");
                setNewWorkflowStatus(currentWorkflowStatus);
              }}
            >
              {t("changeWorkflowStatus")}
            </Button>
          </DialogTrigger>
        </div>
      </div>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {statusType === "status" ? t("updatePolicyStatus") : t("updateWorkflowStatus")}
          </DialogTitle>
          <DialogDescription>
            {statusType === "status" 
              ? t("selectNewPolicyStatusAndProvideReason") 
              : t("selectNewWorkflowStatusAndProvideReason")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">{t("newStatus")}</Label>
            {statusType === "status" ? (
              <Select 
                value={newStatus} 
                onValueChange={setNewStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={t("selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <option.icon className={`mr-2 h-4 w-4 ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select 
                value={newWorkflowStatus} 
                onValueChange={setNewWorkflowStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={t("selectWorkflowStatus")} />
                </SelectTrigger>
                <SelectContent>
                  {workflowStatusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <option.icon className={`mr-2 h-4 w-4 ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="note">{t("reasonForChange")}</Label>
            <Textarea
              id="note"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder={t("enterReasonForChange")}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            {t("cancel")}
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? t("updating") : t("updateStatus")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyStatusWorkflow;
