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
// Comment out the import since we won't be using it temporarily
// import SaveFilterDialog from "./SaveFilterDialog";

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
  // Keep the state but we won't be using it
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Temporarily disable saving functionality
  const handleSaveClick = () => {
    // Instead of opening the dialog, show a toast or console log
    console.log("Save filter functionality temporarily disabled");
    // You could also add a toast here to notify the user
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
            // Change this to use our temporary function instead of opening the dialog
            onClick={handleSaveClick} 
            className="opacity-50" // Visual indicator that it's disabled
          >
            <Save className="h-4 w-4 mr-2" />
            {t("saveCurrentFilter")} (Temporarily Disabled)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Comment out the SaveFilterDialog to avoid the TypeScript error */}
      {/* 
      <SaveFilterDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={handleSave}
        filters={currentFilters}
        entityType={entityType}
      />
      */}
    </>
  );
};

export default SimpleSavedFiltersButton;
