
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, MoreHorizontal, Save, Bookmark } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSavedFilters } from "@/hooks/useSavedFilters";
import { useToast } from "@/hooks/use-toast";
import { SaveFilterDialog } from "./SaveFilterDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteSavedFilterConfirmation from "./DeleteSavedFilterConfirmation";
import { CodebookFilterState } from "@/types/codebook";

interface SavedFiltersMenuProps {
  entityType: string;
  onSelectFilter: (filters: CodebookFilterState) => void;
  currentFilters: CodebookFilterState;
  defaultFilters: CodebookFilterState;
  isFiltersApplied: boolean;
}

const SavedFiltersMenu: React.FC<SavedFiltersMenuProps> = ({
  entityType,
  onSelectFilter,
  currentFilters,
  defaultFilters,
  isFiltersApplied,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const { 
    savedFilters, 
    isLoading, 
    createFilter, 
    deleteFilter 
  } = useSavedFilters(entityType);
  
  const handleClearFilters = () => {
    onSelectFilter({ status: defaultFilters.status || "all" });
    toast({
      title: t("filtersCleared"),
      description: t("allFiltersHaveBeenCleared")
    });
  };
  
  const handleSaveFilter = async (name: string) => {
    try {
      await createFilter({
        name,
        filters: currentFilters,
        entity_type: entityType
      });
      setSaveDialogOpen(false);
      toast({
        title: t("filterSaved"),
        description: t("filterSavedSuccessfully")
      });
    } catch (error) {
      console.error("Error saving filter:", error);
      toast({
        title: t("errorSavingFilter"),
        description: t("failedToSaveFilter"),
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteFilter = async () => {
    if (!selectedFilter) return;
    
    try {
      await deleteFilter(selectedFilter);
      setDeleteDialogOpen(false);
      toast({
        title: t("filterDeleted"),
        description: t("filterDeletedSuccessfully")
      });
    } catch (error) {
      console.error("Error deleting filter:", error);
      toast({
        title: t("errorDeletingFilter"),
        description: t("failedToDeleteFilter"),
        variant: "destructive"
      });
    }
  };
  
  const handleSelectFilter = (filters: CodebookFilterState) => {
    onSelectFilter(filters);
    toast({
      title: t("filterApplied"),
      description: t("savedFilterHasBeenApplied")
    });
  };
  
  const handleOpenDeleteDialog = (filterId: string) => {
    setSelectedFilter(filterId);
    setDeleteDialogOpen(true);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            {t("savedFilters")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("saveCurrentFilters")}
          </DropdownMenuItem>
          
          {isFiltersApplied && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleClearFilters}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {t("clearAllFilters")}
              </DropdownMenuItem>
            </>
          )}
          
          {savedFilters && savedFilters.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[200px]">
                {savedFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground">
                    <div 
                      className="flex-1 cursor-pointer text-sm"
                      onClick={() => handleSelectFilter(filter.filters)}
                    >
                      {filter.name}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDeleteDialog(filter.id)}>
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </ScrollArea>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <SaveFilterDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveFilter}
      />
      
      <DeleteSavedFilterConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteFilter}
      />
    </>
  );
};

export default SavedFiltersMenu;
