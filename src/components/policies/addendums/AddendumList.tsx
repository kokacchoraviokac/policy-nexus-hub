import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Trash, 
  Loader2,
  AlertTriangle,
  FileArchive,
  Check,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { PolicyAddendum } from "@/types/policies";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import AddendumFormDialog from "./AddendumFormDialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AddendumListProps {
  searchTerm?: string;
  statusFilter?: string;
  addendums?: PolicyAddendum[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
  policyId?: string;
}

const AddendumList: React.FC<AddendumListProps> = ({ 
  searchTerm = "", 
  statusFilter = "all",
  addendums = [],
  isLoading = false,
  isError = false,
  onRefresh,
  policyId
}) => {
  const { t, formatDate, formatCurrency } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editAddendum, setEditAddendum] = useState<PolicyAddendum | null>(null);
  const [addendumToDelete, setAddendumToDelete] = useState<string | null>(null);
  
  const { data: policy } = useQuery({
    queryKey: ['policy-for-addendum-list', policyId],
    queryFn: async () => {
      if (!policyId) return null;
      
      const { data, error } = await supabase
        .from('policies')
        .select('policy_number')
        .eq('id', policyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!policyId,
  });
  
  const deleteAddendumMutation = useMutation({
    mutationFn: async (addendumId: string) => {
      const { error } = await supabase
        .from('policy_addendums')
        .delete()
        .eq('id', addendumId);
      
      if (error) throw error;
      return addendumId;
    },
    onSuccess: () => {
      toast({
        title: t("addendumDeleted"),
        description: t("addendumDeletedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ['policy-addendums'] });
      if (policyId) {
        queryClient.invalidateQueries({ queryKey: ['policy-addendums', policyId] });
      }
      if (onRefresh) onRefresh();
    },
    onError: (error) => {
      toast({
        title: t("deleteError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const updateWorkflowStatusMutation = useMutation({
    mutationFn: async ({ addendumId, status }: { addendumId: string; status: string }) => {
      const { error } = await supabase
        .from('policy_addendums')
        .update({ 
          workflow_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', addendumId);
      
      if (error) throw error;
      return { addendumId, status };
    },
    onSuccess: () => {
      toast({
        title: t("statusUpdated"),
        description: t("workflowStatusUpdatedSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ['policy-addendums'] });
      if (policyId) {
        queryClient.invalidateQueries({ queryKey: ['policy-addendums', policyId] });
      }
      if (onRefresh) onRefresh();
    },
    onError: (error) => {
      toast({
        title: t("updateError"),
        description: error instanceof Error ? error.message : t("unknownError"),
        variant: "destructive",
      });
    },
  });
  
  const filteredAddendums = addendums.filter(addendum => {
    const matchesSearch = !searchTerm || 
      addendum.addendum_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addendum.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || addendum.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleEditAddendum = (addendum: PolicyAddendum) => {
    setEditAddendum(addendum);
  };
  
  const handleDeleteAddendum = (addendumId: string) => {
    setAddendumToDelete(addendumId);
  };
  
  const confirmDeleteAddendum = () => {
    if (addendumToDelete) {
      deleteAddendumMutation.mutate(addendumToDelete);
      setAddendumToDelete(null);
    }
  };
  
  const handleViewAddendum = (addendumId: string, policyId: string) => {
    navigate(`/policies/${policyId}?tab=addenda&addendumId=${addendumId}`);
  };
  
  const handleAddendumFormClose = () => {
    setEditAddendum(null);
  };
  
  const handleAddendumFormSuccess = () => {
    setEditAddendum(null);
    if (onRefresh) onRefresh();
  };
  
  const handleAdvanceStatus = (addendum: PolicyAddendum) => {
    let newStatus = addendum.workflow_status;
    
    switch(addendum.workflow_status) {
      case 'draft':
        newStatus = 'in_review';
        break;
      case 'in_review':
        newStatus = 'ready';
        break;
      case 'ready':
        newStatus = 'complete';
        break;
      default:
        break;
    }
    
    if (newStatus !== addendum.workflow_status) {
      updateWorkflowStatusMutation.mutate({ 
        addendumId: addendum.id, 
        status: newStatus 
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-medium">{t("errorLoadingAddendums")}</p>
        <Button onClick={onRefresh}>{t("tryAgain")}</Button>
      </div>
    );
  }
  
  if (filteredAddendums.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <FileArchive className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">{t("noAddendumsFound")}</p>
        {policyId && (
          <Button 
            onClick={() => navigate(`/policies/addendums/new?policyId=${policyId}`)}
          >
            {t("createAddendum")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("addendumNumber")}</TableHead>
              <TableHead>{t("effectiveDate")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("premiumAdjustment")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("workflowStatus")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAddendums.map((addendum) => (
              <TableRow key={addendum.id}>
                <TableCell className="font-medium">{addendum.addendum_number}</TableCell>
                <TableCell>{formatDate(addendum.effective_date)}</TableCell>
                <TableCell className="max-w-xs truncate">{addendum.description}</TableCell>
                <TableCell>
                  {addendum.premium_adjustment ? 
                    formatCurrency(addendum.premium_adjustment, "EUR") : 
                    "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={addendum.status === "active" ? "default" : "secondary"}>
                    {t(addendum.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    addendum.workflow_status === "complete" ? "default" : 
                    addendum.workflow_status === "ready" ? "success" :
                    addendum.workflow_status === "in_review" ? "secondary" : "outline"
                  }>
                    {t(addendum.workflow_status.replace('_', ''))}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleViewAddendum(addendum.id, addendum.policy_id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {t("view")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditAddendum(addendum)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                      {addendum.workflow_status !== 'complete' && (
                        <DropdownMenuItem onClick={() => handleAdvanceStatus(addendum)}>
                          <Check className="h-4 w-4 mr-2" />
                          {addendum.workflow_status === 'draft' && t("moveToReview")}
                          {addendum.workflow_status === 'in_review' && t("markAsReady")}
                          {addendum.workflow_status === 'ready' && t("markAsComplete")}
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem 
                        onClick={() => handleDeleteAddendum(addendum.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {editAddendum && (
        <AddendumFormDialog
          policyId={editAddendum.policy_id}
          policyNumber={policy?.policy_number || ''}
          open={!!editAddendum}
          onClose={handleAddendumFormClose}
          onSuccess={handleAddendumFormSuccess}
          editAddendum={editAddendum}
        />
      )}
      
      <AlertDialog open={!!addendumToDelete} onOpenChange={() => setAddendumToDelete(null)}>
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
              onClick={confirmDeleteAddendum}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteAddendumMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash className="h-4 w-4 mr-2" />
              )}
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddendumList;
