import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, FileText, Download, Edit, Trash2, FileEdit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PolicyAddendum } from "@/types/policies";
import AddendumFormDialog from "./AddendumFormDialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddendumListProps {
  addendums: PolicyAddendum[];
  policyNumber: string;
  onRefresh: () => void;
}

const AddendumList: React.FC<AddendumListProps> = ({ addendums, policyNumber, onRefresh }) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editAddendum, setEditAddendum] = useState<PolicyAddendum | null>(null);
  const [deleteAddendumId, setDeleteAddendumId] = useState<string | null>(null);
  
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'active':
        return "default";
      case 'pending':
      case 'in_progress':
        return "secondary";
      case 'rejected':
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const getWorkflowStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return "outline";
      case 'in_review':
        return "secondary";
      case 'ready':
        return "default";
      case 'complete':
        return "default";
      default:
        return "outline";
    }
  };
  
  const getWorkflowStatusLabel = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return t("draft");
      case 'in_review':
        return t("inReview");
      case 'ready':
        return t("ready");
      case 'complete':
        return t("complete");
      default:
        return status;
    }
  };
  
  const handleViewAddendum = (id: string) => {
    console.log("View addendum:", id);
  };
  
  const handleEditAddendum = (addendum: PolicyAddendum) => {
    setEditAddendum(addendum);
  };
  
  const handleCloseEditDialog = () => {
    setEditAddendum(null);
  };
  
  const handleDeleteAddendum = (id: string) => {
    setDeleteAddendumId(id);
  };
  
  const deleteAddendumMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("policy_addendums")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['policy-addendums'] });
      toast({
        title: t("addendumDeleted"),
        description: t("addendumDeletedSuccess"),
      });
      onRefresh();
    },
    onError: (error) => {
      console.error("Error deleting addendum:", error);
      toast({
        title: t("deleteError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const updateWorkflowStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("policy_addendums")
        .update({ workflow_status: status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policy-addendums'] });
      toast({
        title: t("statusUpdated"),
        description: t("workflowStatusUpdatedSuccess"),
      });
      onRefresh();
    },
    onError: (error) => {
      console.error("Error updating workflow status:", error);
      toast({
        title: t("updateError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const confirmDelete = () => {
    if (deleteAddendumId) {
      deleteAddendumMutation.mutate(deleteAddendumId);
      setDeleteAddendumId(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteAddendumId(null);
  };
  
  const handleProgressWorkflow = (id: string, currentStatus: string) => {
    let newStatus = "draft";
    
    switch (currentStatus) {
      case "draft":
        newStatus = "in_review";
        break;
      case "in_review":
        newStatus = "ready";
        break;
      case "ready":
        newStatus = "complete";
        break;
      case "complete":
        return;
    }
    
    updateWorkflowStatusMutation.mutate({ id, status: newStatus });
  };
  
  const getNextStatusLabel = (currentStatus: string): string => {
    switch (currentStatus) {
      case "draft":
        return t("moveToReview");
      case "in_review":
        return t("markAsReady");
      case "ready":
        return t("markAsComplete");
      default:
        return t("advanceStatus");
    }
  };
  
  const canProgress = (status: string): boolean => {
    return status !== "complete";
  };
  
  return (
    <div className="space-y-4">
      {addendums.map((addendum) => (
        <Card key={addendum.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="p-4 md:p-6 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold">
                        {t("addendumNumber")}: {addendum.addendum_number}
                      </h3>
                    </div>
                    
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <Badge variant={getStatusVariant(addendum.status)}>
                          {addendum.status}
                        </Badge>
                        <Badge variant={getWorkflowStatusVariant(addendum.workflow_status)}>
                          {getWorkflowStatusLabel(addendum.workflow_status)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {t("effective")}: {formatDate(addendum.effective_date)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                        {addendum.description}
                      </p>
                    </div>
                  </div>
                  
                  {addendum.premium_adjustment && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {addendum.premium_adjustment > 0 ? "+" : ""}
                        {formatCurrency(addendum.premium_adjustment)}
                      </div>
                      <div className="text-xs text-muted-foreground">{t("premiumAdjustment")}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-border flex items-center md:self-stretch">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-none flex-1 md:h-full"
                        onClick={() => handleViewAddendum(addendum.id)}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("viewDetails")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {canProgress(addendum.workflow_status) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-none flex-1 md:h-full"
                          onClick={() => handleProgressWorkflow(addendum.id, addendum.workflow_status)}
                          disabled={updateWorkflowStatusMutation.isPending}
                        >
                          <FileEdit className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getNextStatusLabel(addendum.workflow_status)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-none flex-1 md:h-full"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleViewAddendum(addendum.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("viewDetails")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditAddendum(addendum)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteAddendum(addendum.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {editAddendum && (
        <AddendumFormDialog
          policyId={editAddendum.policy_id}
          policyNumber={policyNumber}
          open={!!editAddendum}
          onClose={handleCloseEditDialog}
          onSuccess={onRefresh}
          editAddendum={editAddendum}
        />
      )}
      
      <AlertDialog open={!!deleteAddendumId} onOpenChange={cancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAddendumConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddendumList;
