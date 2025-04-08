
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, PlusCircle, Settings2 } from "lucide-react";
import { useInsurers } from "@/hooks/useInsurers";
import getInsurerColumns from "@/components/codebook/insurers/InsurersColumns";
import AddInsurerDialog from "@/components/codebook/dialogs/AddInsurerDialog";
import EditInsurerDialog from "@/components/codebook/dialogs/EditInsurerDialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const InsurersDirectory = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInsurerId, setSelectedInsurerId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const { 
    insurers, 
    isLoading, 
    totalItems,
    totalPages,
    error, 
    deleteInsurer, 
    refreshInsurers,
    createInsurer,
    updateInsurer
  } = useInsurers({
    page: currentPage,
    pageSize,
    search,
    status: status !== "all" ? status : undefined
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    refreshInsurers();
  };
  
  const handleEdit = (id: string) => {
    setSelectedInsurerId(id);
    setEditDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setSelectedInsurerId(id);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedInsurerId) {
      try {
        await deleteInsurer(selectedInsurerId);
        toast({
          title: t("insurerDeleted"),
          description: t("insurerDeletedSuccessfully"),
        });
      } catch (error) {
        toast({
          title: t("deleteFailed"),
          description: t("failedToDeleteInsurer"),
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };
  
  const handleStatusChange = (value: string) => {
    setStatus(value);
    setCurrentPage(1);
  };
  
  const columns = getInsurerColumns(handleEdit, handleDelete);
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("insurersDirectory")}</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          {t("addInsurer")}
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder={t("searchInsurers")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[300px]"
          />
          <Button type="submit" variant="secondary">
            <SearchIcon className="w-4 h-4 mr-2" />
            {t("search")}
          </Button>
        </form>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm whitespace-nowrap">{t("status")}:</span>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="inactive">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DataTable
        data={insurers || []}
        columns={columns}
        isLoading={isLoading}
        error={error}
        keyField="id"
        emptyState={{
          title: t("noInsurersFound"),
          description: t("noInsurersFoundDescription"),
          action: (
            <Button onClick={refreshInsurers}>
              {t("refresh")}
            </Button>
          )
        }}
        pagination={{
          pageIndex: currentPage,
          pageSize: pageSize,
          totalItems: totalItems,
          totalPages: totalPages,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
          pageSizeOptions: [10, 25, 50, 100]
        }}
      />
      
      <AddInsurerDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSubmit={createInsurer} 
      />
      
      {selectedInsurerId && (
        <EditInsurerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          insurerId={selectedInsurerId}
          onSubmit={updateInsurer}
        />
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDeletion")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteInsurerConfirmation")}
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

export default InsurersDirectory;
