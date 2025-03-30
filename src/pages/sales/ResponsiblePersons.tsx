
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, Filter } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SearchInput from "@/components/ui/search-input";
import { toast } from "sonner";
import ResponsiblePersonDialog from "@/components/sales/responsible/ResponsiblePersonDialog";
import ResponsiblePersonsTable from "@/components/sales/responsible/ResponsiblePersonsTable";
import DeleteAssignmentDialog from "@/components/sales/responsible/DeleteAssignmentDialog";

const ResponsiblePersons = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  
  // Mock data state - in a real app, this would come from API
  const [hasAssignments, setHasAssignments] = useState(true);
  
  const handleEdit = (assignmentId: string) => {
    console.log("Edit assignment:", assignmentId);
    // In a real app, this would fetch the assignment details and open the dialog
    setSelectedAssignmentId(assignmentId);
    setShowAssignDialog(true);
  };
  
  const handleDelete = (assignmentId: string) => {
    console.log("Delete assignment:", assignmentId);
    setSelectedAssignmentId(assignmentId);
    setShowDeleteDialog(true);
  };
  
  const handleView = (assignmentId: string) => {
    console.log("View assignment:", assignmentId);
    // In a real app, this would navigate to a detail view
    toast.info(t("viewingAssignment", { id: assignmentId }));
  };
  
  const confirmDelete = () => {
    if (selectedAssignmentId) {
      console.log("Confirming delete for:", selectedAssignmentId);
      // In a real app, this would call an API to delete the assignment
      toast.success(t("assignmentDeleted"), {
        description: t("assignmentDeletedDescription"),
      });
      setShowDeleteDialog(false);
      setSelectedAssignmentId(null);
    }
  };
  
  const handleAssign = (data: any) => {
    console.log("New assignment:", data);
    // In a real app, this would refresh the assignments list
    setHasAssignments(true);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{t("responsiblePersons")}</h1>
        <Button onClick={() => setShowAssignDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("assignResponsibility")}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput
          placeholder={t("searchAssignments")}
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-72"
        />
        
        <Button variant="outline" size="icon" className="h-10 w-10 sm:w-10">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        {hasAssignments ? (
          <ResponsiblePersonsTable 
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ) : (
          <div className="p-6">
            <EmptyState
              title={t("noAssignmentsFound")}
              description={t("createYourFirstAssignment")}
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              action={
                <Button className="mt-4" onClick={() => setShowAssignDialog(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("assignResponsibility")}
                </Button>
              }
            />
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      <ResponsiblePersonDialog 
        open={showAssignDialog} 
        onOpenChange={setShowAssignDialog}
        onAssign={handleAssign}
      />
      
      <DeleteAssignmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        assignmentName="this assignment"
      />
    </div>
  );
};

export default ResponsiblePersons;
