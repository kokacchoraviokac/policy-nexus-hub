
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { CodebookFilterState } from "@/types/codebook";
import { EntityType } from "@/types/savedFilters";

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  isSaving?: boolean;
  filterCount?: number;
  filters?: CodebookFilterState;
  entityType?: EntityType;
}

const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  isSaving = false,
  filterCount,
  filters,
  entityType
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError(t("filterNameRequired"));
      return;
    }
    onSave(name);
  };

  const handleClose = () => {
    setName("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("saveFilter")}</DialogTitle>
          <DialogDescription>
            {filterCount
              ? t("saveFilterDescriptionWithCount", { count: filterCount })
              : t("saveFilterDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filter-name">{t("filterName")}</Label>
            <Input
              id="filter-name"
              placeholder={t("enterFilterName")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setError("");
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t("saving") : t("saveFilter")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveFilterDialog;
