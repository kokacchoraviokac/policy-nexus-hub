
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CodebookFilterState } from "@/types/codebook";

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: CodebookFilterState;
  onSaveFilter: (name: string, filters: CodebookFilterState) => Promise<void>;
  entityType: 'insurers' | 'clients' | 'products';
}

const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  open,
  onOpenChange,
  currentFilters,
  onSaveFilter,
  entityType
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [filterName, setFilterName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const hasActiveFilters = Object.entries(currentFilters).some(([key, value]) => {
    if (key === 'status') return value && value !== 'all';
    if (typeof value === 'string') return value && value.trim() !== '';
    return value !== null && value !== undefined;
  });

  const handleSave = async () => {
    if (!filterName.trim()) {
      toast({
        title: t("error"),
        description: t("pleaseEnterFilterName"),
        variant: "destructive",
      });
      return;
    }

    if (!hasActiveFilters) {
      toast({
        title: t("warning"),
        description: t("noActiveFiltersToSave"),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSaveFilter(filterName, currentFilters);
      toast({
        title: t("success"),
        description: t("filterSavedSuccessfully"),
      });
      setFilterName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving filter:", error);
      toast({
        title: t("error"),
        description: t("errorSavingFilter"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("saveCurrentFilter")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filterName" className="text-right">
              {t("filterName")}
            </Label>
            <Input
              id="filterName"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="col-span-3"
              placeholder={t("enterFilterName")}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !filterName.trim() || !hasActiveFilters}>
            {isSaving ? t("saving") : t("saveFilter")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveFilterDialog;
