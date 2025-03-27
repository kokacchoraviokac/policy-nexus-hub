
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { CodebookFilterState } from "@/types/codebook";

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, filters: CodebookFilterState) => Promise<void>;
  filters: CodebookFilterState;
  entityType: 'insurers' | 'clients' | 'products';
}

const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  filters,
  entityType
}) => {
  const { t } = useLanguage();
  const [filterName, setFilterName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!filterName.trim()) return;
    
    setIsSaving(true);
    try {
      await onSave(filterName, filters);
      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFilterName("");
    onOpenChange(false);
  };

  const getEntityLabel = () => {
    switch (entityType) {
      case 'insurers':
        return t("insurers");
      case 'clients':
        return t("clients");
      case 'products':
        return t("products");
      default:
        return t("items");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("saveFilter")}</DialogTitle>
          <DialogDescription>
            {t("saveFilterDescription", { entity: getEntityLabel() })}
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
          <Button variant="outline" onClick={handleClose}>
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
  );
};

export default SaveFilterDialog;
