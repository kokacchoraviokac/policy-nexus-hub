
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, Filter, Save, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { CodebookFilterState, SavedFilter } from "@/types/codebook";
import SaveFilterDialog from "./SaveFilterDialog";
import DeleteSavedFilterConfirmation from "./DeleteSavedFilterConfirmation";
import { useSavedFilters } from "@/hooks/useSavedFilters";

interface SavedFiltersMenuProps {
  entityType: "clients" | "insurers" | "products";
  currentFilters: CodebookFilterState;
  onLoadFilter: (filter: CodebookFilterState) => void;
}

const SavedFiltersMenu: React.FC<SavedFiltersMenuProps> = ({ entityType, currentFilters, onLoadFilter }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<SavedFilter | null>(null);

  const { 
    savedFilters, 
    isLoading, 
    error, 
    saveFilter,
    deleteFilter 
  } = useSavedFilters(entityType);

  const handleSaveFilter = async (name: string) => {
    try {
      await saveFilter(name, currentFilters);
      setSaveDialogOpen(false);
      toast({
        title: t("filterSaved"),
        description: t("filterSavedSuccessfully"),
      });
    } catch (error) {
      console.error("Error saving filter:", error);
      toast({
        title: t("errorSavingFilter"),
        description: t("pleaseTryAgain"),
        variant: "destructive",
      });
    }
  };

  const handleDeleteFilter = async () => {
    if (!selectedFilter) return;
    
    try {
      await deleteFilter(selectedFilter.id);
      setDeleteDialogOpen(false);
      toast({
        title: t("filterDeleted"),
        description: t("filterDeletedSuccessfully"),
      });
    } catch (error) {
      console.error("Error deleting filter:", error);
      toast({
        title: t("errorDeletingFilter"),
        description: t("pleaseTryAgain"),
        variant: "destructive",
      });
    }
  };

  if (error) {
    console.error("Error loading saved filters:", error);
  }

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {t("savedFilters")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {isLoading ? (
            <DropdownMenuItem disabled>{t("loading")}</DropdownMenuItem>
          ) : savedFilters.length === 0 ? (
            <DropdownMenuItem disabled>{t("noSavedFilters")}</DropdownMenuItem>
          ) : (
            savedFilters.map((filter) => (
              <DropdownMenuItem
                key={filter.id}
                onClick={() => {
                  onLoadFilter(filter.filters as CodebookFilterState);
                  toast({
                    title: t("filterLoaded"),
                    description: t("filterLoadedSuccessfully"),
                  });
                }}
                className="flex justify-between items-center"
              >
                <span>{filter.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFilter(filter);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuItem
            onClick={() => setSaveDialogOpen(true)}
            className="flex items-center text-primary"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("saveCurrentFilter")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        onClick={() => setSaveDialogOpen(true)}
        className="flex items-center"
      >
        <Save className="h-4 w-4 mr-2" />
        {t("saveFilter")}
      </Button>

      <SaveFilterDialog
        open={isSaveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveFilter}
      />

      <DeleteSavedFilterConfirmation
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteFilter}
        filterName={selectedFilter?.name}
      />
    </div>
  );
};

export default SavedFiltersMenu;
