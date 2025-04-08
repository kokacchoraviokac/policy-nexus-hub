
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<void>;
}

const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const { t } = useLanguage();
  const [filterName, setFilterName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterName.trim()) return;

    setIsSaving(true);
    try {
      await onSave(filterName.trim());
      setFilterName("");
    } catch (error) {
      console.error("Error saving filter:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("saveFilter")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filterName">{t("filterName")}</Label>
              <Input
                id="filterName"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder={t("enterFilterName")}
                autoFocus
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFilterName("");
                onOpenChange(false);
              }}
              disabled={isSaving}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!filterName.trim() || isSaving}>
              {isSaving ? t("saving") : t("save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveFilterDialog;
