
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodebookFilterState } from "@/types/codebook";
import { useToast } from "@/hooks/use-toast";

interface SaveFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<void>;
  entityType: "clients" | "insurers" | "products"; 
  isLoading?: boolean;
}

const SaveFilterDialog: React.FC<SaveFilterDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  entityType,
  isLoading = false
}) => {
  const [filterName, setFilterName] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    if (!filterName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a filter name",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave(filterName);
      setFilterName("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save filter",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Current Filter</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filterName" className="text-right">
              Filter name
            </Label>
            <Input
              id="filterName"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save filter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveFilterDialog;
