
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bookmark, Save, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CodebookFilterState } from "@/types/codebook";
import { SavedFilter } from "@/types/savedFilters";

interface SimpleSavedFiltersButtonProps {
  savedFilters: SavedFilter[];
  onApplyFilter: (filters: CodebookFilterState) => void;
  onSaveFilter: (name: string, filters: CodebookFilterState) => void;
  onDeleteFilter: (filterId: string) => void;
  currentFilters: CodebookFilterState;
  isSaving?: boolean;
  isDeleting?: boolean;
  parseFilterData: (filter: SavedFilter) => CodebookFilterState;
}

const SimpleSavedFiltersButton: React.FC<SimpleSavedFiltersButtonProps> = ({
  savedFilters,
  onApplyFilter,
  onSaveFilter,
  onDeleteFilter,
  currentFilters,
  isSaving = false,
  isDeleting = false,
  parseFilterData
}) => {
  const { t } = useLanguage();
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  const handleSave = () => {
    if (!filterName.trim()) return;
    onSaveFilter(filterName, currentFilters);
    setFilterName("");
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
          <DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
            <Save className="h-4 w-4 mr-2" />
            {t("saveCurrentFilter")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("saveFilter")}</DialogTitle>
            <DialogDescription>
              {t("enterNameForFilter")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filter-name" className="text-right">
                {t("filterName")}
              </Label>
              <Input
                id="filter-name"
                className="col-span-3"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder={t("myFilterName")}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button 
              type="submit" 
              onClick={handleSave} 
              disabled={!filterName.trim() || isSaving}
            >
              {isSaving ? t("saving") : t("saveFilter")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SimpleSavedFiltersButton;
