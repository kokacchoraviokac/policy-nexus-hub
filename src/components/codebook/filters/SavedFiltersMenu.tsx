
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bookmark, Trash2, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { CodebookFilterState, SavedFilter } from "@/types/codebook";

interface SavedFiltersMenuProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (filter: CodebookFilterState) => void;
  onDeleteFilter: (filterId: string) => Promise<void>;
  onOpenSaveDialog: () => void;
  entityType: 'insurers' | 'clients' | 'products';
}

const SavedFiltersMenu: React.FC<SavedFiltersMenuProps> = ({
  savedFilters,
  onApplyFilter,
  onDeleteFilter,
  onOpenSaveDialog,
  entityType
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleDeleteFilter = async (e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    try {
      await onDeleteFilter(filterId);
      toast({
        title: t("success"),
        description: t("filterDeletedSuccessfully"),
      });
    } catch (error) {
      console.error("Error deleting filter:", error);
      toast({
        title: t("error"),
        description: t("errorDeletingFilter"),
        variant: "destructive",
      });
    }
  };

  const parseFilterData = (filterData: SavedFilter): CodebookFilterState => {
    try {
      if (typeof filterData.filters === 'string') {
        return JSON.parse(filterData.filters) as CodebookFilterState;
      }
      
      if (typeof filterData.filters === 'object' && filterData.filters !== null) {
        return filterData.filters as unknown as CodebookFilterState;
      }
      
      return {};
    } catch (error) {
      console.error("Error parsing filter data:", error);
      return {};
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          {t("savedFilters")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("savedFilters")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {savedFilters.length === 0 ? (
          <DropdownMenuItem disabled>{t("noSavedFilters")}</DropdownMenuItem>
        ) : (
          savedFilters.map((filter) => (
            <DropdownMenuItem
              key={filter.id}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => onApplyFilter(parseFilterData(filter))}
            >
              <span className="truncate">{filter.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive"
                onClick={(e) => handleDeleteFilter(e, filter.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onOpenSaveDialog}>
          <Save className="h-4 w-4 mr-2" />
          {t("saveCurrentFilter")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SavedFiltersMenu;
