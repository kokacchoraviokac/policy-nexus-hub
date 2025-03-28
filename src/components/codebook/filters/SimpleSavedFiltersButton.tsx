
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bookmark, Save, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CodebookFilterState } from "@/types/codebook";
import { SavedFilter } from "@/types/savedFilters";
import SaveFilterDialog from "./SaveFilterDialog";

interface SimpleSavedFiltersButtonProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (filters: CodebookFilterState) => void;
  onSaveFilter: (name: string) => void;
  onDeleteFilter: (filterId: string) => void;
  currentFilters: CodebookFilterState;
  isSaving?: boolean;
  isDeleting?: boolean;
  parseFilterData: (filter: SavedFilter) => CodebookFilterState;
  entityType: 'insurers' | 'clients' | 'products';
}

const SimpleSavedFiltersButton: React.FC<SimpleSavedFiltersButtonProps> = ({
  savedFilters,
  onApplyFilter,
  onSaveFilter,
  onDeleteFilter,
  currentFilters,
  isSaving = false,
  isDeleting = false,
  parseFilterData,
  entityType
}) => {
  const { t } = useLanguage();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const handleSave = async (name: string) => {
    await onSaveFilter(name);
    setIsSaveDialogOpen(false);
  };

  return (
    <>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFilter(filter.id);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsSaveDialogOpen(true)} 
            className="cursor-pointer"
          >
            <Save className="h-4 w-4 mr-2" />
            {t("saveCurrentFilter")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SaveFilterDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSave}
        isSaving={isSaving}
        filterCount={Object.keys(currentFilters).length}
        filters={currentFilters}
        entityType={entityType}
      />
    </>
  );
};

export default SimpleSavedFiltersButton;
